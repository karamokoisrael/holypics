const imageToBase64 = require('image-to-base64');

const predictionUrl = 'http://holypics.megamaxdevelopment.tech/v1/models/holypics/versions/2:predict'; //'http://holypics.megamaxdevelopment.tech/v2/models/model:predict';

const calculateAverage = (pred)=>{
    let result = 0
    if (pred == 0) result = 1
    else if (pred < 0.5 && pred) result = (0.5-pred)/0.5
        
    else if (pred >= 0.5 && pred !=1) result = (pred-0.5)/0.5
         
    else result = 1
    
    return result
  }

const decodePrediction = (prediction)=>{

    let decodedClassIndex, decodePredictionPrecision;

    decodedClassIndex = prediction < 0.5 ? 0 : 1

    decodePredictionPrecision = calculateAverage(prediction)

    return [decodedClassIndex, decodePredictionPrecision];
}

const predictBase64String = async (base64String, callback, base64Back )=>{
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(
            {"inputs": 
                {"base64": [base64String]}
        
            }
        )
    }

    try { 
        let response = await fetch(predictionUrl, options)
        let json = await response.json()
        let classNames = ["adult", "neutral"]
        let prediction = json
        // console.log("view => ", prediction.outputs[0][0])
        let classDist, classIndex, output;
        

        classDist = parseFloat(prediction.outputs[0][0] != undefined ? prediction.outputs[0][0] : prediction.outputs[0]).toFixed(2)
        let [decodedClassIndex, decodePredictionPrecision] = decodePrediction(classDist)
        decodePredictionPrecision = 0.0000001>=decodePredictionPrecision ? 1 : decodePredictionPrecision
        classIndex = parseInt(classDist)
        // console.log("in => ", classDist)
        output = {
            className: classNames[decodedClassIndex],
            classIndex: decodedClassIndex,
            accuracy: decodePredictionPrecision,
            rawPrediction: classDist,
        }

        if(base64Back){
            output.base64Image = base64String
        }
        callback(output)
    } catch (error) {
        callback({error: error.toString()})
    }
}




export default async (req, res) => {
  if (req.method == 'POST') {
    // console.log(req.body)
    // await test();
    // res.status(200).json(results)


    if(req.body.url!=undefined){
      imageToBase64(req.body.url) // Image URL
      .then(
          (response) => {
              predictBase64String(response, (output)=>{
                res.status(200).json(output)
              }, req.body.base64Back!=undefined ? true : false)                
          }
      )
      .catch(
          (error) => {
            res.status(400).json({error: "conversion error => "+error}); // Logs an error if there was one
          }
      )
  }

  if(req.body.base64Image!=undefined){
      predictBase64String(req.body.base64Image, (output)=>{
        res.status(200).json(output)
      }, req.body.base64Back!=undefined ? true : false)
  }

  }else{
    res.status(400).json({error: "bad request"});
  }
  
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
}

