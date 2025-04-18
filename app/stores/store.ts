import { RnColorScheme } from 'twrnc';
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
        key: 'cookie', // required, child key of storage
        allowlist: ['isAuthenticated', 'user', 'configs', 'colorScheme', 'onBoardingPassed'], // optional, will save everything if allowlist is undefined
        denylist: [], // optional, if allowlist set, denylist will be ignored
    }, (set, get) => ({
        isAuthenticated: false,
        user: { hf_token: "" },
        colorScheme: "light",
        bottomBarSelectedIndex: 0,
        drawerSelectedIndex: 0,
        drawerOpened: false,
        onBoardingPassed: false,
        configs: {},
        notifications: [],
        socketConnId: "",
        socket: undefined,
        toggleOnboardingStatus: () => set(() => ({ onBoardingPassed: !get().onBoardingPassed })),
        setBottomBarSelectedIndex: (value: number) => set(() => ({ bottomBarSelectedIndex: value })),
        setDrawerSelectedIndex: (value: number) => set(() => ({ drawerSelectedIndex: value })),
        setConfigs: (value: Record<string, any>) => set(() => ({ configs: value })),
        toggleColorScheme: () => { return set(() => ({ colorScheme: get().colorScheme == "light" ? "dark" : "light" })) },
        setColorScheme: (value: RnColorScheme) => { return set(() => ({ colorScheme: value })) },
        setSocket: (value: WebSocket) => { return set(() => ({ socket: value })) },
        setUser: (value: Record<string, any>) => { return set(() => ({ user: value })); },
        purgePersistenStore: async ()=> {
            try {
                await purge();
            } catch (error) {
                
            }
        }
    }))
)

export default useStore; 