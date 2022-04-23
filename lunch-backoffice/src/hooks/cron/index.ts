import { NextFunction, Request, Response, Router } from "express";
import { dump, getDumpList, restore } from "../../helpers/db"
import { ApiExtensionContext } from "@directus/shared/types";
import { EventContext, RegisterFunctions } from "../../@types/directus";

export default function({ filter, schedule }: RegisterFunctions, { services, exceptions }: ApiExtensionContext){
    schedule('0 0 * * *', async () => {
        dump()
    })    
};


