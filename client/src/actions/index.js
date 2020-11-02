import axios from "axios";
import {
  FETCH_USER,
  LOADING_UI,
  SET_ERRORS,
  STOP_LOADING_UI
} from "./types";

export const fetchUser = () => async (dispatch) => {
  const res = await axios.get("/api/currentUser");

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const logoutUser = () => async (dispatch) => {
  await axios.get("/api/logout");
}

export const sendFriendRequest = (requestForm) => (dispatch) => {
  dispatch({ type: LOADING_UI });

  axios.post("/api/addFriend", requestForm).then(res => {

    dispatch({ type: STOP_LOADING_UI });

  }).catch(err => {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  });

}