import axios from "axios";
import {
  FETCH_USER,
  LOADING_UI,
  SET_ERRORS,
  STOP_LOADING_UI,
  CLEAR_ERRORS,
  SET_REQUESTS,
  REJECT_REQUEST,
  ACCEPT_REQUEST
} from "./types";

//USER ACTIONS

export const fetchUser = () => async (dispatch) => {
  const res = await axios.get("/api/currentUser");

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const logoutUser = () => async (dispatch) => {
  await axios.get("/api/logout");
}

//FRIENDSHIP REQUEST ACTIONS

export const sendFriendRequest = (requestForm, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });

  axios.post("/api/addFriend", requestForm).then(res => {
    dispatch({ type: STOP_LOADING_UI });
    dispatch({ type: CLEAR_ERRORS});

  }).catch(err => {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  });

}

export const getFriendRequests = () => dispatch => {

  axios.get("/api/getFriendRequest").then(res=> {
    
    
    dispatch({type: SET_REQUESTS, payload: res.data})
  }).catch(err => {
    console.log(err);
  });
}

export const rejectFriendRequest = (id) => dispatch => {

  axios.get(`/api/rejectFriend/${id}`).then(res => {

    dispatch({ type: CLEAR_ERRORS});
    dispatch({type: REJECT_REQUEST, payload: res.data});
  }).catch(err => {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  });
}

export const acceptFriendRequest = id => dispatch => {

  axios.get(`/api/acceptFriend/${id}`).then(res => {
    
    dispatch({type: ACCEPT_REQUEST, payload: res.data})
  }).catch(err => {
    console.log(err);
  });
}