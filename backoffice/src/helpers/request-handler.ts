import { SchemaOverview } from '@directus/shared/types';
import { Accountability } from '@directus/shared/types';
import { DirectusData, DirectusTranslations } from './../@types/directus';
import { JsonObject } from './../@types/global';
// import { WebSocketMessage } from './../@types/webSocket'
import https from 'https';
import { v4 } from "uuid";
import axios from 'axios';
import { default as FormData } from "form-data";
import { formatUrl } from './utils';
import { Request } from "express";
import { Readable } from 'stream';
import { getAdminTokens } from './auth';
import { Knex } from 'knex';
import { DIRECTUS_DEFAULT_LANGUAGE } from '../consts/global';

export const customStringify = (query: JsonObject)=>{
  return Object.keys(query).map(key => key + '=' + query.hasOwnProperty(key) ? query[key] : "").join('&')
}

export const customFetch = (url: string, options: JsonObject={}, xAccessToken=null, bearerToken = null)=>{
  if(options.header == undefined){
    options.headers = new Headers({ Accept: 'application/json' });  
  }else{
    options.headers.set('Accept', 'application/json');
  }
  

  options.headers.set('Content-Type', 'application/json'); 
  options.headers.set('Access-Control-Allow-Credentials', true); 
  options.headers.set('Access-Control-Expose-Headers', '*');
  options.headers.set('Access-Control-Allow-Origin', '*');
  options.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if(xAccessToken != null){
    options.headers.set('x-access-token', xAccessToken); 
  }

  if(bearerToken != null){
    options.headers.set('Authorization', `Bearer ${bearerToken}`); 
  }


  const promise = fetch(url, options)
  

  return promise;
}

export const customFetchWithCredentials = (url: string, bearerToken: string | null, options: JsonObject, loader=true, format=true) => {  
  if(options.header == undefined){
    options.headers = new Headers({ Accept: 'application/json' });  
  }else{
    options.headers.set('Accept', 'application/json');
  }

  options.headers.set('Content-Type', 'application/json'); 
  options.headers.set('Access-Control-Allow-Credentials', true); 
  options.headers.set('Access-Control-Expose-Headers', '*');
  options.headers.set('Access-Control-Allow-Origin', '*');
  options.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  options.headers.set('Authorization', `Bearer ${bearerToken}`);
  const promise: Promise<any> = fetch(format ? url : url, options)

  return promise;
};

export const customFetchWithCredentialsAndFiles = (url: string, bearerToken: string | null, files: Array<any>,fileNames: Array<string>, data: JsonObject={}, method: string = "POST", loader: boolean=true ) => { 
  
  const options: JsonObject = {};
  options.headers = new Headers({ }); 
  // options.headers.set('Content-Type', 'multipart/form-data'); 
  // options.headers.set('Accept', '*/*'); 
  // options.headers.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'); 
  options.headers.set('Access-Control-Allow-Credentials', true); 
  options.headers.set('Access-Control-Expose-Headers', '*');
  options.headers.set('Access-Control-Allow-Origin', '*');
  options.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  options.headers.set('Authorization', `Bearer ${bearerToken}`);
  options.method = method;
  const formData = new FormData();
  let count = 0;
  fileNames.forEach(fileName => {
    formData.append(fileName, files[count])
    count++;
  });
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  });
  console.log(formData);
  options.body = formData;

  const promise = fetch(url, options)

  return promise;
};

export const getConfigs = async (callback: Function)=>{
  try {
      const configsRes = await customFetch(`Config/GetAll`);
      const currentConfigs = await configsRes.json();
      callback(currentConfigs)
  } catch (error) {
      callback([])
  }
}

export const getUploadedFileUrl = (file: string)=>{
  return `Uploads/${file}`;
}

//web Socket

// export const serializeSocketMessage = (json: JsonObject)=> JSON.stringify(json);

// export const deserializeSocketMessage  = (string: string) :WebSocketMessage => JSON.parse(string);

// export const sendSocketMessage = (webSocket: WebSocket | undefined, userId: number, message:WebSocketMessageType, content?: string, target?: string, owner?: string)=>{

//   if(webSocket == undefined){
//     console.log("socket null");
//     return;
//   } 

//   const socketMessage:WebSocketMessage = {
//     message: message,
//     owner: userId.toString(),
//   }

//   if (content != undefined) socketMessage.content = content
//   if (target != undefined) socketMessage.target = target
//   if (owner != undefined) socketMessage.owner = owner

//   // console.log(serializeSocketMessage(socketMessage));
  
//   webSocket.send(serializeSocketMessage(socketMessage));
// }
export type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type HttpRequestResponse = {
  statusCode: number, 
  data: string
}

export const httpRequest = (url: string, method: HttpRequestMethod = 'GET', body: Record<string, any>={}, headers: Record<string, any>={}): Promise<any>=>{
  const urlParams = new URL(url);

  const bodyString = JSON.stringify(body);
  const baseHeaders = {
    'Content-Type': 'application/json',
    'Content-Length': bodyString.length
  }
  const options = {
    hostname: urlParams.hostname,
    port: urlParams.port,
    path: urlParams.pathname,
    method: method,
    headers: {...baseHeaders, ...headers}
  }
  
  return new Promise((resolve, reject)=>{
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data+=chunk
      })

      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data })
      })

    })
    
    
    req.on('error', error => {
      console.log(error);
      
      reject(error)
    })

    if(method != "GET") req.write(bodyString)
    
    req.end()
  })


}

export const httpResponseToJson = (response: HttpRequestResponse)=>{
  return new Promise((resolve, reject)=>{
    try {
      resolve(JSON.parse(response.data));
    } catch (error) {
      reject(error)
    }
  })
}

export const uploadBase64File = (req: Request, base64: string, access_token = "", fileName=v4().toString())=>{
  return new Promise(async (resolve, reject)=>{
    try {
      const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

      if (matches?.length !== 3) {
      return reject('Invalid input string');
      }
      
      const buffer = Buffer.from(matches[2], 'base64');
      const [mimeType] = base64MimeType(base64);
      const form = new FormData()
      const stream = Readable.from(buffer); 
      form.append('title', fileName);
      form.append('file', stream,  {
        filename: fileName,
        contentType: mimeType as string
      });
      
      const response = await axios.post(formatUrl(req, `files?${access_token != "" ? "access_token="+access_token : ""}`), form, {
          headers:{
            ...form.getHeaders()
          }
        })
      resolve(response.data)
    } catch (error) {
      reject(error)
    }
  })
}

export const base64MimeType = (encoded: string)=> {
  let result = null;
  let extension = null
  if (typeof encoded !== 'string') {
    return [result, extension];
  }

  let mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  extension = result?.split("/")[1]
  return [result, extension];
}
export const getTranslations = (req: Request, accessToken: string): Promise<DirectusData<DirectusTranslations>> =>{
  return new Promise(async (resolve, reject)=>{
    try {
      const response = await axios.get<DirectusData<DirectusTranslations>>(formatUrl(req, `settings?fields[]=translation_strings&limit=-1&access_token=${accessToken}`)) 
      resolve(response.data)
    } catch (error) {
      reject(error)
    }
  })
}

export const translate = (translations: DirectusData<Record<string, any>>, text: string, lang=DIRECTUS_DEFAULT_LANGUAGE) =>{
  const foundTranslation = translations.data.translation_strings.find((item: Record<string, any>)=> item.key == text.replace("$t:", ""))
  if(foundTranslation != null || foundTranslation != undefined){
    try {
      return foundTranslation.translations[lang]
    } catch (error) {
      return text.replace("$t:", "").replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
    }
  }

  return text.replace("$t:", "").replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
}
export type ExtractRequestParams = {
  filters: Record<string, any>,
  accountability: Accountability,
  schema: SchemaOverview,
};



export const getRequestParams = (req: Request, forceAdmin=false): ExtractRequestParams=>{
  // @ts-ignore
  const filters = req.query.filters as Record<string, any>;
  // @ts-ignore
  const accountability = req.accountability;
  // @ts-ignore
  if(forceAdmin) accountability.admin = true
  // @ts-ignore
  const schema = req.schema;
  return { filters, accountability, schema}
}







