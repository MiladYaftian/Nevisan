import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import {thunk} from "redux-thunk";
import notificationReducer from "./reducers/notificationReducer";
import userReducer from "./reducers/userReducer";
import postReducer from "./reducers/postReducer";
import groupReducer from "./reducers/groupReducer";
import postCommentsReducer from "./reducers/postCommentsReducer";
import userPageReducer from "./reducers/userPageReducer";
import groupPageReducer from "./reducers/groupPageReducer";
import searchReducer from "./reducers/searchReducer";
import themeReducer from "./reducers/themeReducer";

const reducer = combineReducers({
  user: userReducer,
  notification: notificationReducer,
  posts: postReducer,
  postComments: postCommentsReducer,
  groups: groupReducer,
  userPage: userPageReducer,
  groupPage: groupPageReducer,
  search: searchReducer,
  darkMode: themeReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
