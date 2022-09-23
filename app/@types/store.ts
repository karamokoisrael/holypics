import { RnColorScheme } from "twrnc";

export type Store = {
    isAuthenticated: boolean,
    user: Record<string, any>,
    onBoardingPassed: boolean,
    colorScheme: RnColorScheme,
    bottomBarSelectedIndex: number,
    drawerSelectedIndex: number,
    configs: Record<string, any>,
    socket: WebSocket | undefined,
    setBottomBarSelectedIndex: (index: number)=>any,
    setDrawerSelectedIndex: (index: number)=>any,
    setConfigs: Function,
    setSocket: Function,
    setUser: Function,
    toggleOnboardingStatus: ()=> void;
    toggleColorScheme: ()=> void;
    setColorScheme: (value: RnColorScheme)=> void;
    purgePersistenStore: ()=> void;
}
