import Header from "../components/Header";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTumblr, faTwitter } from '@fortawesome/free-brands-svg-icons'
if (process.browser) {
  document.addEventListener("DOMContentLoaded", function () {
     alert('Finished loading');
   });
 }

import React from "react";
import cuid from "cuid";

import Masonry from 'react-masonry-css'

import { toast } from 'react-toastify';

function TestVideo() {
//   const [videoUrl, setVideoUrl] = React.useState("");
//   const [validVideoUrl, setValidVideoUrl] = React.useState("");
//   const [oldPredictionClass, setOldPredictionClass] = React.useState(1);
 


//   const predict = async (base64Image, callback)=>{
//     toast("Prédiction en cours");
//     const options = {
//       method: 'POST',
//       // agent: proxyAgent,
//       // headers: {
//       //     'Accept': 'application/json',
//       //     'Content-Type': 'application/json',
//       //     'Access-Control-Allow-Headers': '*',
//       //     'Access-Control-Allow-Origin':'*'
//       //   },
//       body: JSON.stringify(
//           {"base64Image": base64Image.replace('data:image/png;base64,','').replace("data:image/jpeg;base64,", "")  } 
//       )
//   }
//   console.log("running request");
//   console.log(encode(base64Image.replace('data:image/png;base64,','').replace("data:image/jpeg;base64,", "")))
//   try { 
      
//       let response = await fetch("https://ml.megamaxdevelopment.tech/api/holypics/predict", options)
//       console.log("response gotten"); 
//       let json = await response.json()
//       console.log(json)
//       callback(json)    
//     } catch (error) {
//       callback({error: error.toString()})
//     }
//     // .replace('data:image/png;base64,','').replace("data:image/jpeg;base64,", "")  
//   }


//   const Video = ()=>{
    
//       return (
//         <div>
//         <video id="my-video" controls={true} width="480" height="270"   crossOrigin="anonymous">
//           <source crossOrigin="anonymous" src={validVideoUrl} type="video/mp4" className="blured"/>
//         </video> 
//         <canvas id="my-canvas"></canvas>
//         </div>
//       );

//   };


//   let video  = document.querySelector("#my-video");
//   console.log(video)
//   const scale = 1;
//   let baseTimer = 5000
//   let timer = baseTimer;
//   let quickTimer = 3000;

//   const captureImage = ()=> {
//     console.log("video => ", video)
//     let canvas = document.createElement("canvas");
//     canvas.width = video.videoWidth * scale;
//     canvas.height = video.videoHeight * scale;
//     canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
//     return canvas.toDataURL()
// };

// const toggleClassList = (className)=>{
//   if(video.classList.contains(className)){
//       video.classList.remove(className);
//   }else{
//       video.classList.add(className);
//   }
// }




// setInterval(async () => {
//   video = document.querySelector("#my-video")
//   if(validVideoUrl=="" || video.paused) return;
//   console.log("starting")
  
//   const base64String = captureImage();
//   predict(base64String, (response)=>{
//     console.log(base64String)
//     if(response.error==undefined){
//       console.log("executing prediction expectation")
//       if(oldPredictionClass!=response.classIndex){
//         toggleClassList("blured")
//         setOldPredictionClass(response.classIndex)
//       }
//       if(response.classIndex===1){
//         timer = baseTimer
//     }else{
//         timer = quickTimer  
//     }
//     }else{
//       alert("we encoutered a problem during model prediction. Please check your prediction input an try again")
//     }
//   })
// }, timer);




  return (
    
    <main className="App">
      <Header/>
      <div className="main-container">
        <h1>Holypics beta test</h1>
        
        <ToastContainer />

        <br/><br/><br/>
        <div className="controls-container mb-4">
        
            {/* <div className="file-uploader">
            <h3 className="text-center">Drag and Drop Image</h3>
            <Dropzone onDrop={onDrop} accept={"image/*"} />

            </div> */}
            {/* <div className="url-uploader mb-4">
            <h3 className="text-center">Enter your video url</h3>
              <input type="email" className="form-control" id="activate" value={videoUrl} onChange={(event)=>{setVideoUrl(event.target.value);}} placeholder="Enter your video url"/>
              <Button className="btn btn-primary" onClick={()=>{setValidVideoUrl(videoUrl)}}>Submit</Button>
            </div>  
            <Video/> */}
        </div>

        
      
      </div>  
      
    </main>
  );
}

export default TestVideo;