const predictUrl = async (url=undefined, random=undefined)=>{
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
    }

    if(url!=undefined){
      options.body = JSON.stringify({url})
    }

    return new Promise(async (resolve, reject)=>{
      try { 
        let response = await fetch(process.env.API_URL+ ( random!=undefined ? "/predictFromRandomUrl" : "/predictFromUrl" ), options)
        let json = await response.json()
        resolve([json, response])
        
    } catch (error) {
      reject(error)
    }
    })
}

export default async (req, res) => {
  if (req.method == 'POST') {
      try {
        const [json, response] = await predictUrl(req.body.url, req.body.random);
        res.status(response.status).json(json)
      } catch (error) {
        res.status(500).json({error: error.toString()})
      }
    
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
}

