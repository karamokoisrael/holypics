import { notify } from './../../helpers/notification';
import { WebSocketMessage } from './../../@types/webSocket';
import { NextFunction, Request, Response, Router } from "express";
import { dump, getDumpList, restore } from "../../helpers/db"
import { ApiExtensionContext } from "@directus/shared/types";
import { EventContext, RegisterFunctions } from "../../@types/directus";

export default function({ filter, schedule, }: RegisterFunctions, { services, exceptions, emitter, database }: ApiExtensionContext){
    filter('feedbacks.items.read', (payload: any[])=>{
        if(payload.length == 1){
            console.log(payload);
            // TODO: see feedback on open
        }
    })
};


