import { WebSocketMessage, WebSocketUser } from './../../@types/webSocket';
import { DEFAULT_ERROR_MESSAGE } from './../../consts/global';
import { generateError, getBaseExceptionParams } from './../../helpers/exceptions';
import { BaseException } from '@directus/shared/exceptions';
import { ApiExtensionContext } from "@directus/shared/types";
import { EventContext, RegisterFunctions } from "../../@types/directus";
import { Request } from 'express';
import { WebSocketServer } from "ws";

export default function({ filter, action }: RegisterFunctions, apiExtension: ApiExtensionContext){
    
    action('server.start', async (meta: Record<string, any>) => {
        const socketPort = process.env?.SOCKET_SERVER_PORT != undefined ? parseInt(process.env.SOCKET_SERVER_PORT) : parseInt(process.env.PORT as string)+1
        const server = new WebSocketServer({ port: socketPort });
        // const socketUser: Record<string, WebSocketUser> = []
        server.on("connection", (socket) => {
            console.log("new connection added")
            const payload:WebSocketMessage = {
                message: "connectionReceived",
                content: {hey: ""}
            }
            socket.send(JSON.stringify(payload));
        });

        server.on('message', (data)=> {
            console.log('received: %s', data);
        });

	});
};




