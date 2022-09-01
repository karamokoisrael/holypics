import { Directus } from "@directus/sdk";
import { RnColorScheme } from "twrnc";

export type Store = {
    isAuthenticated: boolean,
    user: Record<string, any>,
    recoveryPhrase: String,
    onBoardingPassed: boolean,
    colorScheme: RnColorScheme,
    bottomBarSelectedIndex: number,
    drawerSelectedIndex: number,
    drawerOpened: boolean,
    configs: Record<string, any>,
    directus: Directus<Record<string, any>>;
    notifications: Record<string, any>[],
    socketConnId: string,
    socket: WebSocket | undefined,
    toggleDrawer: Function
    setBottomBarSelectedIndex: (index: number)=>any,
    setDrawerSelectedIndex: (index: number)=>any,
    setConfigs: Function,
    setSocketConnId: Function,
    setSocket: Function,
    setUser: Function,
    setNotifications: (Function),
    toggleColorScheme: ()=> void;
    setColorScheme: (value: RnColorScheme)=> void;
    purgePersistenStore: ()=> void;
}
