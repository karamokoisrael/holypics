import { JsonObject } from './global';
import { ManualTransDetails } from './transaction';
import User from "./user";
type StateCtrlType = {
    user: User
    configs: JsonObject
    notifications: Array<Notification>
    socket?: WebSocket 
    stateCtrl?: JsonObject
    manualTransDetails: ManualTransDetails
    socketConnId: string
}
type AppContext =  {
    setUser: Function,
    setManualTransDetails: Function
    setNotifications: Function
    setSocket: Function
    setSocketConnId: Function
    setConfigs: Function
}  

type GlobalAppContext = AppContext & StateCtrlType

export default GlobalAppContext;

// export StateCtrlType;