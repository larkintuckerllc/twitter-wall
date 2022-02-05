export const retrieveBackground = () => window.localStorage.getItem('background');

export const storeBackground = (background) => {
  window.localStorage.setItem('background', background);
};

export const removeBackground = () => {
  window.localStorage.removeItem('background');
};
