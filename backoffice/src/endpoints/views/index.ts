import { getTranslations, translate } from './../../helpers/request-handler';
import { Knex } from 'knex';
import { throwViewError } from './../../helpers/exceptions';
import { renderTemplate } from './../../helpers/template';
import { Router, Response, Request } from "express";
import { ApiExtensionContext } from "@directus/shared/types";
import { v4 } from "uuid";
import User from '../../@types/user';
import { Product } from '../../@types/product';
import { basePieConfig, baseTimeSeriesConfig } from '../../consts/chart';
import { decodeToken, getAdminTokens } from '../../helpers/auth';
import { Accountability } from "@directus/shared/types";
import { ItemsService } from 'directus';
import { isPropertyEmpty } from '../../helpers/validation';

export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {
    router.get('/ssr', async (req: Request, res: Response) => {
        res.send("");
    });

    router.get('/order', async (req: Request, res: Response) => {
        try {
            renderTemplate(req, res,
                {},
                "order",
                "liquid",
                "intl",
                database
            )
        } catch (error) {
            throwViewError(req, res, "intl", database as Knex | null);
        }
    });

    router.get('/panel', async (req: Request, res: Response) => {
        try {
            const accountability: Accountability = (req as Record<string, any>)?.accountability;
            const productFilter: Record<string, any> = {}
            if (accountability?.admin != true) productFilter.user_created = accountability.user;
            const products: Product[] = await database("products").where(productFilter)
                .select("id", "price", "date_created").limit(25);
            console.log(accountability);
            const labels = []
            const data = []
            for (const product of products) {
                labels.push(new Date(product.date_created).toDateString())
                // new Intl.NumberFormat("fr-FR", { style: "currency", currency: 'XOF' }).format(Number(product.price))
                data.push(product.price)
            }

            const chartConfig: any = {
                ...baseTimeSeriesConfig,
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        ...baseTimeSeriesConfig.data.datasets[0],
                        label: "produits",
                        data: data,
                    }],
                },
                options: {
                    ...baseTimeSeriesConfig.options,
                    scales: {
                        ...baseTimeSeriesConfig.options.scales,
                        yAxes: [
                            {
                                ...baseTimeSeriesConfig.options.scales.yAxes[0],
                                ticks: {
                                    ...baseTimeSeriesConfig.options.scales.yAxes[0].ticks,
                                    // @ts-ignore
                                    callback: function (value, index, values) {
                                        return value;
                                    }
                                }
                            }
                        ],
                    },
                    legend: {
                        ...baseTimeSeriesConfig.options.legend,
                    },
                    tooltips: {
                        ...baseTimeSeriesConfig.options.tooltips,

                        callbacks: {
                            // @ts-ignore-ignore
                            label: function (tooltipItem, chart) {
                                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                                return datasetLabel + ': ' + tooltipItem.yLabel;
                            }
                        }

                    }
                }
            }

            renderTemplate(req, res,
                {
                    chartConfig
                },
                "time-series",
                "liquid",
                "intl",
                database
            )
        } catch (error) {
            throwViewError(req, res, "intl", database as Knex | null);
        }
    });

    router.get('/panel/lunchGeneral', async (req: Request, res: Response) => {

        type OrderData = {
            user_created: string,
            date_created: string,
            product_id: number,
            quantity: number,
            price: number
        }

        try {
            const accountability: Accountability = (req as Record<string, any>)?.accountability;
            const language = 'fr-FR'
            const currency = 'XOF'
            const revenuesLabels: any[] = []
            const revenuesData: any[] = []
            const currentYear = new Date().getFullYear();
            const dashboardData = {
                totalRevenues: 0,
                totalRevenuesDisplay: '',
                totalCompletedOrders: 0,
                totalProductsAmount: 0,
                totalProductsDisplayAmount: '',
                totalEmployees: 0,
                mostOrderedProducts: [] as Record<string, any>[],
                mostOrderedCategories: [] as Record<string, any>[]
            }

            const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
            for (let i = 0; i < months.length; i++) {
                // const symbol = `${i+1}`.length > 1 ? `${i+1}` : `0${i+1}`;
                const ordersData: OrderData[] = await database('orders').select('orders.user_created', 'orders.date_created', 'orders.product_id', 'orders.quantity', 'products.price')
                    .whereRaw(`orders.user_created = '${accountability.user}' AND MONTH(orders.date_created) = ${i + 1} AND YEAR(orders.date_created)=${currentYear} AND orders.completed=1 AND orders.status='published'`)
                    .rightJoin('products', 'orders.product_id', 'products.id');
                let amount = 0;
                for (const orderData of ordersData) {
                    amount += (orderData.price * orderData.quantity)
                    dashboardData.totalCompletedOrders += 1
                }
                dashboardData.totalRevenues += amount
                revenuesData.push(amount)
                revenuesLabels.push(months[i])
            }

            const [mostOrderedProducts]: Record<string, any>[][] = await database.raw(`
                SELECT products.title, products.image, orders.product_id, SUM(orders.quantity * products.price) as total, COUNT(orders.product_id) AS count FROM orders 
                RIGHT JOIN products ON orders.product_id = products.id
                WHERE orders.user_created = '${accountability.user}' AND YEAR(orders.date_created)=${currentYear} AND orders.status='published'
                GROUP BY orders.product_id 
                ORDER BY count DESC
                LIMIT 5
            `)

            if (mostOrderedProducts.length != 0) {
                for (const product of mostOrderedProducts) {
                    dashboardData.mostOrderedProducts.push({
                        ...product,
                        unitPrice: new Intl.NumberFormat(language, { style: "currency", currency: currency }).format(product.total / product.count),
                        total: new Intl.NumberFormat(language, { style: "currency", currency: currency }).format(product.total)
                    })
                }
            }

            const [mostOrderedCategories]: Record<string, any>[][] = await database.raw(`
                SELECT categories.title, categories.thumb, products.cat_id, SUM(orders.quantity * products.price) as total, COUNT(products.cat_id) AS count FROM orders 
                RIGHT JOIN products ON orders.product_id = products.id
                RIGHT JOIN categories ON categories.id = products.cat_id
                WHERE orders.user_created = '${accountability.user}' AND YEAR(orders.date_created)= ${currentYear} AND orders.status='published'
                GROUP BY products.cat_id 
                ORDER BY count DESC
                LIMIT 5
            `)

            if (mostOrderedCategories.length != 0) {
                for (const category of mostOrderedCategories) {
                    dashboardData.mostOrderedCategories.push({
                        ...category,
                        total: new Intl.NumberFormat(language, { style: "currency", currency: currency }).format(category.total)
                    })
                }
            }


            const products = await database('products').select('price', 'quantity')
                .whereRaw(`user_created = '${accountability.user}' AND status='published'`)

            for (const product of products) {
                dashboardData.totalProductsAmount += (product.price * product.quantity)
            }

            const users = await database('users').select('id', 'type').where({ user_created: accountability.user })
            dashboardData.totalEmployees = users.length;
            dashboardData.totalProductsDisplayAmount = new Intl.NumberFormat(language, { style: "currency", currency: currency }).format(Number(dashboardData.totalProductsAmount));
            dashboardData.totalRevenuesDisplay = new Intl.NumberFormat(language, { style: "currency", currency: currency }).format(Number(dashboardData.totalRevenues));

            const revenuesChartConfig: any = {
                ...baseTimeSeriesConfig,
                type: 'line',
                data: {
                    labels: revenuesLabels,
                    datasets: [{
                        ...baseTimeSeriesConfig.data.datasets[0],
                        label: "montant total",
                        data: revenuesData,
                    }],
                },
                options: {
                    ...baseTimeSeriesConfig.options,
                    scales: {
                        ...baseTimeSeriesConfig.options.scales,
                        yAxes: [
                            {
                                ...baseTimeSeriesConfig.options.scales.yAxes[0],
                                ticks: {
                                    ...baseTimeSeriesConfig.options.scales.yAxes[0].ticks,
                                    // @ts-ignore
                                    callback: function (value, index, values) {
                                        return new Intl.NumberFormat("fr-FR", { style: "currency", currency: 'XOF' }).format(Number(value));
                                    }
                                }
                            }
                        ],
                    },
                    legend: {
                        ...baseTimeSeriesConfig.options.legend,
                    },
                    tooltips: {
                        ...baseTimeSeriesConfig.options.tooltips,

                        callbacks: {
                            // @ts-ignore-ignore
                            label: function (tooltipItem, chart) {
                                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                                return datasetLabel + ': ' + tooltipItem.yLabel;
                            }
                        }

                    }
                }
            }

            const employeesPieConfig: any = {
                ...basePieConfig,
                data: {
                    labels: ["Serveurs", "Cuisiniers"],
                    datasets: [{
                        data: [
                            users.filter(user => user.type == 'waiter').length,
                            users.filter(user => user.type == 'chef').length
                        ],
                        backgroundColor: ['#1cc88a', '#36b9cc'],
                        hoverBackgroundColor: ['#17a673', '#2c9faf'],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                    }],
                }
            }

            renderTemplate(req, res,
                {
                    revenuesChartConfig,
                    dashboardData,
                    employeesPieConfig,
                    accessToken: (req as Record<string, any>)?.token
                },
                "lunch/general-insight",
                "liquid",
                "intl",
                database
            )
        } catch (error) {
            throwViewError(req, res, "intl", database as Knex | null);
        }
    });

    router.get('/panel/lunchProductsDetails', async (req: Request, res: Response) => {

        try {
            const accountability: Accountability = (req as Record<string, any>)?.accountability;
            const language = 'fr-FR'
            const currency = 'XOF'
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            const currentDay = new Date().getDate();


            const dashboardData = {
                totalAddedProductsToday: 0
            }

            const addedProductsToday = await database('products').select('date_created', 'user_created')
                .whereRaw(`user_created = '${accountability.user}' AND DAY(date_created)=${currentDay} AND MONTH(date_created) = ${currentMonth} AND YEAR(date_created)=${currentYear} AND status='published'`)

            dashboardData.totalAddedProductsToday = addedProductsToday.length


            renderTemplate(req, res,
                {
                    dashboardData
                },
                "lunch/product-insight",
                "liquid",
                "intl",
                database
            )

        } catch (error) {
            throwViewError(req, res, "intl", database as Knex | null);
        }
    });

    router.get('/panel/lunchOrdersDetails', async (req: Request, res: Response) => {

        try {
            const accountability: Accountability = (req as Record<string, any>)?.accountability;
            const language = 'fr-FR'
            const currency = 'XOF'
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            const currentDay = new Date().getDate();


            const dashboardData = {
                totalAddedOrdersToday: 0,
                totalCompletedOrdersToday: 0,
                totalCompletedOrdersTodayAmount: '',
            }


            const addedOrdersToday: Record<string, any>[] = await database('orders').select('orders.user_created', 'orders.date_created', 'orders.product_id', 'orders.quantity', 'products.price')
                .whereRaw(`orders.user_created = '${accountability.user}' AND DAY(orders.date_created) = ${currentDay} AND MONTH(orders.date_created) = ${currentMonth} AND YEAR(orders.date_created)=${currentYear} AND orders.status='published'`)
                .rightJoin('products', 'orders.product_id', 'products.id');

            const completedOrdersToday: Record<string, any>[] = await database('orders').select('orders.user_created', 'orders.date_created', 'orders.date_completed', 'orders.product_id', 'orders.quantity', 'products.price')
                .whereRaw(`orders.user_created = '${accountability.user}' AND DAY(orders.date_completed) = ${currentDay} AND MONTH(orders.date_completed) = ${currentMonth} AND YEAR(orders.date_completed)=${currentYear} AND orders.completed=1 AND orders.status='published'`)
                .rightJoin('products', 'orders.product_id', 'products.id');

            dashboardData.totalAddedOrdersToday = addedOrdersToday.length
            dashboardData.totalCompletedOrdersToday = completedOrdersToday.length
            let total = 0
            for (const completedOrderToday of completedOrdersToday) {
                total += (completedOrderToday.price * completedOrderToday.quantity)
            }
            dashboardData.totalCompletedOrdersTodayAmount = new Intl.NumberFormat(language, { style: "currency", currency: currency }).format(total);

            renderTemplate(req, res,
                {
                    dashboardData
                },
                "lunch/order-insight",
                "liquid",
                "intl",
                database
            )

        } catch (error) {
            throwViewError(req, res, "intl", database as Knex | null);
        }
    });

    router.get('/detail/lunchProducts/:id', async (req: Request, res: Response) => {

        try {

            const accountability: Accountability = (req as Record<string, any>)?.accountability;
            const productId = req.params.id
            const language = 'fr-FR'
            const currency = 'XOF'
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            const currentDay = new Date().getDate();

            const [product]: Record<string, any>[] = await database("products").where({ user_created: accountability?.user, id: req.params.id }).limit(1)


            // const [{totalOrdersCount}]: Record<string, any>[] = await database("orders")
            // .select('COUNT(orders.id) as totalOrdersCount')
            // .rightJoin('products', 'products.id', 'orders.product_id')
            // .whereRaw(`orders.user_created = ${accountability?.user} AND orders.product_id=${req.params.id}`)            
            // .limit(1)

            const [productValue]: Record<string, any>[][] = await database.raw(`
                SELECT products.title, products.image, orders.product_id, SUM(orders.quantity * products.price) as total, COUNT(orders.product_id) AS count FROM orders 
                RIGHT JOIN products ON orders.product_id = products.id
                WHERE orders.user_created = '${accountability.user}' AND YEAR(orders.date_created)=${currentYear} AND orders.status='published' AND products.id = ${productId} AND orders.completed=1
                GROUP BY orders.product_id 
                ORDER BY count DESC
            `)


            const [dailyProductValue]: Record<string, any>[][] = await database.raw(`
            SELECT products.title, products.image, orders.product_id, SUM(orders.quantity * products.price) as total, COUNT(orders.product_id) AS count FROM orders 
            RIGHT JOIN products ON orders.product_id = products.id
            WHERE orders.user_created = '${accountability.user}' AND YEAR(orders.date_created)=${currentYear} AND MONTH(orders.date_created)=${currentMonth} AND DAY(orders.date_created)=${currentDay} AND orders.status='published' AND products.id = ${productId} AND orders.completed=1
            GROUP BY orders.product_id 
            ORDER BY count DESC
        `)


            const [totalProductValue]: Record<string, any>[][] = await database.raw(`
                SELECT COUNT(orders.product_id) AS count FROM orders 
                RIGHT JOIN products ON orders.product_id = products.id
                WHERE orders.user_created = '${accountability.user}' AND YEAR(orders.date_created)=${currentYear} AND orders.status='published' AND products.id = ${productId}
                GROUP BY orders.product_id 
                ORDER BY count DESC
            `)

            const revenuesData = []
            const revenuesLabels = []

            const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
            for (let i = 0; i < months.length; i++) {
                // const symbol = `${i+1}`.length > 1 ? `${i+1}` : `0${i+1}`;
                const ordersData: Record<string, any>[] = await database('orders').select('orders.user_created', 'orders.date_created', 'orders.product_id', 'orders.quantity', 'products.price')
                    .whereRaw(`orders.user_created = '${accountability.user}' AND MONTH(orders.date_created) = ${i + 1} AND YEAR(orders.date_created)=${currentYear} AND orders.completed=1 AND orders.status='published' AND products.id = ${productId}`)
                    .rightJoin('products', 'orders.product_id', 'products.id');
                let amount = 0;
                for (const orderData of ordersData) {
                    amount += (orderData.price * orderData.quantity)
                }
                revenuesData.push(amount)
                revenuesLabels.push(months[i])
            }

            const data = {
                product: product,
                totalPrice: new Intl.NumberFormat(language, { style: "currency", currency: currency }).format(product.price * product.quantity),
                totalSoldPrice: '0',
                totalCompletedOrders: 0,
                totalOrders: 0,
                unitPrice: new Intl.NumberFormat(language, { style: "currency", currency: currency }).format(product.price),
                dailySoldPrice: '0',
                dailyCompletedOrders: '0'
            }


            if (productValue.length > 0) {
                data.totalCompletedOrders = productValue[0].count
                data.totalSoldPrice = new Intl.NumberFormat(language, { style: "currency", currency: currency }).format(productValue[0].total)
            }

            if (totalProductValue.length > 0) {
                data.totalOrders = totalProductValue[0].count
            }

            if (dailyProductValue.length > 0) {
                data.dailyCompletedOrders = dailyProductValue[0].count
                data.dailySoldPrice = new Intl.NumberFormat(language, { style: "currency", currency: currency }).format(dailyProductValue[0].total)
            }
            // data.totalPrice = new Intl.NumberFormat(language, { style: "currency", currency: currency }).format(product.price * product.quantity) 

            const revenuesChartConfig: any = {
                ...baseTimeSeriesConfig,
                type: 'line',
                data: {
                    labels: revenuesLabels,
                    datasets: [{
                        ...baseTimeSeriesConfig.data.datasets[0],
                        label: "montant total",
                        data: revenuesData,
                    }],
                },
                options: {
                    ...baseTimeSeriesConfig.options,
                    scales: {
                        ...baseTimeSeriesConfig.options.scales,
                        yAxes: [
                            {
                                ...baseTimeSeriesConfig.options.scales.yAxes[0],
                                ticks: {
                                    ...baseTimeSeriesConfig.options.scales.yAxes[0].ticks,
                                    // @ts-ignore
                                    callback: function (value, index, values) {
                                        return new Intl.NumberFormat("fr-FR", { style: "currency", currency: 'XOF' }).format(Number(value));
                                    }
                                }
                            }
                        ],
                    },
                    legend: {
                        ...baseTimeSeriesConfig.options.legend,
                    },
                    tooltips: {
                        ...baseTimeSeriesConfig.options.tooltips,

                        callbacks: {
                            // @ts-ignore-ignore
                            label: function (tooltipItem, chart) {
                                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                                return datasetLabel + ': ' + tooltipItem.yLabel;
                            }
                        }

                    }
                }
            }

            renderTemplate(req, res,
                {
                    data,
                    revenuesChartConfig
                },
                "lunch/product-details",
                "liquid",
                "intl",
                database
            )

        } catch (error) {
            console.log(error);

            throwViewError(req, res, "intl", database as Knex | null);
        }
    });


};