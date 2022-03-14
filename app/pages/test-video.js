import React from "react";

import Masonry from 'react-masonry-css'

import { toast } from 'react-toastify';


import Header from "../components/Header"
import Footer from "../components/Footer"

function TestVideo() {
    const [videoVisibility, toggleVideoVisibility] = React.useState(true)
    const [videoSrc, setVideoSrc] = React.useState('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    const [currentVideoSrc, setCurrentVideoSrc] = React.useState('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    

    const predict = async (base64Image)=>{
        // toast("prediction pending");
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
              {"base64Image": base64Image.replace('data:image/png;base64,','').replace("data:image/jpeg;base64,", "")  } 
          )
      }
      console.log("running request");
      try { 
          
          let response = await fetch("/api/analyse-image", options)
          console.log("response gotten"); 
          let json = await response.json()
          if(json.error==undefined){
            console.log(json)
            const videoVisible = json.classIndex==1
            if(json.accuracy>0.5){
                toggleVideoVisibility(videoVisible)
            }
          }else{
            toast("we encoutered a problem during model prediction. Please check your prediction input an try again")
          }
           
          console.log(json)
        } catch (error) {
            toast("we encoutered a problem during model prediction. Please check your prediction input an try again")
            console.log({error: error.toString()})
        }
        // .replace('data:image/png;base64,','').replace("data:image/jpeg;base64,", "")  
      }

      if (process.browser) {
        let video = document.querySelector("#my-video"), base64String;
        const scale = 1;
        const captureImage = () =>{
            var canvas = document.createElement("canvas");
            canvas.width = video.videoWidth * scale;
            canvas.height = video.videoHeight * scale;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            var imageUrl = canvas.toDataURL()
            // var img = document.querySelector("#my-image")
            
            // img.setAttribute("src", canvas.toDataURL())
            return imageUrl
        };
        React.useEffect(() => {
            setInterval(() => {
                if(!video.paused){
                    base64String = captureImage();
                    predict(base64String)
                }
                
            }, 5000);
        }, [currentVideoSrc, videoVisibility]);
        

      }


      const onVideoUrlAdd = ()=>{
          setCurrentVideoSrc(videoSrc)
      }

      const onFileAdd = (event)=>{
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log("video to base 64 conversion")
          // console.log(e.target.result.replace('data:image/png;base64,','').replace("data:image/jpeg;base64,", "")) 
            setCurrentVideoSrc(e.target.result)
            console.log(currentVideoSrc)
            toast("uploading done")
          
        };
        reader.readAsDataURL(event.target.files[0]);
      
        toast("uploading file")
        //predict(event.target.files[0])
    
      }

      const Video = ()=>{
        return(
          <video id="my-video" autoPlay={true} controls={true} crossOrigin="anonymous" className={`my-video ${videoVisibility ? "" : "blured" }`}>
              <source crossOrigin="anonymous" src={currentVideoSrc} type="video/mp4" className={`my-video ${videoVisibility ? "" : "blured" }`}/>
          </video>
        )
    }
      
    return (
        <main className="App">
        <Header/>
      <div className="main-container">
        
      <div className="controls-container mb-4">
        
        <div className="url-uploader mb-4">
        <h3 className="text-center">Enter your video url</h3>
          <input type="email" className="form-control" id="activate" onChange={(event)=>{setVideoSrc(event.target.value);}} placeholder="Enter your video url"/>
    
          <button className="btn btn-primary" onClick={onVideoUrlAdd}>Submit</button>
        </div>
        <div className="url-uploader mb-4">
          <h3 className="text-center">pick a video from your device</h3>
          <input type="file" name="url-uploader" className="form-control" onChange={(e)=>{onFileAdd(e)}}/>
        </div>

    </div>

      </div>


      <Video/>
      
      <Footer/>
    </main>
    )
}

export default TestVideo