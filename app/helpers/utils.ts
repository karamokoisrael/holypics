import { Linking } from "react-native"
import environment from "../constants/environment"

export const formatUrl = (path: string) => {
    return `${environment.apiUrl}/${path}`
}

export const getLogoUrl = () => {
    return formatUrl("public/logo")
}

// export const truncateText = (text: string, maxLength: number)=> text.length >= maxLength ? `${text.substring(0, 3)}...` : text

export const getImageUrl = (imageId: string) => {
    return formatUrl(`file/${imageId}`)
}

export const openUrl = async (url:  string)=>{
    try {
        const supported = await Linking.canOpenURL(url);
        if (supported) await Linking.openURL(url);
    } catch (error) { }
}

export const safelyGetProp = (data:any, filter: Function, defaultValue: any = undefined)=>{
    try {
        return filter(data);
    } catch (error) {
        return defaultValue;
    }
}
