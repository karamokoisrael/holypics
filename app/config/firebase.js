import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';
//import { AsyncStorage } from '@react-native-community/async-storage';
var firebaseConfig = {
    apiKey: "AIzaSyC2JZ8dNoGSqdMFPqod04iYjjDKhOagEjE",
    authDomain: "chatapp-95c6c.firebaseapp.com",
    databaseURL: "https://chatapp-95c6c-default-rtdb.firebaseio.com",
    projectId: "chatapp-95c6c",
    storageBucket: "chatapp-95c6c.appspot.com",
    messagingSenderId: "586902768804",
    appId: "1:586902768804:web:2f28fa917f8609bbdc2a31",
    measurementId: "G-8L8T95STPV"
};

if (!firebase.apps.length) {    
    firebase.initializeApp(firebaseConfig);
    firebase.auth().languageCode = 'fr';
}

const db = firebase.apps.length ? firebase.database() : {};

export { firebase, db};