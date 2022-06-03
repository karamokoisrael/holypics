import { Knex } from "knex";
import { Config } from "../@types/global";

export const getConfigs = async (database: Knex): Promise<Config> => {
    const [configurations] = await database("configurations").limit(1);
    const datasets = await database("datasets").where({ status: "published" });
    configurations.datasets = datasets;
    for (let i = 0; i < datasets.length; i++) {
            const production_models = await database("datasets_models").where({
                    datasets_id: datasets[i].id
            })
            for (let u = 0; u < production_models.length; u++) {
                    const [ model ] = await database("models").where({ id: production_models[u].models_id }).limit(1);
                    if(model.config != null) model.config = JSON.parse(model.config)
                    production_models[u].model = model;
            }
            if(datasets[i].class_names != null) datasets[i].class_names = JSON.parse(datasets[i].class_names)
            datasets[i].production_models = production_models;
    }
    return configurations;
}