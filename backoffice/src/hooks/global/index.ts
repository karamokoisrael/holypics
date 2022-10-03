import { ApiExtensionContext } from "@directus/shared/types";
import { EventContext, RegisterFunctions } from "../../@types/directus";
const fs = require('fs');
const bodyParser = require('body-parser');
export default function ({ init, action }: RegisterFunctions, apiExtension: ApiExtensionContext) {
    // init("app.before", ({app}: any)=>{
    //     // console.log(app);
    //     app.use(bodyParser.json({ limit: '10mb' }));
    //     app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
    // })
    // action('server.start', async (meta: Record<string, any>) => {
    //     // 
    // })
};




