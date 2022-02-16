const setMode = (mode) => ({
  type: 'SET_MODE',
  payload: mode,
});

const setColor = (color) => ({
  type: 'SET_COLOR',
  payload: color,
});

const getTheme = () => ({
  type: 'GET_THEME',
});

const exportDefault = {
  setColor,
  setMode,
  getTheme,
};

export default exportDefault;
