import environment from "../constants/environment"

export const formatUrl = (path: string) => {
    return `${environment.apiUrl}/${path}`
}

export const getLogoUrl = () => {
    return formatUrl("public/logo")
}

export const getImageUrl = (imageId: string) => {
    return formatUrl(`file/${imageId}`)
}

export const arrayToPairs = (baseArray: any[]) => baseArray.reduce(function (result: any, value: any, index: any, array: any) {
    try {
        if (index % 2 === 0)
        result.push(array.slice(index, index + 2));
        return result;
    } catch (error) {
        return baseArray;
    }
}, []);