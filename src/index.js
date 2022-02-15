import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
// import { initializeApp } from "firebase/app"
import firebase from 'firebase/compat';
import 'firebase/firestore';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { createFirestoreInstance } from 'redux-firestore';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/boxicons-2.0.7/css/boxicons.min.css';
import './assets/css/grid.css';
import './assets/css/theme.css';
import './assets/css/index.css';

import Routers from './components/Routers';

import { FirebaseAppProvider } from 'reactfire';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: 'G-8352Z31MRV',
};

firebase.initializeApp(firebaseConfig);

// import {initializeApp} from "firebase/firebase-app";

document.title = 'Admin Panel';

// Initialize Firebase

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
};
const rrfProps = {
  firebase: firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
};

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routers />
        </ThemeProvider>
      </FirebaseAppProvider>
    </ReactReduxFirebaseProvider>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
