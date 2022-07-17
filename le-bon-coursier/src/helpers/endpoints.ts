import { Model } from './../@types/global';
import { Knex } from "knex";

export const getConfigs = async (database: any, model: string): Promise<Model> => {
        try {
                const [modelData] = await database("models").where({ name: model }).limit(1) as Model[];
                modelData.parameters = JSON.parse(`${modelData.parameters}`);
                return modelData;
        } catch (error) {
                return {} as Model;
        }
}