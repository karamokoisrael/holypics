import { ApiExtensionContext } from "@directus/shared/types";
import { EventContext, RegisterFunctions } from "../../@types/directus";
const fs = require('fs');
export default function ({ filter, action }: RegisterFunctions, apiExtension: ApiExtensionContext) {
    action('server.start', async (meta: Record<string, any>) => {
        console.log("server has started");
        const dir = './uploads/tmp';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    })
};




