import Header from "../components/Header"
import Footer from "../components/Footer"
import hotkeys from 'hotkeys-js';
import React, { useState } from "react";
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
      if(event.key == "r") autoTest() 
    });

    hotkeys('q', function(event, handler){
      event.preventDefault()  
      if(event.key == "q") setImages([])      
    });
  }, [])

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };
  
  const onFileAdd = (event)=>{
    const reader = new FileReader();
    // reader.onload = function(e) {
    //   predict(e.target.result)
    // };

    reader.onloadend = function(e) {
      predict(e.target.result)
    };

    console.log(event.target.files.length);
    for (let i = 0; i < event.target.files.length; i++) {
      try {
        
        reader.readAsDataURL(event.target.files[i]);
      } catch (error) {
        console.log(error);
        console.log(event.target.files[i]);
      }
      
    }
    
  
    toast("uploading file")

  }
    
  const predict = async (url, random=false)=>{
    toast("prediction pending");
    const options = {
      method: 'POST',
      // agent: proxyAgent,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
      body: JSON.stringify(
        random ?
        {random}:
        {"url": url } 
      )
  }

  try { 
      
      let response = await fetch("/api/analyse-image", options)
      let json = await response.json()
      if(json.error==undefined){
        setImages(prevState => [
          ...prevState,
          { id: cuid(), src: url, hidden: false, ...json, comment: "", rating: 0, feedBackSent: false}
          ]);
      }else{
        toast("we encoutered a problem during model prediction. Please check your prediction input an try again")
      }
      
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
    try { 
        
      predict(imageUrl)

    } catch (error) {
        console.log({error: error.toString()})
        toast("problem to analyse url. Check your url and try again")
    }
  }

  const sendFeedback = async (image)=>{
    const options = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
      body: JSON.stringify(
        {
          "rating": image.rating,
          "comment": image.comment,
          "prediction_data": image.to_print.replace(/\n/g, "<br />"),
          "image_url": image.url
        }
      )
  }

  try { 

      let response = await fetch("/api/feedback", options)
      let json = await response.json()
      toast("feedback submitted");
    } catch (error) {
        console.log({error: error.toString()})
    }
    //image
  }

  const Image = ({ image, key }) => {
    const [imageData, setImageData] = useState(image)

    return (
      <div className="card" key={imageData.rating}>
        <img alt={`img - ${imageData.id}`} src={imageData.url} className="file-img card-img-top" hiddenblind={ imageData.hidden==true? "true": "false"}/>
        <div className="card-body">
          <p className="card-text" dangerouslySetInnerHTML={{__html: imageData.to_print != undefined ? ( imageData.to_print == "" ? "image_clean" : imageData.to_print.replace(/\n/g, "<br />") ) : "RAS"}}></p>
          <button href="#" onClick={()=>{ 
              setImages(images.filter((value, index, arr)=>{    
                    return value.id != imageData.id;
                }))
            }} className="btn btn-danger">
              <icon className="fa fa-trash"></icon>
          </button>
          <button onClick={()=>{
                var win = window.open(imageData.url);            
            }} className="btn btn-primary">
              <icon className="fa fa-eye"></icon>
          </button>
          <div className="container">
            
            <div className="d-flex flex-row flex-column">
              <div className="form-group mb-10">
                <label htmlFor="exampleFormControlTextarea1">Comment</label>
                <textarea disabled={imageData.feedBackSent} onChange={(e)=>{
                    setImageData({...imageData, comment: e.target.value})
                }} defaultValue={imageData.comment} className="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="insert a comment"></textarea>
              </div>
              <div style={{marginTop: 10}}> 
                {
                  [1, 2, 3, 4, 5].map((star)=>(
                    <a key={star} href="#" onClick={(e)=>{
                      e.preventDefault()
                      if(imageData.rating == star){
                        setImageData({...imageData, rating: star-1})
                      }else{
                        setImageData({...imageData, rating: star})
                      }
                      
                    }} className="star">
                      <icon className={`fa fa-star star-icon ${imageData.rating >= star ? "active": ""} `} ></icon>
                  </a>
                  ))
                }
              </div>
            </div>
            <button onClick={()=>{sendFeedback(imageData); setImageData({...imageData, feedBackSent: true})}} className="btn btn-primary mt-10"  style={{marginTop: 10}} disabled={imageData.feedBackSent}>Submit feedback</button>
          </div>
        </div>
     </div>

    );
  };
  
  const ImageList = ({ images }) => {
    return <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">
          {images.map((image, index) => {
            image.id = index
            return (
                <Image
                  image={image}
                  key={index}
                />
              );
        })}
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

  const autoTest = async ()=>{   
    predict("", true) 
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
            <li>"q" to clean</li>
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
              <h3 className="text-center">pick a picture from your device</h3>
              <input type="file" name="file[]" multiple  className="form-control" onChange={(e)=>{onFileAdd(e)}}/>
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
          <source crossOrigin="anonymous" src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' type="video/mp4" className="blured"/>
        </video> */}
      </div>  
     
      <Footer/>
    </main>
  );
}

export default Test;