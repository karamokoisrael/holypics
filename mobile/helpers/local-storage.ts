import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
    }
}

export const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if(value !== null) return value;
      return null;
    } catch(e) {
      return null;
    }
}

export const storeJsonData = async (key: string, value: any) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
      // saving error
    }
}

export const getJsonData = async (key: string) => {
    try {
        const data = await getData(key)
        let jsonValue: Record<string, any> | null  = null;        
        if(data != null) jsonValue = JSON.parse(data);
        return jsonValue;
    } catch (e) {
        return null;
    }
}
  