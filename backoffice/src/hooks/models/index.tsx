import { ApiExtensionContext } from "@directus/shared/types";
import { ItemsService } from "directus";
import { EventContext, RegisterFunctions } from "../../@types/directus";
const fs = require('fs');
const bodyParser = require('body-parser');
export default async function ({ filter }: RegisterFunctions, { database, getSchema }: ApiExtensionContext) {
    const modelTranslationsService = new ItemsService("models_translations", { knex: database as any, schema: await getSchema(), accountability: { admin: true, app: true, role: "", } });
    filter('models.items.read', async (payload: any) => {
        for (let i = 0; i < payload.length; i++) {
            const translation = await modelTranslationsService.readByQuery({ filter: { models_id: { _eq: payload[i].id } } })
            payload[i].translations = translation;
        }
    })
};




