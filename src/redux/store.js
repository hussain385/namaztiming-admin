import { configureStore } from '@reduxjs/toolkit';
import {
  actionTypes as rrfActionTypes,
  getFirebase,
} from 'react-redux-firebase';
import { constants as rfConstants } from 'redux-firestore';
import rootReducer from './reducers';

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['favorites'],
// };

// const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: rootReducer,
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
        ignoredActionPaths: [
          'payload.data.masjid.timeStamp',
          'payload.data.masjid.g',
        ],
        ignoredPaths: [
          'firebase',
          'firestore',
          'GuiReducer.extras.masjid.timeStamp',
          'GuiReducer.extras.masjid.g',
        ],
      },
      thunk: { extraArgument: { getFirebase } },
    }),
});
