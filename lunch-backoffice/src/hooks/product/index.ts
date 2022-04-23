import { ApiExtensionContext } from "@directus/shared/types";
import { RegisterFunctions } from "../../@types/directus";
export default function({ filter, action }: RegisterFunctions, { services, exceptions }: ApiExtensionContext){
    filter('product.items.create', async (payload) => {
        if(payload.status != "published"){
            console.log("notifying admin");
        }
        return payload;
	});

};


