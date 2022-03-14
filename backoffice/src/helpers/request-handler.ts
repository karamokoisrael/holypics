import { JsonObject } from './../@types/global';
import { WebSocketMessage, WebSocketMessageType } from './../@types/webSocket'
import GlobalAppContext from '../@types/context';



export const customStringify = (query: JsonObject)=>{
  return Object.keys(query).map(key => key + '=' + query.hasOwnProperty(key) ? query[key] : "").join('&')
}


export const customFetch = (url: string, options: JsonObject={}, loader=true)=>{
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

export const serializeSocketMessage = (json: JsonObject)=> JSON.stringify(json);

export const deserializeSocketMessage  = (string: string) :WebSocketMessage => JSON.parse(string);

export const sendSocketMessage = (webSocket: WebSocket | undefined, userId: number, message:WebSocketMessageType, content?: string, target?: string, owner?: string)=>{

  if(webSocket == undefined){
    console.log("socket null");
    return;
  } 

  const socketMessage:WebSocketMessage = {
    message: message,
    owner: userId.toString(),
  }

  if (content != undefined) socketMessage.content = content
  if (target != undefined) socketMessage.target = target
  if (owner != undefined) socketMessage.owner = owner

  // console.log(serializeSocketMessage(socketMessage));
  
  webSocket.send(serializeSocketMessage(socketMessage));
}







