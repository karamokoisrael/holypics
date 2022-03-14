import { Router, Request, Response, NextFunction } from "express";
import { JsonObject } from "../../@types/global";
import { sendCustomEmail } from "../../helpers/mailer"
const customExceptions = require("../../helpers/exceptions");
import * as Joi from "joi";
import { v4 } from "uuid";
import { hash, compare } from "bcryptjs";
import { random } from "../../helpers/string";
import * as authHandler from "../../helpers/auth";

module.exports =  (router: Router, { services, exceptions, getSchema, database, env }: JsonObject) => {

    const { ItemsService,  } = services;
	const { ServiceUnavailableException } = exceptions;

	router.get('/test', (req: any, res: Response, next: NextFunction) => {
        console.log(req.query.fields);
		const dataService = new ItemsService('users', { schema: req.schema, accountability: req.accountability });

		dataService
			.readByQuery(req.query)
			.then((results: any) => res.json(results))
			.catch((error: any) => {
				return next(new ServiceUnavailableException(error.message));
			});
	});
};
