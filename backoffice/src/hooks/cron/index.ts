import { notify } from './../../helpers/notification';
import { WebSocketMessage } from './../../@types/webSocket';
import { NextFunction, Request, Response, Router } from "express";
import { dump, getDumpList, restore } from "../../helpers/db"
import { ApiExtensionContext } from "@directus/shared/types";
import { EventContext, RegisterFunctions } from "../../@types/directus";

export default function({ filter, schedule, }: RegisterFunctions, { services, exceptions, emitter, database }: ApiExtensionContext){
    schedule('0 0 * * *', async () => {
        dump()
    })  
    
    // schedule('* * * * *', async () => {
    //     console.log('notifying user');
        
    //     notify(database, null, 'admin', `hey for admin ${new Date()}`, '8d93e385-9c22-46a9-be13-aa6e68c617d5', 'products')
    //     notify(database, null, 'user', `hey for user ${new Date()}`, 'da347118-dc7b-4bac-93e0-9e121bbc9578', 'products')
    // })  

    // emitter.onFilter('websocket.subscribe.beforeSend', async (message: WebSocketMessage) => {
    //     if (message.action === 'update') {
    //       // read the full item when an update occurs
    //       const service = new services.ItemsService(message.collection, {
    //         knex, schema: await getSchema(), accountability: { admin: true }
    //       });
    //       message.payload = await service.readMany(message.keys);
    //     }
    //     return message;
    //   });

    

};


