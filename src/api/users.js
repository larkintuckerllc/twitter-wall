export const retrieveUsers = () => JSON.parse(window.localStorage.getItem('users'));

export const storeUsers = (users) => {
  window.localStorage.setItem('users', JSON.stringify(users));
};

export const removeUsers = () => {
  window.localStorage.removeItem('users');
};
