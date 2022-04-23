import { getBaseExceptionParams } from './../../helpers/exceptions';
import { ApiExtensionContext } from "@directus/shared/types";
import { RegisterFunctions } from "../../@types/directus";
import Joi from "joi";
import { getJoiError } from "../../helpers/validation";
import { BaseException } from '@directus/shared/exceptions';
export default function({ filter, schedule }: RegisterFunctions, { services, exceptions }: ApiExtensionContext){
    filter('wishlists.items.create', async (input) => {
        const validationSchema = Joi.object({
            product_id: Joi.number().label("Veuillez sélectionner un produit").required(),
        })
        const validationResult = validationSchema.validate(input);
        const { message, status, code, extensions } = getBaseExceptionParams(getJoiError(validationResult), "BAD_REQUEST")
        if(validationResult.error) throw new BaseException( message, status, code, extensions)
		return input;
	});
};


