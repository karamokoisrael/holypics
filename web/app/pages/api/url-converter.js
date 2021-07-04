const imageToBase64 = require('image-to-base64');


export default async (req, res) => {
  if (req.method == 'POST') {
    // console.log(req.body)
    // await test();
    // res.status(200).json(results)


    if(req.body.url!=undefined){
        imageToBase64(req.body.url) // Image URL
        .then(
            (response) => {
                res.status(200).json({base64Image: response})              
            }
        )
        .catch(
            (error) => {
              res.status(400).json({error: "conversion error => "+error}); // Logs an error if there was one
            }
        )
    }



 

  }else{
    res.status(400).json({error: "bad request"});
  }
  
}
