import axios from "axios";

const sleep: (ms: number) => Promise<void> = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export type PredictionStatus = "starting" | "processing" | "succeeded" | "failed" | "canceled";

export type ReplicateInputProps = {
    apiToken: string,
    pollingInterval: number
}

export interface ReplicateModelInputs {
    path: string;
    version: string;
    replicate?: any;
    modelDetails?: any;
}

export interface ReplicateModel extends ReplicateModelInputs { }

export default class Replicate {
    // @ts-ignore
    models: {
        get: (path: string, version?: string) => Promise<ReplicateModel>;
    };
    apiToken: string;
    pollingInterval: number;
    constructor({ apiToken, pollingInterval }: ReplicateInputProps = { apiToken: "", pollingInterval: 5000 }) {
        this.apiToken = apiToken;
        this.pollingInterval = pollingInterval;
    }

    async startPrediction(modelId: string, input: any) {
        const headers = { Authorization: `Token ${this.apiToken}` };
        return await axios.post("https://api.replicate.com/v1/predictions",
            { version: modelId, input },
            { headers }
        );
    }

    async getPrediction(id: string) {
        const headers = { Authorization: `Token ${this.apiToken}` };
        return await axios.get(`https://api.replicate.com/v1/predictions/${id}`, { headers });
    }

    async predict(modelId: string, input: any) {
        const startResponse = await this.startPrediction(modelId, input);
        let predictionStatus: PredictionStatus;
        do {
            console.log("checking");
            const checkResponse = await this.getPrediction(startResponse.data.id);
            predictionStatus = checkResponse.data.status;
            console.log("status => ", predictionStatus);
            await sleep(this.pollingInterval);
            return checkResponse.data;
        } while (["starting", "processing"].includes(predictionStatus));
    }

    // const getPrediction = async (id: string) => {
    //     return await axios.get(`https://api.replicate.com/v1/predictions/${id}`, { headers });
    // }

}

export class ReplicateModel {
    static async fetch(options: ReplicateModelInputs): Promise<ReplicateModel> {
        const model = new ReplicateModel(options);
        await model.getModelDetails();
        return model;
    }

    constructor({ path, version, replicate }: ReplicateModelInputs) {
        this.path = path;
        this.version = version;
        this.replicate = replicate;
    }

    async getModelDetails() {
        const response = await this.replicate.getModel(this.path);
        const modelVersions = response.results;
        const mostRecentVersion = modelVersions[0];
        const explicitlySelectedVersion = modelVersions.find(
            (m: { id: string }) => m.id == this.version
        );
        this.modelDetails = explicitlySelectedVersion ? explicitlySelectedVersion : mostRecentVersion;
        if (this.version && this.version !== this.modelDetails.id) {
            console.warn(
                `Model (version:${this.version}) not found, defaulting to ${mostRecentVersion.id}`
            );
        }
    }

    // async *predictor(input: PredictionInput) {
    //     const startResponse = await this.replicate.startPrediction(this.modelDetails.id, input);
    //     let predictionStatus: PredictionStatus;
    //     do {
    //         const checkResponse = await this.replicate.getPrediction(startResponse.id);
    //         predictionStatus = checkResponse.status;
    //         await sleep(this.replicate.pollingInterval);
    //         yield checkResponse.output;
    //     } while (["starting", "processing"].includes(predictionStatus));
    // }

    // async predict(input: PredictionInput = "") {
    //     let prediction;
    //     for await (prediction of this.predictor(input)) {
    //         // console.log(prediction);
    //     }
    //     return prediction;
    // }
}









