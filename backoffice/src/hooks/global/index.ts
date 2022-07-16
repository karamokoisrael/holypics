import { ApiExtensionContext } from "@directus/shared/types";
import { EventContext, RegisterFunctions } from "../../@types/directus";
const fs = require('fs');
const bodyParser = require('body-parser');
export default function ({ init, action }: RegisterFunctions, apiExtension: ApiExtensionContext) {
    action('server.start', async (meta: Record<string, any>) => {
        // 
    })
};




