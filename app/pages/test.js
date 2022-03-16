import Header from "../components/Header"
import Footer from "../components/Footer"
import hotkeys from 'hotkeys-js';


// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTumblr, faTwitter } from '@fortawesome/free-brands-svg-icons'

import React from "react";
import cuid from "cuid";

import Masonry from 'react-masonry-css'

import { toast } from 'react-toastify';

function Test() {
  const [images, setImages] = React.useState([]);
  const [imageUrl, setImageUrl] = React.useState("")

  React.useEffect(()=>{
    hotkeys('r', function(event, handler){
      // Prevent the default refresh event under WINDOWS system
      event.preventDefault() 
      autoTest() 
    });
  }, [])
  const cors = require('cors');
  cors();
  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };
  

  const onFileAdd = (event)=>{
    const reader = new FileReader();
    reader.onload = function(e) {
      // console.log(e.target.result.replace('data:image/png;base64,','').replace("data:image/jpeg;base64,", ""))
      predict(e.target.result)
    };
    reader.readAsDataURL(event.target.files[0]);
  
    toast("uploading file")
    //predict(event.target.files[0])

  }
    
  const predict = async (base64Image)=>{
    toast("prediction pending");
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
        setImages(prevState => [
          ...prevState,
          { id: cuid(), src: base64Image, hidden: json.classIndex==0, classIndex:json.classIndex, class: json.className, precision: json.accuracy, rawPrediction: json.rawPrediction, feedBackSent: false}
          ]);
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


  const arrayBufferToBase64 = (buffer)=> {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach((b) => binary += String.fromCharCode(b));

    return window.btoa(binary);
  };


  const onUrlAdd = async ()=>{
    
    if(imageUrl=="") return;
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
          {"url": imageUrl  } 
      )
  }
  console.log("running request");
  try { 
      
      let response = await fetch("/api/url-converter", options)
      console.log("response gotten"); 
      let json = await response.json()
      if(json.error==undefined){
        let base64Flag = 'data:image/jpeg;base64,';
        let imageStr = json.base64Image;
        predict(base64Flag+imageStr)
      }else{
        toast("problem to analyse url. Check your url and try again")
      }

      
    } catch (error) {
        console.log({error: error.toString()})
        toast("problem to analyse url. Check your url and try again")
    }


  }

  const compareFeedbackToPrediction = (userFeedback, predictionClassIndex)=>{
    let userClassIndex;
    if(userFeedback == 1){
      userClassIndex = predictionClassIndex
    }else{
      if(predictionClassIndex == 1){
        userClassIndex = 0
      }else{
        userClassIndex = 1
      }
    }
    return [userClassIndex, userClassIndex == predictionClassIndex ? 1 : 0]
  }

  const sendFeedback = async (image, value)=>{
    const [userClassIndex, predictionSuccess] = compareFeedbackToPrediction(value, image.classIndex)
    const options = {
      method: 'POST',
      // agent: proxyAgent,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
      mode: "cors",
      //{ id: cuid(), src: base64Image, hidden: json.classIndex==0, classIndex:json.classIndex, class: json.className, precision: json.accuracy }
      body: JSON.stringify(
        {
          succeeded: predictionSuccess,
          userPrediction: userClassIndex,
          base64Image: image.src,
          className: image.class,
          classIndex: image.classIndex,
          accuracy: image.precision,
          rawPrediction: image.rawPrediction,
          
      }
      )
  }

  console.log("running request");
  try { 
      
      let response = await fetch("/api/feedback", options)
      console.log("response gotten"); 
      let json = await response.json()

      console.log(json)
      const imageIndex = images.findIndex((element)=> element.cuid == image.cuid)
      
      if(imageIndex!=-1){
          let newImages = images;  
          //newImages.splice(imageIndex)
          newImages[imageIndex].feedBackSent = true
          console.log(newImages[imageIndex])
          setImages(newImages);
          console.log(images)
      }
      toast(`you sent a ${value==0 ? "negative" : "positive"} feedback to our prediction`);
    } catch (error) {
        console.log({error: error.toString()})
    }
    //image
  }

  const Image = ({ image }) => {

    return (
      <div className="card">
        <img alt={`img - ${image.id}`} src={image.src} className="file-img card-img-top" hiddenblind={ image.hidden==true? "true": "false"}/>
        <div className="card-body">
          <h5 className="card-title">Class: {image.class}</h5>
          <p className="card-text">Confidence: {image.precision*100}%</p>
          <button href="#" onClick={()=>{ 

              setImages(images.filter((value, index, arr)=>{    
                    return value.id != image.id;
                }))
            
            }
    
    } className="btn btn-danger"><icon className="fa fa-trash"></icon></button>
          <button onClick={()=>{sendFeedback(image, 1)}} className="btn btn-primary" disabled={image.feedBackSent}><icon className="fa fa-thumbs-up"></icon></button>
          <button onClick={()=>{sendFeedback(image, 0)}} className="btn btn-primary" disabled={image.feedBackSent}><icon className="fa fa-thumbs-down"></icon></button>
          <button onClick={()=>{
                var win = window.open();
                win.document.write('<iframe src="' + image.src  + '" frameborder="0" style="bottom:0px; right:0px; width:100vw !important; height:100vh !important; display: flex !important;align-items: center;justify-content: space-around;" allowfullscreen></iframe>');
            
            // const index = images.findIndex((value)=>{ 
            //     return value.id == image.id;
            // })
            // if (index!=-1){
            //     let currentImages = images
            //     currentImages[index].hidden = (currentImages[index].hidden == true ? false : true);
            //     setImages(currentImages)
            // }

            
            
          }} className="btn btn-primary"><icon className="fa fa-eye"></icon></button>
        </div>
     </div>

    );
  };

  const ImageList = ({ images }) => {

    // render each image by calling Image component
    const renderImage = (image, index) => {
      return (
        <Image
          image={image}
          key={`${image.id}-image`}
        />
      );
    };

    // Return the list of files
    return <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
          {images.map(renderImage)}
      </Masonry>;
  };


const getRandomNumber = (MIN = 0, MAX=10)=>{

  // Figure out the delta, with subtraction
  const DELTA = MAX - MIN;
  // Get an initial random value.
  // Between 0 and 0.999999 (inclusive)
  const initialRandom = Math.random();
  // Multiply it by our DELTA, 3.
  // Will be between 0 and 2.999999 (inclusive)
  const multiplied = initialRandom * DELTA;
  // Round it down using Math.floor.
  // Will be 0, 1, or 2.
  const floored = parseInt(Math.floor(multiplied));

  return floored;
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}


  const autoTest = async ()=>{
    console.log("auto test started")
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
    }
    const cat = getRandomNumber(0, 153);
    const limit = 60;
    const offset = 120;
    const url = `https://www.pornpics.com/getchank2.php?rid=1&cat=${cat}&limit=${limit}&offset=${offset}`;
    const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    try { 
        let response = await fetch(url, options)
        let json = await response.json()
        const floored = getRandomNumber(0, json.length-1)
        const sampleUrl = json[floored].t_url_460
        
        // toast("the url have been copied in your clipboard");
     
        // copyTextToClipboard(sampleUrl);
        // toast("If you can't execute ctrl+v, try with the following image url: \n \n"+sampleUrl)

        fetch(sampleUrl).then((response) => {
          response.arrayBuffer().then((buffer) => {
            let base64Flag = 'data:image/jpeg;base64,';
            let imageStr = arrayBufferToBase64(buffer);
            predict(base64Flag+imageStr)
          });
        });

    //     json = json.sort( () => .5 - Math.random() );

    //     for(let i=autoTestLimit-10;i<json.length;i++){
            
    //         setImageUrl(json[i].t_url_460)
    //         console.log(json[i].t_url_460)
    //         onUrlAdd(

    //         )
    //         console.log(imageUrl)
    //     } 
    //     setAutoTestLimit(autoTestLimit+10)  
    //     //console.log(json) 
    }catch (error) {
        console.log({error: error.toString()})
    }
    
}





  return (
    
    <main className="App">
        <Header/>
      <div className="main-container">
        <h1>Holypics Image beta test</h1>
        <br/>
        <h3> Help us protecting our children against inappropriate contents </h3>


        <p>
          <ul>
            <li>you add make a random test by clicking on the Auto test button or by cliking on the "r" key of your keyboard</li>
            <li>you add a image url an then clique on the submit button to analyse your image</li>
            <li>you can upload your image file and test it by using the upload button</li>
            <li>for each prediction, the like or dislike button help us knowing if you agree with our model prediction. By acting like that you can contribute to our model optimization</li>
          </ul>
        </p>
        <button className="btn btn-primary" onClick={()=>{autoTest()}}>Auto test</button>
        

        <br/><br/><br/>
        <div className="controls-container mb-4">
        
            {/* <div className="file-uploader">
            <h3 className="text-center">Drag and Drop Image</h3>
            <Dropzone onDrop={onDrop} accept={"image/*"} />

            </div> */}
            <div className="url-uploader mb-4">
            <h3 className="text-center">Enter your image url</h3>
              <input type="email" className="form-control" id="activate" value={imageUrl} onChange={(event)=>{setImageUrl(event.target.value);}} placeholder="Enter your image url"/>
        
              <button className="btn btn-primary" onClick={onUrlAdd}>Submit</button>
            </div>
            <div className="url-uploader mb-4">
              <h3 className="text-center">pick an picture from your device</h3>
              <input type="file" name="url-uploader" className="form-control" onChange={(e)=>{onFileAdd(e)}}/>
            </div>
            <div className="mb-4">
              <h3 className="text-center">clean up history</h3>
              <button className="btn btn-primary" onClick={()=>{setImages([])}}>Clean</button>
            </div>
        </div>

        <div className="content-viewer">
        <ImageList images={images} />
        </div>
        {/* <video id="my-video" autoplay="true" controls="true" width="480" height="270" crossOrigin="anonymous">
          <source crossOrigin="anonymous" src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' type="video/mp4" class="blured"/>
        </video> */}
      </div>  
     
      <Footer/>
    </main>
  );
}

export default Test;