import { DEFAULT_ERROR_MESSAGE } from './../../consts/global';
import { throwBaseException } from './../../helpers/exceptions';
import { ApiExtensionContext } from "@directus/shared/types";
import { EventContext, RegisterFunctions } from "../../@types/directus";
import Joi from "joi";
import { getJoiError } from "../../helpers/validation";
import { BaseException } from '@directus/shared/exceptions';
import { ItemsService } from 'directus';
import { SchemaOverview } from "@directus/shared/types"
import { ObjectToEqFilter } from '../../helpers/directus';
import { PrimaryKey } from 'directus/dist/types';
import { JsonResponse } from '../../models/request';
export default function({ filter }: RegisterFunctions, { services, exceptions, getSchema, database, env }: ApiExtensionContext){
    filter('product_reviews.items.create', async (payload:Record<string, any>, meta: Record<string, any>, { schema, accountability }: EventContext) => {

        try { 
            const validationSchema = Joi.object({    
                product_id: Joi.number().required()
                .label("Veuillez sélectionner un produit"),

                rating: Joi.number().min(0).max(5).required()
                .label("Veuillez entrer une note correcte entre 0 et 5"),

                comment: Joi.string()
                .allow(null)
                .label("Veuillez entrer un commentaire valide ou laissez la case commentaire vide"),
            })
    
            const validationResult = validationSchema.validate(payload);
            
            if(validationResult.error) throwBaseException(getJoiError(validationResult), "BAD_REQUEST")

            return payload;
        
        } catch (error: any) {
            if(error.message != undefined && error.message != null) throw new BaseException( error.message, error.status, error.code, error.extensions)
            throwBaseException(DEFAULT_ERROR_MESSAGE, "BAD_REQUEST")
        }
	});

    filter('product_reviews.items.update', async (payload:Record<string, any>) => {

        try { 
            const validationSchema = Joi.object({    
                product_id: Joi.number()
                .label("Veuillez sélectionner un produit"),

                rating: Joi.number().min(0).max(5)
                .label("Veuillez entrer une note correcte entre 0 et 5"),

                comment: Joi.string()
                .allow(null)
                .label("Veuillez entrer un commentaire valide ou laissez la case commentaire vide"),
            })
    
            const validationResult = validationSchema.validate(payload);
            
            if(validationResult.error) throwBaseException(getJoiError(validationResult), "BAD_REQUEST")

            return payload;
        
        } catch (error: any) {
            if(error.message != undefined && error.message != null) throw new BaseException( error.message, error.status, error.code, error.extensions)
            throwBaseException(DEFAULT_ERROR_MESSAGE, "BAD_REQUEST")
        }
	});
};


