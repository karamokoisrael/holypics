import { getTranslations, translate } from './../../helpers/request-handler';
import { AppSettings } from './../../@types/global';
import { Router, Response, Request } from "express";
import { ApiExtensionContext } from "@directus/shared/types";
import { getAdminTokens } from '../../helpers/auth';

export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {
    router.get('/', async (req: Request, res: Response) => {
        const payload: Record<string, any> = {}
        const [appSettings] = await database<AppSettings>('configurations').where('id', '=', 1);
        const categories = await database('categories').where('status', '=', "published");


        const directusFields = await database('directus_fields').select("id", "collection", "field", "interface", "options").where("interface", "=", "mgx-select-json-string").orWhere("interface", "=", "select-dropdown")
        const { access_token } = await getAdminTokens(database);
        const translations = await getTranslations(req, access_token)

        for (const directusField of directusFields) {

            const directusFieldIndex = directusFields.findIndex((currentDirectusField) => currentDirectusField.id == directusField.id)
            if (directusFieldIndex == null) continue;

            if (directusField.options == undefined || directusField.options == null) {
                directusFields[directusFieldIndex].options = {
                    choices: []
                }
            } else {

                directusFields[directusFieldIndex].options = JSON.parse(directusField.options);
                for (const option of directusFields[directusFieldIndex].options.choices) {
                    const optionIndex = directusFields[directusFieldIndex].options.choices.findIndex((item: Record<string, any>) => item.value == option.value)
                    if (optionIndex != null && option.text.includes("$t:")) {
                        directusFields[directusFieldIndex].options.choices[optionIndex].text = translate(translations, option.text)
                    }
                }

            }

        }

        const productTypesField = directusFields.find((directusField) => directusField.field == "type" && directusField.collection == "products")
        payload.product_types = productTypesField.options.choices;

        const galleryTypesField = directusFields.find((directusField) => directusField.field == "group" && directusField.collection == "gallery")
        payload.gallery_groups = galleryTypesField.options.choices;

        const ordersPaymentsTypesField = directusFields.find((directusField) => directusField.field == "payment_type" && directusField.collection == "orders")
        payload.visit_payment_types = ordersPaymentsTypesField.options.choices.filter((item: Record<string, any>) => item.group == "visit")

        payload.service_payment_types = ordersPaymentsTypesField.options.choices.filter((item: Record<string, any>) => item.group == "service")

        payload.order_payment_types = ordersPaymentsTypesField.options.choices.filter((item: Record<string, any>) => item.group == null || item.group == undefined)

        const shippingTypesField = directusFields.find((directusField) => directusField.field == "shipping_type" && directusField.collection == "orders")
        payload.shipping_types = shippingTypesField.options.choices

        const paymentStatusTypesField = directusFields.find((directusField) => directusField.field == "payment_status" && directusField.collection == "orders")
        payload.payment_status = paymentStatusTypesField.options.choices
        payload.service_status = paymentStatusTypesField.options.choices

        const shippingStatusTypesField = directusFields.find((directusField) => directusField.field == "shipping_status" && directusField.collection == "orders")
        payload.shipping_status = shippingStatusTypesField.options.choices

        const serviceStatusTypesField = directusFields.find((directusField) => directusField.field == "service_status" && directusField.collection == "orders")
        payload.service_status = serviceStatusTypesField.options.choices

        const categoryPaymentTypesField = directusFields.find((directusField) => directusField.field == "payment_type" && directusField.collection == "categories")
        payload.category_payment_types = categoryPaymentTypesField.options.choices

        payload.languages = [
            {
                text: "Français (French)",
                symbol: "fr",
                value: "fr-FR",
            },
            {
                text: "Anglais (English)",
                symbol: "en",
                value: "en-US",
            }
        ]

        payload.default_status = [
            {
                name: "published",
                text: "publié",
                comment: "élément visible"
            },
            {
                name: "draft",
                text: "bouillon",
                comment: "bouillon ( non visible )"
            },
            {
                name: "archived",
                text: "archivé",
                comment: "archivé ( non visible )"
            }
        ]

        for (const category of categories) {
            const subCategories = await database('sub_categories').where("category", "=", category.id).where('status', '=', "published");
            for (const subCategory of subCategories) {
                const subSubCategories = await database('sub_sub_categories').where("sub_category", "=", subCategory.id).where('status', '=', "published");
                const subCategoryIndex = subCategories.findIndex((currentSubCategory) => currentSubCategory.id == subCategory.id)
                if (subCategoryIndex != null && subCategoryIndex != undefined) subCategories[subCategoryIndex].sub_sub_categories = subSubCategories;
            }

            const categoryIndex = categories.findIndex((currentCategory) => currentCategory.id == category.id);
            if (categoryIndex != null && categoryIndex != undefined) categories[categoryIndex].sub_categories = subCategories;
        }

        const countries = await database('countries').select("id", "name").where("id", "=", appSettings.country);

        for (const country of countries) {
            const states = await database('states').select("id", "name").where("country_id", "=", country.id);
            for (const state of states) {
                const cities = await database('cities').select("id", "name").where("state_id", "=", state.id);
                for (const city of cities) {
                    const communes = await database('communes').select("id", "name").where("city", "=", city.id);
                    const cityIndex = cities.findIndex((currentCity) => currentCity.id == city.id)
                    states[cityIndex].communes = communes;
                }
                const stateIndex = states.findIndex((currentState) => currentState.id == state.id)
                states[stateIndex].cities = cities;
            }

            const countryIndex = countries.findIndex((currentCountry) => currentCountry.id == country.id)
            countries[countryIndex].states = states;
        }

        const { website_url, currencies, visit_price } = appSettings
        payload.appSettings = {
            website_url, currencies, visit_price
        };

        payload.categories = categories
        payload.countries = countries
        res.send({ data: payload })
    });

    // router.get("/downloadUploadedFiles")
};