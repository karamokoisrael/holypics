import { ApiExtensionContext } from "@directus/shared/types";
import { RegisterFunctions } from "../../@types/directus";

export default async function ({ filter }: RegisterFunctions, { database }: ApiExtensionContext) {
    filter('feedbacks.items.read', async (payload: any, meta, { accountability, schema }) => {
        if (payload.length == 1 && accountability?.user != null && accountability.user != undefined) {
            try {
                await database("feedbacks").update({ seen: 1 }).where({ id: payload[0].id, seen: 0 });
            } catch (error) { }
        }
        if (!accountability?.user) {
            const ids = payload.map((item: any) => item.id);
            await database("feedbacks").update({ downloaded_for_dataset: 1 }).whereIn("id", ids);
        }
        return payload;
    })
};




