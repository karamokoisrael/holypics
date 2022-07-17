import { Model } from '../@types/global';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
const predictFromModel = async (model: Model, pureBase64Image: string) => {
    console.log(`${process.env.TF_SERVING_API_URL}/v${model.current_version}/models/${model.name}:predict`);
    
    const response = await axios.post(`${process.env.TF_SERVING_API_URL}/v${model.current_version}/models/${model.name}:predict`, 
        {
            instances: [pureBase64Image],
        },
        // {
        //     maxContentLength: 100000000,
        //     maxBodyLength: 1000000000
        // }   
    )
    return response;
}
export const predict = async (model: Model, base64Image: string, getBaseImageBack: boolean, t: Function) => {
    try {
        const prediction = {
            id: uuidv4(),
            result: {} as Record<string, any>,
            text_data: "",
        } as Record<string,  any>;

        if(getBaseImageBack) prediction.base64_image = base64Image;
    
    
        const splitedImage = base64Image.split(",");
        const response = await predictFromModel(model, splitedImage[splitedImage.length - 1]);
        // console.log(`${process.env.TF_SERVING_API_URL}/v${model.current_version}/models/${model.name}:predict`);
        // const response = {data: {predictions: [[1, 1, 1]] }}
        const predictionOutput = response.data.predictions[0];
        
        for (let i = 0; i < predictionOutput.length; i++) {
            const predictionValue = predictionOutput[i];
            const params = model.parameters[i] as Record<string, any>;

            if(params["min_display_percentage"] < predictionValue){
                prediction.text_data+=`${t(model.parameters[i].key)}: ${(predictionValue*100).toPrecision(2)}%; \n`
            }
            
            
            prediction.result[model.parameters[i].key] = {...params, value: predictionValue}
        }
        return prediction;
    } catch (error) {
        console.log(error);
        
        return { id: null }
    }
}