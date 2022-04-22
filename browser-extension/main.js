function getDataUrl(img) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0, img.width, img.height);   
    return canvas.toDataURL('image/jpeg');
}

function writeOneImage(img, text) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0, img.width, img.height);   

    if(text != "" && text != undefined){
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    


    ctx.font = '20px serif';
    ctx.fillStyle = "#fff";

    const x = 30;
    const y = 30;
    const lineheight = 20;
    const lines = text.split('\n');
    for (let i = 0; i<lines.length; i++)
        ctx.fillText(lines[i], x, y + (i*lineheight) );
    // ctx.fillText(text, 10, 100, img.width);

    return canvas.toDataURL('image/jpeg');
}

function cutArray(myArray, startPoint, endPoint){
    let newArray = [];
    for(let i=startPoint;i<endPoint;i++){
        newArray.push(myArray[i])
    }

    return newArray;
}

function requestAnalyse(){
   
    let imgs = document.querySelectorAll('img:not([holypicssuccessfullyproceeded="true"]');
    let dataUrl, url  = "http://188.166.126.190:84/predictFromUrl";
    const predLimit = 0.2;
    const listLimit = 300
    const listStart = 0
    
    if(imgs.length==0) return;
    
    if(listLimit!=-1){
        imgs = cutArray(imgs, listStart, listLimit)
    }
    console.log("queued => ", imgs.length)
    

    imgs.forEach((img) => { 
        try {
            dataUrl = getDataUrl(img)
            const options = {
                method: 'POST',
                // agent: proxyAgent,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                },
                mode: "cors",
                body: JSON.stringify(
                    {url: dataUrl  } 
                )
            }
            console.log("running request");
            img.setAttribute("holypicssuccessfullyproceeded", "true")
            
            fetch(url, options).then((response)=>{
                response.json().then((json)=>{
                    // console.log(json)
                    if(json.error == undefined){
                        if(json.to_print!=""){
                            const newDataUrl = writeOneImage(img, json.to_print)
                            // img.setAttribute("holypicsrawprediction", JSON.stringify(json.predictions))
                            if(img.hasAttribute("src")) img.setAttribute("src", newDataUrl)
                            if(img.hasAttribute("srcset")) img.setAttribute("srcset", newDataUrl)
                            if(img.hasAttribute("data-src")) img.setAttribute("data-src", newDataUrl)
                

                            // img.setAttribute("holypicspredictionaccuracy", json.rawPrediction)
                            // img.setAttribute("holypicspredictionclassindex", json.rawPrediction)
                            // img.setAttribute("holypicsdataUrl", dataUrl)
                             // if(json.classIndex == 0 && json.accuracy >= predLimit){
                            //     img.setAttribute("style", "filter: blur(14px) !important;-webkit-filter: blur(14px) !important;")
                            // }
                        }
                        

                       
                    }
                }).catch((error)=>{
                    console.log(error);
                })
            })


        } catch (error) {
            //toast("we encoutered a problem during model prediction. Please check your prediction input an try again")
            // console.log("error => ", error)
        }
    });
    
}


// Select the image
console.log("initializing")
requestAnalyse()


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

  
const doSomething = async () => {
    await sleep(3000)
}
  
  
  
setInterval(()=>{
    requestAnalyse()
}, 3000)

window.onscroll =  (e)=> {  
    // console.log("processing with scroll event", e)
    requestAnalyse()
    doSomething()
} 
 
    



   