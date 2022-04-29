import React, { useState, useEffect, useRef, Fragment } from "react";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";

const captureImage = (video: any, scale = 1) => {
  try {
    if (video == null) return;
    const canvas: any = document.createElement("canvas");
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL();
    return imageUrl;
  } catch (error) {
    console.log(error);
    return null;
  }
};


function TestVideo() {
  // const video = useRef<HTMLVideoElement | Element | null>(null)
  const [videoSrc, setVideoSrc] = useState(
    ""
  );

  //https://holipics-filebrowser.karamokoisrael.tech/filebrowser/api/public/dl/F5J3S180
  const [videoUrl, setVideoUrl] = useState("");
  const [lastFrameDate, setLastFrameDate] = useState(new Date())
  const [prediction, setPrediction] = useState<Record<string, any>>({to_print: ""}) 
  const onFileAdd = (event: any) => {
    const toastId = toast.loading("File upload pending");
    const reader = new FileReader();
    reader.onload = function (e) {
      setVideoSrc(e?.target?.result as string);
      toast.update(toastId, {
        render: "File uploaded successfully",
        type: "success",
        isLoading: false,
      });
      
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const predict = async (url: string, random = false) => {

    const date = new Date();

    const options: Record<string, any> = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (url != "") {
      options.body = JSON.stringify({ url });
    }    

    try {
      const requestUrl =
        // process.env.API_URL +
        "/externalApi" +
        (random != undefined && random != false ? "/predictFromRandomUrl" : "/predictFromUrl");
      let response = await fetch(requestUrl, options);
      let json = await response.json();
      if (json.errors != undefined) return;
      if(date < lastFrameDate) return;
      setLastFrameDate(date)
      console.log(json);
  
    
    } catch (error: any) {
      toast(
        "we encoutered a problem during model prediction. Please check your prediction input an try again"
      );
      console.log({ error: error.toString() });
    }
  };

  useEffect(() => {
    if (process.browser) {
      console.log("browser content loaded");
      const currentVideo = document.querySelector("#video");
      if (currentVideo == null) return;
      console.log("video not null");

      // currentVideo.addEventListener("progress", (e: any)=>{
      //   console.log(e);
      //   console.log("video player is progressing");
      // })

      currentVideo.addEventListener("start", (e: any) => {
        console.log(e);
        console.log("video player is starting");
      });

      currentVideo.addEventListener("timeupdate", async (e: any) => {
        // console.log(e);
        const frame = captureImage(currentVideo);
        if(frame != null) await predict(frame)        
      });
    }
  }, [videoSrc]);
  return (
    <main className="App">
      <Header />
      <div className="main-container">
        <div className="controls-container mb-4">
          {/* <div className="mb-4">
              <h1>We are currently working on this page</h1>
            </div> */}

          <div className="d-flex flex-column">
            <div className="url-uploader mb-4">
              <h3 className="text-center">pick a video from your device</h3>
              <input
                type="file"
                name="url-uploader"
                className="form-control"
                onChange={(e) => {
                  onFileAdd(e);
                }}
              />
            </div>
            <div className="url-uploader mb-4">
              <h3 className="text-center">Enter your video url</h3>
              <input
                type="email"
                className="form-control"
                id="activate"
                onChange={(event) => {
                  setVideoUrl(event.target.value);
                }}
                placeholder="Enter your video url"
              />
              <button
                className="btn btn-primary"
                onClick={() => setVideoSrc(videoSrc)}
              >
                Submit
              </button>
            </div>

            <video
              id="video"
              src={videoSrc}
              controls
              height={400}
              width={400}
            ></video>
            <p>
              {
                prediction.to_print.replace(/\n/g, "<br />")
              }
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default TestVideo;
