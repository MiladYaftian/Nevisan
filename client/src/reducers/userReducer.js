import {
  LOGIN,
  SIGNUP,
  LOGOUT,
  SET_USER,
  SET_AVATAR,
  REMOVE_AVATAR,
} from "../actionTypes";
import authService from "../services/auth";
import userService from "../services/user";
import storage from "../utils/localStorage";
import storageService from "../utils/localStorage";

const userReducer = (state = null, action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case SIGNUP:
      return action.payload;
    case LOGOUT:
      return null;
    case SET_USER:
      return action.payload;
    case SET_AVATAR:
      return { ...state, ...action.payload };
    case REMOVE_AVATAR:
      return { ...state, avatar: { exists: false } };
    default:
      return state;
  }
};

export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const token = await authService.login(credentials);
      console.log("Login token:", token);
      storage.saveToken(token);

      dispatch({
        type: LOGIN,
        payload: token,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
};

export const signupUser = (credentials) => {
  return async (dispatch) => {
    const user = await authService.signup(credentials);
    storageService.saveToken(user.token);
    dispatch({
      type: SIGNUP,
      payload: user,
    });
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    storageService.logoutUser();
    authService.setToken(null);

    dispatch({
      type: LOGOUT,
    });
  };
};

export const setUser = () => {
  return (dispatch) => {
    const loggedUser = storageService.loadUser();

    if (loggedUser) {
      authService.setToken(loggedUser.token);

      dispatch({
        type: SET_USER,
        payload: loggedUser,
      });
    }
  };
};

export const setAvatar = (avatarImage) => {
  return async (dispatch) => {
    const uploadedAvatar = await userService.uploadAvatar({ avatarImage });
    const prevUserData = storageService.loadUser();
    storageService.saveUser({ ...prevUserData, ...uploadedAvatar });

    dispatch({
      type: SET_AVATAR,
      payload: uploadedAvatar,
    });
  };
};

export const deleteAvatar = () => {
  return async (dispatch) => {
    await userService.removeAvatar();
    const prevUserData = storageService.loadUser();
    storageService.saveUser({ ...prevUserData, avatar: { exists: false } });

    dispatch({
      type: REMOVE_AVATAR,
    });
  };
};

export default userReducer;
