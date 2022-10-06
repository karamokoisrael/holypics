import { Platform } from "react-native"

type PropsWithChildren = {
    children: JSX.Element,
    forceRendering?: boolean 
}

export const OnlyForWeb = ({ children, forceRendering }: PropsWithChildren) => Platform.OS === "web" || forceRendering ? children : null
export const OnlyForMobile = ({ children, forceRendering }: PropsWithChildren) => ["android", "ios"].includes(Platform.OS) || forceRendering ? children : null