import { dump } from "../../helpers/db"
import { ApiExtensionContext } from "@directus/shared/types";
import { RegisterFunctions } from "../../@types/directus";
import moment from 'moment';

export default function ({ schedule, }: RegisterFunctions, { database }: ApiExtensionContext) {
    schedule('0 0 * * *', async () => {
        try {
            dump()
        } catch (error) { }

    })

    schedule('0 1 * * *', async () => {
        try {
            const today = moment(new Date(), "DD-MM-YYYY hh:mm:ss").add(60, 'minutes').toDate()
            await database("directus_users").update({
                "subscription_deadline": null
            }).whereNotNull("subscription_deadline").where("subscription_deadline", "<=", today);
        } catch (error) { }

    })
};


