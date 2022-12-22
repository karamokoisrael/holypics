import { describe, expect, test } from '@jest/globals';
describe('basic test example', () => {
    test('checking wether 1 is 1', () => {
        expect(1).toBe(1);
    });
})


// const request = require("supertest")
// request("https://icanhazdadjoke.com")
// .get('/slack')
// .end(function(err, res) {
// 	if (err) throw err;
// 	console.log(res.body.attachments);
// });