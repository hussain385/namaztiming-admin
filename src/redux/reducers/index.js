import ThemeReducer from './ThemeReducer';
import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import GuiReducer from './GuiReducer';

const rootReducer = combineReducers({
  ThemeReducer,
  GuiReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

export default rootReducer;
