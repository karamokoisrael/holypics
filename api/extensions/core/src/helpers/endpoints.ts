import { Model } from "./../@types/global";

export const getConfigs = async (
  database: any,
  model: string
): Promise<Model> => {
  try {
    const [modelData] = (await database("models")
      .where({ name: model })
      .limit(1)) as Model[];
    (modelData as any).parameters = JSON.parse(
      `${(modelData as any).parameters}`
    );
    return modelData as Model;
  } catch (error) {
    return {} as Model;
  }
};
