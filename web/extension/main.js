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



function cutArray(myArray, startPoint, endPoint){
    let newArray = [];
    for(let i=startPoint;i<endPoint;i++){
        newArray.push(myArray[i])
    }

    return newArray;
}
function requestAnalyse(){
   
    let imgs = document.querySelectorAll('img:not([holypicssuccessfullyproceeded="true"]');
    let dataUrl, url  = "https://holypics.megamaxdevelopment.tech/api/analyse-image";
    const predLimit = 0.2;
    const listLimit = 100
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
                    {base64Image: dataUrl.replace('data:image/png;base64,','').replace("data:image/jpeg;base64,", "")  } 
                )
            }
            console.log("running request");

                img.setAttribute("holypicssuccessfullyproceeded", "true")
                
                fetch(url, options).then((response)=>{
                    response.json().then((json)=>{
                        console.log(json)
                        if(json.error == undefined){
                            
                            img.setAttribute("holypicsrawprediction", json.rawPrediction)
                            img.setAttribute("holypicspredictionaccuracy", json.rawPrediction)
                            img.setAttribute("holypicspredictionclassindex", json.rawPrediction)
                            // img.setAttribute("holypicsdataUrl", dataUrl)

                            if(json.classIndex == 0 && json.accuracy >= predLimit){
                                img.setAttribute("style", "filter: blur(14px) !important;-webkit-filter: blur(14px) !important;")
                            }
                        }
                    })
                })


        } catch (error) {
            //toast("we encoutered a problem during model prediction. Please check your prediction input an try again")
            console.log("error => ", error)
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
    await sleep(10000)
    //do stuff
  }
  
  
  

window.onscroll =  (e)=> {  
    console.log("processing with scroll event", e)
    requestAnalyse()
    doSomething()
    
} 
 
    



   