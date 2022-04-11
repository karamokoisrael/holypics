
export default async (req, res) => {
  if (req.method == 'POST') {
      try {
        const options = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(req.body)
      }
        let response = await fetch(process.env.API_URL+ "/leaveFeedback", options)
        let json = await response.json()
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

