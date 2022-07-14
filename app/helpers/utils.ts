import environment from "../constants/environment"

export const formatUrl = (path: string)=>{
    return `${environment.apiUrl}/${path}`
}

export const getLogoUrl = ()=>{
    return formatUrl("public/logo")
}

export const getImageUrl = (imageId: string)=>{
    return formatUrl(`file/${imageId}`)
}