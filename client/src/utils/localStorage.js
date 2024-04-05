const storageKeyToken = "readifyUserKey";
const storageKeyDarkMode = "readifyDarkMode";

const storage = {
  saveToken: (token) => localStorage.setItem(storageKeyToken, token),
  loadToken: () => {
    const tokenString = localStorage.getItem(storageKeyToken);
    return tokenString ? JSON.parse(tokenString) : null;
  },
  removeToken: () => localStorage.removeItem(storageKeyToken),
};

const saveDarkMode = (boolean) =>
  localStorage.setItem(storageKeyDarkMode, boolean);

const loadDarkMode = () => localStorage.getItem(storageKeyDarkMode);

export default storage;
