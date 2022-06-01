import { Config } from "./global"

export type Store = {
    user: Record<string, any>,
    onBoardingPassed: boolean,
    colorMode: "light" | "dark",
    bottomBarSelectedIndex: number,
    configs: Config,
    notifications: Record<string, any>[],
    socketConnId: string,
    socket: WebSocket | undefined,
    setBottomBarSelectedIndex: Function
    setConfigs: Function,
    setSocketConnId: Function,
    setSocket: Function,
    setUser: Function,
    setNotifications: Function,
    setColorMode: Function
}
