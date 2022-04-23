import { calculateDiscount, verifyCouponCode, useCouponCode } from './../../helpers/order';
import { CardDetail } from './../../@types/card';
import { Order } from './../../@types/order';
import { random } from './../../helpers/string';
import { AppSettings } from './../../@types/global';
import { getRequestParams } from './../../helpers/request-handler'; 
import { ApiExtensionContext } from '@directus/shared/types';
import { Router, Request, Response } from "express";
import { throwError} from '../../helpers/exceptions';
import Joi from "joi";
import * as authHandler from "../../helpers/auth";
import { getJoiError } from '../../helpers/validation';
import { ItemsService } from 'directus';
import { ObjectToEqFilter } from '../../helpers/directus';
import { PrimaryKey } from 'directus/dist/types';
import { Product } from '../../@types/product';
import { v4 } from "uuid";


export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {
    

    router.post('/addToViews', async (req: Request, res: Response) => {
        try { 
            const validationSchema = Joi.object({    
                product_id: Joi.number().required()
                .label("Veuillez sélectionner un produit"),
            })
            const validationResult = validationSchema.validate(req.body);
            
            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);

            const { schema, accountability } = getRequestParams(req);
            const { decoded } = authHandler.decodeToken(req);

            const itemService = new ItemsService("product_views", { knex: database, schema, accountability});
            const filter = {
                product_id: req.body.product_id,
                user_created: decoded?.id
            }
            const productViews = await itemService.readByQuery({filter: ObjectToEqFilter(filter), limit: 1})
            let times = 1;
            let itemKey: PrimaryKey = -1;

            if(productViews.length > 0){
                times = productViews[0].times+1;
                itemKey = productViews[0].id;
                await itemService.updateByQuery({filter: ObjectToEqFilter(filter)}, {times: times})
            }else{
                itemKey = await itemService.createOne(filter);
            }
            res.json({data: {id: itemKey, product_id: req.body.product_id, times: times}})
        } catch (error) {
            console.log(error);
            return throwError(res); 
        }
	}); 

    router.post('/calculatePrice', async (req: Request, res: Response) => {
        try { 
            const [ shippingTypesField ] = await database('directus_fields').select("id", "options").where({
                field: "shipping_type", collection: "orders"
            }).limit(1)

            const shippingTypes = JSON.parse(shippingTypesField.options).choices.reduce( (a: any, currentValue: any)=> [...a, currentValue.value], [])

            const validationSchema = Joi.object({   
                card_details: Joi.array().custom((value)=> {
                    const validator = Joi.object({
                        id: Joi.number().required(),
                        quantity: Joi.number().min(1).required(),
                        option: Joi.string().allow(null),
                        color: Joi.string().allow(null)
                    })
                    for (const cardDetail of (value as CardDetail[])) {
                        if(validator.validate(cardDetail).error) throw new Error("")
                    }
                }).label("Veuillez entrer des ajouter des produits à votre panier"),

                shipping_type: Joi.string()
                .custom((value)=> {if(!shippingTypes.includes(value)) throw new Error("")}).required()
                .label("Veuillez sélectionner un type de livraison correcte"),

                coupon: Joi.string().allow(null)
                .label("Veuillez entrer un coupon correcte"),
            })

            let couponData: Record<string, any> | null = {discount_percentage: 0}

            if(req.body.coupon != null){
                couponData = await verifyCouponCode(database, req.body.coupon, "to_order");
                if(couponData == null) return throwError(res, "Coupon invalide", 400);
            }


            const validationResult = validationSchema.validate(req.body);
            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);

            const [ appSettings ]: AppSettings[] = await database("configurations");
            let price = 0
            let shippingPrice = 0

            for (const cardDetail of (req.body.card_details as CardDetail[])) {
                const [ product ]: Product[] = await database("products").where({id: cardDetail.id}) .limit(1)   
                price+= ( product.price * cardDetail.quantity )
                if(product.weight != 0 && product.weight != null && product.weight != undefined){
                    shippingPrice+=(appSettings.kilogram_shipping_price * product.weight * cardDetail.quantity)
                }
            }

            switch (req.body.shipping_type) {
                case "standard_home_based":
                    shippingPrice+=appSettings.standard_shipping_price
                    break;
                case "flash_home_based":
                    shippingPrice+=appSettings.flash_shipping_price
                    break;
                default:
                    break;
            }

            res.json({
                data: {
                    price: price,
                    shipping_price: shippingPrice,
                    total_price: req.body.coupon != null && couponData.discount_percentage > 0 ?  
                    calculateDiscount((price + shippingPrice), couponData.discount_percentage)
                    :   
                    price + shippingPrice,
                    discount_percentage: couponData.discount_percentage
                }
            })

        } catch (error) {
            console.log(error);
            
            return throwError(res); 
        }
	}); 

    router.get('/:id', async (req: Request, res: Response) => {
        try { 
            const { schema, accountability } = getRequestParams(req);
            const { decoded } = authHandler.decodeToken(req);
            const itemService = new ItemsService("orders", { knex: database, schema, accountability});
            const filter = {
                id: req.params.id,
                user_created: decoded?.id
            }
            const [ order ] = await itemService.readByQuery({filter: ObjectToEqFilter(filter), limit: 1})
            const orderDetails = await database("order_details").where({order_id: req.params.id})
            order.details = orderDetails
            res.json({data: order})
        } catch (error) {
            console.log(error);
            
            return throwError(res); 
        }
	}); 

    router.patch('/cancel/:id', async (req: Request, res: Response) => {
        try { 
            const { schema, accountability } = getRequestParams(req);
            const { decoded } = authHandler.decodeToken(req);
            const itemService = new ItemsService("orders", { knex: database, schema, accountability});
            const filter = {
                id: req.params.id,
                user_created: decoded?.id
            }
            
            const [ order ] = await itemService.readByQuery({filter: ObjectToEqFilter(filter), limit: 1}) as Order[]
            if(order.payment_status != "pending" || (order.shipping_status != null && order.shipping_status != "waiting_for_confirmation") || order.service_status != "pending"){
                return throwError(res, "Vous ne pouvez pas annuler cette commande", 403); 
            }
            await database("orders").update({service_status: "canceled"}).where(filter)
            const orderDetails = await database("order_details").where({order_id: req.params.id})
            order.details = orderDetails
            res.json({data: {...order, service_status: "canceled"}, message: "opération effectuée avec succès"})
        } catch (error) {
            console.log(error);

            return throwError(res); 
        }
	}); 

    router.patch('/note/:id', async (req: Request, res: Response) => {
        try { 
            const validationSchema = Joi.object({    
                note: Joi.string().required()
                .label("Veuillez entrer une note correcte"),
            })
            
            const validationResult = validationSchema.validate(req.body);
            
            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);

            const { schema, accountability } = getRequestParams(req);
            const { decoded } = authHandler.decodeToken(req);
            const itemService = new ItemsService("orders", { knex: database, schema, accountability});
            const filter = {
                id: req.params.id,
                user_created: decoded?.id
            }
            
            await database("orders").update({note: req.body.note}).where(filter)
            const orderDetails = await database("order_details").where({order_id: req.params.id})
            const [ order ] = await itemService.readByQuery({filter: ObjectToEqFilter(filter), limit: 1}) as Order[]
            order.details = orderDetails
            res.json({data: order, message: "opération effectuée avec succès"})
        } catch (error) {
            console.log(error);

            return throwError(res); 
        }
	}); 

    router.post('/create', async (req: Request, res: Response) => {
        try { 
            const [ shippingTypesField ] = await database('directus_fields').select("id", "options").where({
                field: "shipping_type", collection: "orders"
            }).limit(1)

            const shippingTypes = JSON.parse(shippingTypesField.options).choices.reduce( (a: any, currentValue: any)=> [...a, currentValue.value], [])

            const [ paymentTypesField ] = await database('directus_fields').select("id", "options").where({
                field: "payment_type", collection: "orders"
            }).limit(1)

            const paymentTypes = JSON.parse(paymentTypesField.options).choices.reduce( (a: any, currentValue: any)=> [...a, currentValue.value], [])
            
            const [ appSettings ]: AppSettings[] = await database("configurations");

            const validationSchema = Joi.object({   
                card_details: Joi.array().custom((value)=> {
                    const validator = Joi.object({
                        id: Joi.number().required(),
                        quantity: Joi.number().min(1).required(),
                        option: Joi.string().allow(null),
                        color: Joi.string().allow(null)
                    })
                    for (const cardDetail of value) {
                        if(validator.validate(cardDetail).error) throw new Error("")
                    }
                }).label("Veuillez entrer des ajouter des produits à votre panier"),

                shipping_type: Joi.string()
                .custom((value)=> {if(!shippingTypes.includes(value)) throw new Error("")}).required()
                .label("Veuillez sélectionner un type de livraison correcte"),

                note: Joi.string()
                .allow(null)
                .label("Veuillez entrer une note de commande correcte"),

                customer_first_name: Joi.string().required()
                .label("Veuillez entrer un prénom correcte"),

                customer_last_name: Joi.string().required()
                .label("Veuillez entrer un nom correcte"),

                customer_phone_number: Joi.string().required()
                .label("Veuillez entrer un numéro de téléphone correcte"),

                customer_email: Joi.string().email().required()
                .label("Veuillez entrer une adresse email correcte"),
                
                customer_country_id: Joi.number().allow(null)
                .label("Veuillez sélectionner un pays"),

                customer_state_id: Joi.number().allow(null)
                .label("Veuillez sélectionner une région"),

                customer_city_id: Joi.number().required()
                .label("Veuillez sélectionner une ville"),

                customer_address: Joi.string().required()
                .label("Veuillez sélectionner une adresse correcte"),

                customer_address_2: Joi.string().allow(null)
                .label("Veuillez sélectionner une seconde adresse correcte"),

                payment_type: Joi.string()
                .custom((value)=> {if(!paymentTypes.includes(value)) throw new Error("")}).required()
                .label("Veuillez sélectionner un moyen de paiement"),
                
                coupon: Joi.string().allow(null)
                .label("Veuillez entrer un coupon correcte"),

            })

            const validationResult = validationSchema.validate(req.body);
            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);
            
            let couponData: Record<string, any> | null = {discount_percentage: 0}

            if(req.body.coupon != null){
                couponData = await verifyCouponCode(database, req.body.coupon, "to_order");
                if(couponData == null) return throwError(res, "Coupon invalide", 400);
            }

            let price = 0
            let shippingPrice = 0
            let totalPrice = 0
            let productType = ""
            for (const cardDetail of req.body.card_details) {
                const [ product ]: Product[] = await database("products").where({id: cardDetail.id}) .limit(1)   
                productType = product.type
                price+= ( product.price * cardDetail.quantity )
                if(product.weight != 0 && product.weight != null && product.weight != undefined){
                    shippingPrice+=(appSettings.kilogram_shipping_price * product.weight * cardDetail.quantity)
                }
            }

            switch (req.body.shipping_type) {
                case "standard_home_based":
                    shippingPrice+=appSettings.standard_shipping_price
                    break;
                case "flash_home_based":
                    shippingPrice+=appSettings.flash_shipping_price
                    break;
                default:
                    break;
            }
            
            totalPrice = calculateDiscount(price + shippingPrice, couponData.discount_percentage)

            if(req.body.coupon != null) await useCouponCode(database, req.body.coupon, "to_order");
            const { decoded } = authHandler.decodeToken(req);
            const orderId = v4();
            await database("orders").insert({
                id: orderId,
                shipping_type: req.body.shipping_type,
                product_type: productType,
                note: req.body.note,
                shipper_code: random(5, "number"),
                number: `${Date.now()}${random(2, "number")}`,
                customer_first_name: req.body.customer_first_name,
                customer_last_name: req.body.customer_last_name,
                customer_phone_number: req.body.customer_phone_number,
                customer_email: req.body.customer_email,
                customer_country_id: req.body.customer_country_id || appSettings.country,
                customer_state_id: req.body.customer_state_id,
                customer_city_id: req.body.customer_city_id,
                customer_address: req.body.customer_address,
                customer_address_2: req.body.customer_address_2,
                payment_type: req.body.payment_type,
                shipping_status: "waiting_for_confirmation",
                service_status: "pending",
                price: totalPrice, 
                shipping_price: shippingPrice,
                coupon: couponData?.id || null,
                user_created: decoded?.id || null,
                date_created: new Date()
            })

            const [ order ] = await database("orders").where({id: orderId});
            order.details = req.body.card_details;
            for (const cardDetail of req.body.card_details) {
                await database("order_details").insert({
                    order_id: orderId,
                    product_id: cardDetail.id,
                    quantity: cardDetail.quantity,
                    option: cardDetail.option,
                    color: cardDetail.color,
                    user_created: decoded?.id || null,
                    date_created: new Date()
                })
            }
            
            // TODO: send email or sms to user flowwing jumia model
            // TODO: send email or sms to admin
            res.json({data: order})
        } catch (error) {
            console.log(error);
            
            return throwError(res); 
        }
	}); 

    router.post('/createVisit', async (req: Request, res: Response) => {
        try { 
            const [ visitPaymentField ] = await database('directus_fields').select("id", "options").where({
                field: "payment_type", collection: "orders"
            }).limit(1)

            const visitPaymentTypes = JSON.parse(visitPaymentField.options).choices.filter((item: Record<string, any>) => item.group == "visit").reduce( (a: any, currentValue: any)=> [...a, currentValue.value], [])

            const [ appSettings ]: AppSettings[] = await database("configurations");

            let couponData: Record<string, any> | null = {discount_percentage: 0}
            let totalPrice = 0
            if(req.body.coupon != null){
                couponData = await verifyCouponCode(database, req.body.coupon, "visit_to_ask");
                if(couponData == null) return throwError(res, "Coupon invalide", 400);
            }
            
            const validationSchema = Joi.object({  
                product_id: Joi.number().required()
                .label("Veuillez sélectionner un produit"),

                note: Joi.string()
                .allow(null)
                .label("Veuillez entrer une note de commande correcte"),

                customer_first_name: Joi.string().required()
                .label("Veuillez entrer un prénom correcte"),

                customer_last_name: Joi.string().required()
                .label("Veuillez entrer un nom correcte"),

                customer_phone_number: Joi.string().required()
                .label("Veuillez entrer un numéro de téléphone correcte"),

                customer_email: Joi.string().email().required()
                .label("Veuillez entrer une adresse email correcte"),

                starting_wished_service_date: Joi.date().required()
                .label("Veuillez sélectionner une première date souhaitée correcte"),

                ending_wished_service_date: Joi.date().required()
                .label("Veuillez sélectionner une seconde date souhaitée correcte"),

                payment_type: Joi.string()  
                .custom((value)=> {if(!visitPaymentTypes.includes(value)) throw new Error("")}).required()
                .label("Veuillez sélectionner un moyen de paiement"),
                
                coupon: Joi.string().allow(null)
                .label("Veuillez entrer un coupon correcte"),
            })

            const validationResult = validationSchema.validate(req.body);
            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);
            
            
            const [ product ]: Product[] = await database("products").where({id: req.body.product_id})

            if(product.type != "visit_to_ask") return throwError(res, "Ce produit n'est pas destiné aux demandes de visite", 400);

            totalPrice = calculateDiscount(appSettings.visit_price, couponData.discount_percentage)
            if(req.body.coupon != null) await useCouponCode(database, req.body.coupon, "visit_to_ask");
            const { decoded } = authHandler.decodeToken(req);
            const orderId = v4();
            await database("orders").insert({
                id: orderId,
                product_type: product.type,
                note: req.body.note,
                shipper_code: random(5, "number"),
                number: `${Date.now()}${random(2, "number")}`,
                customer_first_name: req.body.customer_first_name,
                customer_last_name: req.body.customer_last_name,
                customer_phone_number: req.body.customer_phone_number,
                customer_email: req.body.customer_email,
                customer_country_id: req.body.customer_country_id || appSettings.country,
                starting_wished_service_date: req.body.starting_wished_service_date,
                ending_wished_service_date: req.body.ending_wished_service_date,
                payment_type: req.body.payment_type,
                service_status: "pending",
                price: totalPrice, 
                shipping_price: 0,
                coupon: couponData?.id || null,
                user_created: decoded?.id || null,
                date_created: new Date()
            })
            
            const [ order ] = await database("orders").where({id: orderId});
            order.details = {
                order_id: orderId,
                product_id: product.id,
                quantity: 1,
                option: null,
                color: null,
            };
            
            await database("order_details").insert({
                ...order.details,
                user_created: decoded?.id || null,
                date_created: new Date()
            })
            
            // TODO: send email or sms to user flowwing jumia model
            // TODO: send email to admin
            res.json({data: order})
        } catch (error) {
            console.log(error);
            
            return throwError(res); 
        }
	}); 

    router.post('/createServiceRequest', async (req: Request, res: Response) => {
        try { 
            const [ visitPaymentField ] = await database('directus_fields').select("id", "options").where({
                field: "payment_type", collection: "orders"
            }).limit(1)

            const visitPaymentTypes = JSON.parse(visitPaymentField.options).choices.filter((item: Record<string, any>) => item.group == "visit").reduce( (a: any, currentValue: any)=> [...a, currentValue.value], [])

            const [ appSettings ]: AppSettings[] = await database("configurations");

            let couponData: Record<string, any> | null = {discount_percentage: 0}
            let totalPrice = 0
            if(req.body.coupon != null){
                couponData = await verifyCouponCode(database, req.body.coupon, "service");
                if(couponData == null) return throwError(res, "Coupon invalide", 400);
            }
            
            const validationSchema = Joi.object({  
                product_id: Joi.number().required()
                .label("Veuillez sélectionner un produit"),

                note: Joi.string()
                .allow(null)
                .label("Veuillez entrer une note de commande correcte"),

                customer_first_name: Joi.string().required()
                .label("Veuillez entrer un prénom correcte"),

                customer_last_name: Joi.string().required()
                .label("Veuillez entrer un nom correcte"),

                customer_phone_number: Joi.string().required()
                .label("Veuillez entrer un numéro de téléphone correcte"),
                
                customer_email: Joi.string().email().required()
                .label("Veuillez entrer une adresse email correcte"),

                customer_country_id: Joi.number().allow(null)
                .label("Veuillez sélectionner un pays"),

                customer_state_id: Joi.number().allow(null)
                .label("Veuillez sélectionner une région"),

                customer_city_id: Joi.number().required()
                .label("Veuillez sélectionner une ville"),

                customer_address: Joi.string().required()
                .label("Veuillez sélectionner une adresse correcte"),

                customer_address_2: Joi.string().allow(null)
                .label("Veuillez sélectionner une seconde adresse correcte"),
                
                starting_wished_service_date: Joi.date().required()
                .label("Veuillez sélectionner une première date souhaitée correcte"),

                ending_wished_service_date: Joi.date().required()
                .label("Veuillez sélectionner une seconde date souhaitée correcte"),

                payment_type: Joi.string()  
                .custom((value)=> {if(!visitPaymentTypes.includes(value)) throw new Error("")}).required()
                .label("Veuillez sélectionner un moyen de paiement"),
                
                coupon: Joi.string().allow(null)
                .label("Veuillez entrer un coupon correcte"),
            })

            const validationResult = validationSchema.validate(req.body);
            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);
            
            
            const [ product ]: Product[] = await database("products").where({id: req.body.product_id})

            if(product.type != "service") return throwError(res, "Ce produit n'est pas destiné aux demandes de décoratioon d'intérieur", 400);

            totalPrice = calculateDiscount(appSettings.visit_price, couponData.discount_percentage)
            if(req.body.coupon != null) await useCouponCode(database, req.body.coupon, "service");
            const { decoded } = authHandler.decodeToken(req);
            const orderId = v4();
            await database("orders").insert({
                id: orderId,
                product_type: product.type,
                note: req.body.note,
                shipper_code: random(5, "number"),
                number: `${Date.now()}${random(2, "number")}`,
                customer_first_name: req.body.customer_first_name,
                customer_last_name: req.body.customer_last_name,
                customer_phone_number: req.body.customer_phone_number,
                customer_email: req.body.customer_email,
                customer_country_id: req.body.customer_country_id || appSettings.country,
                customer_state_id: req.body.customer_state_id,
                customer_city_id: req.body.customer_city_id,
                customer_address: req.body.customer_address,
                customer_address_2: req.body.customer_address_2,
                starting_wished_service_date: req.body.starting_wished_service_date,
                ending_wished_service_date: req.body.ending_wished_service_date,
                payment_type: req.body.payment_type,
                service_status: "pending",
                price: totalPrice, 
                shipping_price: 0,
                coupon: couponData?.id || null,
                user_created: decoded?.id || null,
                date_created: new Date()
            })
            
            const [ order ] = await database("orders").where({id: orderId});
            order.details = {
                order_id: orderId,
                product_id: product.id,
                quantity: 1,
                option: null,
                color: null,
            };
            
            await database("order_details").insert({
                ...order.details,
                user_created: decoded?.id || null,
                date_created: new Date()
            })
            
            // TODO: send email or sms to user flowwing jumia model
            // TODO: send email to admin
            res.json({data: order})
        } catch (error) {
            console.log(error);
            
            return throwError(res); 
        }
	}); 

};
