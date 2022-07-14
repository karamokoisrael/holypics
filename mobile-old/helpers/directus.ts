export const ObjectToEqFilter = (object: Record<string, any>)=>{
    const filter: Record<string, any> = {}
    Object.keys(object).forEach(key => {
        filter[key] = { "_eq": object[key] }
    });

    return filter;
}
