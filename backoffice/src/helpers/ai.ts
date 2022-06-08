import { Dataset, ProductionModel } from '../@types/global';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
const predictFromModel = async (productionModel: ProductionModel, pureBase64Image: string) => {
    const response = await axios.post(`${process.env.TF_SERVING_API_URL}/v${productionModel.model.version}/models/${productionModel.model.name}:predict`, 
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
export const predict = async (dataset: Dataset, base64Image: string) => {
    try {
        const prediction = {
            id: uuidv4(),
            textData: "",
            blurred: false,
            result: {} as Record<string, any>,
            base64Image
        }
        const productionModel = dataset.production_models[0];
        const modelConfig = productionModel.model.config
        const splitedImage = base64Image.split(",");
        const response = await predictFromModel(productionModel, splitedImage[splitedImage.length - 1]);
        const predictionOutput = response.data.predictions[0];
        for (let i = 0; i < predictionOutput.length; i++) {
            const predictionValue = predictionOutput[i];
            prediction.result[modelConfig.classes[i]] = predictionValue
            if (predictionValue > modelConfig.prediction_threshold) {
                prediction.textData += `${dataset.class_names[i]}: ${Math.round(predictionValue * 100)}% \n`
            }
        }
        if (predictionOutput[predictionOutput.length - 1] < dataset.prediction_threshold) prediction.blurred = true;
        if (prediction.textData === "") prediction.textData = dataset.neutral_class_name;
        return prediction;
    } catch (error) {
        console.log(error);
        
        return { id: null }
    }
}