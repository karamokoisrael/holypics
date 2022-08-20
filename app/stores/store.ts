import { Directus } from '@directus/sdk';
import create from "zustand";
import { Store } from '../@types/store';
import environment from '../constants/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { configurePersist } from "zustand-persist"
const { persist, purge } = configurePersist({
    storage: AsyncStorage, // use `AsyncStorage` in react native
    rootKey: 'root', // optional, default value is `root`
})


const useStore = create<Store>(
    persist({
        key: 'auth', // required, child key of storage
        allowlist: ['isAuthenticated', 'user', 'configs'], // optional, will save everything if allowlist is undefined
        denylist: [], // optional, if allowlist set, denylist will be ignored
    }, (set, get) => ({
        isAuthenticated: false,
        user: { id: "" },
        colorMode: "light",
        bottomBarSelectedIndex: 0,
        drawerSelectedIndex: 0,
        drawerOpened: false,
        onBoardingPassed: false,
        configs: {},
        notifications: [],
        socketConnId: "",
        socket: undefined,
        directus: new Directus(environment.apiUrl),
        recoveryPhrase: "",
        toggleDrawer: () => { return set(() => ({ drawerOpened: !get().drawerOpened })) },
        setBottomBarSelectedIndex: (value: number) => set(() => ({ bottomBarSelectedIndex: value })),
        setDrawerSelectedIndex: (value: number) => set(() => ({ drawerSelectedIndex: value })),
        setConfigs: (value: Record<string, any>) => set(() => ({ configs: value })),
        setColorMode: (value: "light" | "dark") => { return set(() => ({ colorMode: value })) },
        setSocketConnId: (value: string) => { return set(() => ({ socketConnId: value })) },
        setSocket: (value: WebSocket) => { return set(() => ({ socket: value })) },
        setUser: (value: Record<string, any>) => { return set(() => ({ user: value })); },
        setNotifications: (value: Array<Notification>) => { return set(() => ({ notifications: value })) },
    }))
)

export default useStore; 