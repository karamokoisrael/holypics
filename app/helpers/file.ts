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