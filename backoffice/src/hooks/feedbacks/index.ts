import { ApiExtensionContext } from "@directus/shared/types";
import { RegisterFunctions } from "../../@types/directus";

export default async function ({ filter }: RegisterFunctions, { database }: ApiExtensionContext) {
    filter('feedbacks.items.read', async (payload: any, meta, { accountability, schema }) => {
        if (payload.length == 1) {
            try {
                await database("feedbacks").update({seen: 1}).where({id: payload[0].id, seen: 0});
                // const { admin_id } = await getAdminTokens(database)
                // const feedbacksService = new ItemsService("feedbacks", { knex: database as any, schema: schema as SchemaOverview, accountability: { ...accountability, admin: true } as  Accountability });
                // await feedbacksService.updateOne(payload[0].id, { seen: true })
            } catch (error) {}
        }
        return payload;
    })
};




