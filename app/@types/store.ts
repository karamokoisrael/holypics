import { Directus } from "@directus/sdk";

export type Store = {
    user: Record<string, any>,
    recoveryPhrase: String,
    onBoardingPassed: boolean,
    colorMode: "light" | "dark",
    bottomBarSelectedIndex: number,
    configs: Record<string, any>,
    directus: Directus<Record<string, any>>;
    notifications: Record<string, any>[],
    socketConnId: string,
    socket: WebSocket | undefined,
    setBottomBarSelectedIndex: (index: number)=>{},
    setConfigs: Function,
    setSocketConnId: Function,
    setSocket: Function,
    setUser: Function,
    setNotifications: Function,
    setColorMode: Function
}
