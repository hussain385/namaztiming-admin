import { createSlice } from '@reduxjs/toolkit';
import { isNil } from 'lodash';

const guiSlicer = createSlice({
  name: 'gui',
  initialState: {
    toggle: false,
    extras: {},
  },
  reducers: {
    resetToggle: state => {
      return (state.toggle = false);
    },
    setToggle: (state, action) => {
      if (!isNil(action.payload)) {
        state.toggle = action.payload;
      }
      // return state;
    },
    Toggle: state => {
      return !state.toggle;
    },
    setToggleWithData: (state, action) => {
      if (!isNil(action.payload)) {
        state.toggle = action.payload.toggle;
        state.extras = action.payload.data;
      }
      // return state;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = guiSlicer;
// Extract and export each action creator by name
export const { resetToggle, setToggle, Toggle, setToggleWithData } = actions;
export const useGuiReducer = state => state.GuiReducer;
// Export the reducer, either as a default or named export
export default guiSlicer.reducer;
