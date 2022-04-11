import React, { useState, useEffect, useRef, Fragment } from "react";


import { toast } from 'react-toastify';


import Header from "../components/Header"
import Footer from "../components/Footer"
const PredictionComponent = ()=>{ 
  
  const [predictData, setPredictionData] = useState({to_print: "", date: new Date()})
  const [predictionInterval, setPredictionInterval] = useState(parseInt(process.env.PREDICTION_INTERVAL))
  const [currentDate, setCurrentDate] = useState(new Date())
  const video = useRef(null)

  const predict = async (url)=>{
    const options = {
      method: 'POST',
      // agent: proxyAgent,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
      body: JSON.stringify(
        {"url": url } 
      )
  }
    try { 
        let response = await fetch("/api/analyse-image", options)
        let json = await response.json()
        console.log(json);
        if(json.error==undefined){
          const date = new Date()
          console.log(predictionInterval);
          if(currentDate == predictData.date){
            console.log(json);
            setPredictionData({...json, date: date})
            setCurrentDate(date)
          }
        
        }
        
    } catch (error) {
        console.log(error)
    }  
  }

  const captureImage = (video, scale=1) =>{
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    var imageUrl = canvas.toDataURL()
    return imageUrl
  };

  useEffect(() => {
        
    if (process.browser) {
      video.current = document.querySelector("#my-video");
      
      setInterval(async () => {
        video.current = document.querySelector("#my-video")
        console.log("processing");
        if(video.current!=undefined && video.current!=null && !video.current.paused){
            console.log("predicting");
            const base64String = captureImage(video.current);
            await predict(base64String)
        }
      }, predictionInterval);
      
    }
  }, []);
  return (
    <Fragment>
      <div className="container">
          <h3 className="text-center">Prediction Interval ( in seconds )</h3>
          <input type="email" className="form-control" id="activate" defaultValue={predictionInterval} onChange={(event)=>{
            // try {
            //   setPredictionInterval(parseInt(event.target.value)*1000);
            // } catch (error) {
            // }
          }} placeholder="Enter an interval"/>
      </div>
       <p key={predictData.to_print} dangerouslySetInnerHTML={{__html: predictData.to_print != undefined &&  predictData.to_print!="" ? predictData.to_print.replace(/\n/g, "<br />") : "clean"}}></p>
    </Fragment>
   
  )
}

function TestVideo() {

  return (
    <main className="App">
        <Header/>
        <div className="main-container">
          
          <div className="controls-container mb-4">
            
            <div className="mb-4">
              <h1>We are currently working on this page</h1>
            </div>


          </div>

        </div>
      
      <Footer/>
    </main>
  )
    
    const [videoSrc, setVideoSrc] = React.useState('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    const [currentVideoSrc, setCurrentVideoSrc] = useState('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

        

      const onVideoUrlAdd = ()=>{
          setCurrentVideoSrc(videoSrc)
      }

      const onFileAdd = (event)=>{
        const reader = new FileReader();
        reader.onload = function(e) { 
            setCurrentVideoSrc(e.target.result)
            toast("uploading done")
          
        };
        reader.readAsDataURL(event.target.files[0]);
  
    
      }

      const Video = ()=>{
        return(
          <video id="my-video" autoPlay={true} controls={true} crossOrigin="anonymous" className="my-video" style={{position: "relative", zIndex: 0}}>
                <source crossOrigin="anonymous" src={currentVideoSrc} type="video/mp4" className="my-video"/>
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

          <PredictionComponent/>
          <Video/>
          
          
          <Footer/>
        </main>
    )
}

export default TestVideo