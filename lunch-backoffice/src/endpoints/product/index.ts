import { getRequestParams } from './../../helpers/request-handler'; 
import { ApiExtensionContext } from '@directus/shared/types';
import { Router, Request, Response, NextFunction } from "express";
import { throwError} from '../../helpers/exceptions';
import Joi from "joi";
import * as authHandler from "../../helpers/auth";
import { getJoiError } from '../../helpers/validation';
import { ItemsService } from 'directus';
import { ObjectToEqFilter } from '../../helpers/directus';
import { PrimaryKey } from 'directus/dist/types';
import { Product } from '../../@types/product';


export default (router: Router, { services, exceptions, getSchema, database, env }: ApiExtensionContext) => {
    

    router.post('/addToViews', async (req: Request, res: Response) => {
        try { 
            const validationSchema = Joi.object({    
                product_id: Joi.number().required()
                .label("Veuillez sélectionner un produit"),
            })
            const validationResult = validationSchema.validate(req.body);
            
            if(validationResult.error) return throwError(res, getJoiError(validationResult), 400);

            const { schema, accountability } = getRequestParams(req);
            const { decoded } = authHandler.decodeToken(req);

            const itemService = new ItemsService("product_views", { knex: database, schema, accountability});
            const filter = {
                product_id: req.body.product_id,
                user_created: decoded?.id
            }
            const productViews = await itemService.readByQuery({filter: ObjectToEqFilter(filter), limit: 1})
            let times = 1;
            let itemKey: PrimaryKey = -1;

            if(productViews.length > 0){
                times = productViews[0].times+1;
                itemKey = productViews[0].id;
                await itemService.updateByQuery({filter: ObjectToEqFilter(filter)}, {times: times})
            }else{
                itemKey = await itemService.createOne(filter);
            }
            res.json({data: {id: itemKey, product_id: req.body.product_id, times: times}})
        } catch (error) {
            console.log(error);
            return throwError(res); 
        }
	}); 

    router.get('/:id', async (req: Request, res: Response) => {
        try { 
            const { schema, accountability } = getRequestParams(req);
            const { decoded } = authHandler.decodeToken(req);

            const itemService = new ItemsService("products", { knex: database, schema, accountability});
            const filter = {
                id: req.params.id,
                status: "published"
            }

            const [ product ] = await itemService.readByQuery({filter: ObjectToEqFilter(filter), limit: 1})
            const productImages = await database("products_files").select("id", "directus_files_id").where({products_id: req.params.id})
            
            const productViews = await database("product_views").where({product_id: req.params.id, user_created: decoded?.id || null})
            const productReviews = await database("product_reviews").where({product_id: req.params.id, user_created: decoded?.id || null})
            const orderDetails = await database("order_details").where({product_id: req.params.id, user_created: decoded?.id || null})
            const whishlistCount = await database("wishlists").where({product_id: req.params.id, user_created: decoded?.id || null}).count() as Record<string, any>[]
            
            product.images = productImages
            product.product_views = productViews;
            product.product_reviews = productReviews;
            product.order_details = orderDetails;
            product.added_to_wishlist = whishlistCount[0]["count(*)"] > 0 
    
            res.json({data: product})
        } catch (error) {
            console.log(error);
            return throwError(res); 
        }
	}); 

    router.get('/recommandations', async (req: Request, res: Response) => {
        try { 
            const { schema, accountability } = getRequestParams(req);
            const { decoded } = authHandler.decodeToken(req);

            const itemService = new ItemsService("products", { knex: database, schema, accountability});
            const filter = {
                status: {_eq: "published"},
                // _and: [
                //     {
                //         is_recommanded: { _eq: 1}
                //     }
                // ]
            }
            const products = await itemService.readByQuery(
                {
                    filter: filter, 
                    page: req.query?.page as any || 1,
                    limit: req.query?.limit as any || 20,
                })
            res.json({data: products})
        } catch (error) {
            console.log(error);
            return throwError(res); 
        }
    })


    router.get('/similar/:id', async (req: Request, res: Response) => {
        try { 
            const { schema, accountability } = getRequestParams(req);
            const { decoded } = authHandler.decodeToken(req);

            const itemService = new ItemsService("products", { knex: database, schema, accountability});
            const filter = {
                id: req.params.id,
                status: "published"
            }   

            const [ product ] = await itemService.readByQuery({filter: ObjectToEqFilter(filter), limit: 1})

            const similarityFilter = {
                id: { _neq: product.id},
            }

            const similarProducts = await itemService.readByQuery(
                {
                    search: product.name, 
                    filter: similarityFilter, 
                    page: req.query?.page as any || 1,
                    limit: req.query?.limit as any || 20,
                }
            )
            res.json({data: similarProducts})
        } catch (error) {
            console.log(error);
            return throwError(res); 
        }
    })

    router.get('/viewed', async (req: Request, res: Response) => {
        try { 
            // const { schema, accountability } = getRequestParams(req);
            // const { decoded } = authHandler.decodeToken(req);
            // const views = await database("product_views").select("id").orderBy("id", "desc").where({user_created: decoded?.id})
            // const itemService = new ItemsService("products", { knex: database, schema, accountability});
            // const products = await itemService.readMany([])
            // res.json({data: views})
            res.json({data: []})
        } catch (error) {
            console.log(error);
            return res.json({data: []})
        }
    })


    

};
