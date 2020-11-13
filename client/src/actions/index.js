import axios from "axios";
import {
  FETCH_USER,
  LOADING_UI,
  SET_ERRORS,
  STOP_LOADING_UI,
  CLEAR_ERRORS,
  SET_REQUESTS,
  REJECT_REQUEST,
  ACCEPT_REQUEST,
  FETCH_FRIENDS,
  DELETE_FRIEND
} from "./types";

import {socket} from "../config/socket";

//FRIENDSHIP ACTIONS

export const fetchFriends = () =>  dispatch => {

  dispatch({ type: LOADING_UI });
axios.get("/api/friends").then(res => {
  dispatch({ type: STOP_LOADING_UI });
  dispatch({type: FETCH_FRIENDS, payload: res.data});
  
}).catch(err => {
  console.log(err);
});

}

export const deleteFriend = (id) => dispatch => {
  axios.get(`/api/friends/delete/${id}`).then(res => {
    dispatch({type: DELETE_FRIEND, payload: id});
  }).catch(err => {
    console.log(err);
  });
}

//USER ACTIONS

export const fetchUser = () => async (dispatch) => {
  const res = await axios.get("/api/currentUser");

  socket.emit("notification", {username: res.data.name, userId: res.data._id});

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const logoutUser = () => async (dispatch) => {
  await axios.get("/api/logout");
}

//FRIENDSHIP REQUEST ACTIONS

export const sendFriendRequest = (requestForm, friendId) => (dispatch) => {
  dispatch({ type: LOADING_UI });

  axios.post("/api/addFriend", requestForm).then(res => {
    dispatch({ type: STOP_LOADING_UI });
    dispatch({ type: CLEAR_ERRORS});
    socket.emit("newFriendRequest",(friendId));

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

export const acceptFriendRequest = (id,request,username) => dispatch => {

  axios.get(`/api/acceptFriend/${id}`).then(res => {
    dispatch(fetchFriends());
    dispatch({type: ACCEPT_REQUEST, payload: res.data})
    socket.emit("acceptRequest", {friendId: request.requester, username: username});
  }).catch(err => {
    console.log(err);
  });
}