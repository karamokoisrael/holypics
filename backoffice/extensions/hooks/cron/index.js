"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../helpers/db");
function default_1({ filter, schedule, }, { services, exceptions, database }) {
    schedule('0 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
        try {
            (0, db_1.dump)();
        }
        catch (error) {
        }
    }));
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
}
exports.default = default_1;
;
