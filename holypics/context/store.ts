import {createContext, useEffect, useRef, useState,useMemo } from 'react';

import create from "zustand";
import { devtools } from "zustand/middleware"
import GlobalAppContext from '../@types/global';

let store = (set: Function): GlobalAppContext => ({
    darkMode: false
})
//I can also use persist to make data persistent

const useStore = create<GlobalAppContext>(process.env.NODE_ENV != "production" ? devtools(store) : store);

export default useStore; 