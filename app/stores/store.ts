import { Directus } from '@directus/sdk';
import create from "zustand";
import { devtools } from "zustand/middleware"
import { Store } from '../@types/store';
import environment from '../constants/environment';
import { Platform } from "react-native"
let store = (set: Function, get: Function): Store => ({
    user: { id: "" },
    colorMode: "light",
    bottomBarSelectedIndex: 0,
    onBoardingPassed: false,
    configs: {},
    notifications: [],
    socketConnId: "",
    socket: undefined,
    directus: new Directus(environment.apiUrl),
    recoveryPhrase: "",
    setBottomBarSelectedIndex: (value: number) => set((state: Store) => ({ bottomBarSelectedIndex: value })),
    setConfigs: (value: Record<string, any>) => set((state: Store) => ({ configs: value })),
    setColorMode: (value: "light" | "dark") => { return set(() => ({ colorMode: value })) },
    setSocketConnId: (value: string) => { return set(() => ({ socketConnId: value })) },
    setSocket: (value: WebSocket) => { return set(() => ({ socket: value })) },
    setUser: (value: Record<string, any>) => { return set(() => ({ user: value })); },
    setNotifications: (value: Array<Notification>) => { return set(() => ({ notifications: value })) },
})
//I can also use persist to make data persistent

const useStore = create<Store>(environment.environment != "production" && Platform.OS === 'web' ? devtools(store) : store);

export default useStore; 