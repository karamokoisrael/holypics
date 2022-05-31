"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1({ filter, schedule, }, { services, exceptions, emitter, database }) {
    filter('feedbacks.items.read', (payload) => {
        if (payload.length == 1) {
            console.log(payload);
            // TODO: see feedback on open
        }
    });
}
exports.default = default_1;
;
