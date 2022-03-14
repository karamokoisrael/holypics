import { db } from '../../config/firebase'
export default async (req, res) => {
  if (req.method == 'POST') {
    // console.log(req.body)
    // await test();
    // res.status(200).json(results)
    

    if(req.body.base64image!=undefined){
        console.log(db)
      console.log(req.body)
  }

  let completeDate = new Date()


  const result = {
    userPrediction: req.body.userPrediction,
    succeeded: req.body.succeeded,
    base64Image: req.body.base64Image,
    className: req.body.className,
    classIndex: req.body.classIndex,
    accuracy: req.body.accuracy,
    rawPrediction: req.body.rawPrediction,
    day: completeDate.getDay()+1,
    month: completeDate.getMonth()+1,
    year: completeDate.getFullYear(),
    time: completeDate.getUTCHours().toString()+":"+completeDate.getUTCMinutes().toString()+":"+completeDate.getUTCSeconds().toString()//+":"+completeDate.getUTCMilliseconds().toString()
  }

  db.ref("feedback").push(result).then(()=>{
    res.status(200).json(result)
  }).catch(()=>{
    res.status(400).json({error : "we encoutered an unexpected error"})
  })
  


  
}
}
