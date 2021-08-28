import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {
  getFirebase,
  actionTypes as rrfActionTypes,
  firebaseReducer,
} from 'react-redux-firebase';
import {firestoreReducer, constants as rfConstants} from 'redux-firestore';
import ThemeReducer from "./reducers/ThemeReducer";

const reducer = combineReducers({
  ThemeReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['favorites'],
// };

// const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          ...Object.keys(rrfActionTypes).map(
            type => `@@reactReduxFirebase/${type}`,
          ),
          ...Object.keys(rfConstants.actionTypes).map(
            type => `${rfConstants.actionsPrefix}/${type}`,
          ),
        ],
        ignoredPaths: ['firebase', 'firestore'],
      },
      thunk: {extraArgument: {getFirebase}},
    }),
});
