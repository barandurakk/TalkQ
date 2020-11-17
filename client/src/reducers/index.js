import { combineReducers } from "redux";
import chatReducer from "./chatReducer";
import dataReducer from "./dataReducer";
import uiReducer from "./uiReducer";

export default combineReducers({
  data: dataReducer,
  ui: uiReducer,
  chat: chatReducer
});
