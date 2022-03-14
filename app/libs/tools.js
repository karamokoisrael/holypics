const request = require('request');
const fs = require('fs');   
const BufferList = require('bufferlist').BufferList;
// https://images.unsplash.com/photo-1621569901036-f3733e72d312?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&w=1000&q=80
const fetch = require('node-fetch');
class Tools{
    reduceObjProps(obj,keys){
        return keys.reduce((a,b)=> (a[b]=obj[b],a),{});
    } 

    rejectRequest(msg="Bad request"){
        return {"error": msg}
    }

    imageUrlToBase64(url, callback){
        //Buffer.from(body).toString('base64')
        
     
        const bl = new BufferList();

        request({uri:url, responseBodyStream: bl}, function (error, response, body) 
        {
            if (!error && response.statusCode == 200) {
                let type = response.headers["content-type"];
                let prefix = ""//"data:" + type + ";base64,";
                let base64 = new Buffer.from(body).toString('base64').replace("+", "-").replace("/", "_");
                let data = prefix + base64;
                callback(data)  
            }
        });
    }

}

module.exports = new Tools()