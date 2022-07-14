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
export const predict = async (model: Model, base64Image: string, getBaseImageBack: boolean) => {
    try {
        const prediction = {
            id: uuidv4(),
            result: {} as Record<string, any>,
        } as Record<string,  any>;

        if(getBaseImageBack) prediction.base64_image = base64Image;
    
    
        const splitedImage = base64Image.split(",");
        const response = await predictFromModel(model, splitedImage[splitedImage.length - 1]);
        // console.log(`${process.env.TF_SERVING_API_URL}/v${model.current_version}/models/${model.name}:predict`);
        // const response = {data: {predictions: [[1, 1, 1]] }}
        const predictionOutput = response.data.predictions[0];
        for (let i = 0; i < predictionOutput.length; i++) {
            const predictionValue = predictionOutput[i];
            prediction.result[model.parameters[i].key] = {...model.parameters[i], value: predictionValue}
        }
        return prediction;
    } catch (error) {
        console.log(error);
        
        return { id: null }
    }
}