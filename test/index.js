const axios = require("axios");
const Replicate = require('replicate-js')
const exec = async () => {
  const model = {
    version: "9e767fbac45bea05d5e1823f737f927856c613e18cbc8d9068bafdc6d600a0f7",
    path: "cjwbw/waifu-diffusion",
  };




const replicate = new Replicate({token: '63e40feae476e8d5ce6b45e7bd189cfd9022c65c'});

// If you set the REPLICATE_API_TOKEN environment variable, you do not need to provide a token to the constructor.
// const replicate = new Replicate();
const helloWorldModel = await replicate.models.get('replicate/hello-world');
const helloWorldPrediction = await helloWorldModel.predict({ text: "test"});
console.log(helloWorldPrediction);
  // const body = {
  //   version: model.version,
  //   input: {
  //     width: 512,
  //     height: 512,
  //     prompt: "kid walking",
  //     num_outputs: 1,
  //     guidance_scale: 7.5,
  //     num_inference_steps: 50,
  //   },
  // };
  // const headers = {
  //   Authorization: "Token 63e40feae476e8d5ce6b45e7bd189cfd9022c65c",
  //   Accept: 'application/json',
  //   'Content-Type': 'application/json',
  // };
  // console.time();
  // const req = await axios.post(
  //   "https://api.replicate.com/v1/predictions",
  //   body,
  //   {
  //     headers,
  //   }
  // );
  
  // console.log(req.data);
  // if (req.data.error == null) {
  //   await new Promise((resolve, reject) =>
  //     setTimeout(() => {
  //       resolve();
  //     }, 30000)
  //   );

  //   const url = `https://replicate.com/api/models/${model.path}/versions/${model.version}/predictions/${req.data.id}`

  //   const generated = await axios.get(url,{ headers });
  //   console.log(generated.data);
  //   console.timeEnd();
  // }
};

exec();
