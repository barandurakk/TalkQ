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
  DELETE_FRIEND,
  FETCH_CONVERSATIONS,
  FETCH_MESSAGES,
  CREATE_MESSAGE,
  LOADING_CHAT,
  STOP_LOADING_CHAT,
  LOADING_DATA,
  STOP_LOADING_DATA,
  UPDATE_CONVERSATIONS,
  DELETE_CONVERSATION,
  UPDATE_USER_AVATAR
} from "./types";

import {socket} from "../config/socket";

//FRIENDSHIP ACTIONS

export const fetchFriends = () =>  dispatch => {

  dispatch({ type: LOADING_DATA });
axios.get("/api/friends").then(res => {
  dispatch({ type: STOP_LOADING_DATA });
  dispatch({type: FETCH_FRIENDS, payload: res.data});
  
}).catch(err => {
  console.log(err);
});

}

export const updateFriends = (id) => dispatch => {
  console.log("updateFriends Action", id);
  dispatch({type: DELETE_FRIEND, payload: id});
  dispatch({type: DELETE_CONVERSATION, payload: id});
}

export const deleteFriend = (friendId, userId) => dispatch => {
  axios.get(`/api/friends/delete/${friendId}`).then(res => {
    dispatch({type: DELETE_FRIEND, payload: friendId});
    dispatch({type: DELETE_CONVERSATION, payload: friendId});
    socket.emit("deleteFriend", ({friendId, userId}));
  }).catch(err => {
    console.log(err);
  });
}

//USER ACTIONS

export const fetchUser = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });

  axios.get("/api/currentUser").then(res => {
    dispatch({ type: STOP_LOADING_DATA });
    dispatch({ type: FETCH_USER, payload: res.data });
    socket.emit("notification", {username: res.data.name, userId: res.data._id});
  }).catch(err => {
    dispatch({ type: SET_ERRORS, payload: err.response.data });
  });
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

export const rejectFriendRequest = (id,request,username) => dispatch => {

  axios.get(`/api/rejectFriend/${id}`).then(res => {

    dispatch({ type: CLEAR_ERRORS});
    dispatch({type: REJECT_REQUEST, payload: res.data});
    socket.emit("rejectRequest", {friendId: request.requester, username: username});
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

//CHAT ACTIONS

export const fetchConversations = () => dispatch => {
  dispatch({ type: LOADING_UI });
  axios.get("/api/conversations/all").then(res => {
    dispatch({type: FETCH_CONVERSATIONS, payload:res.data});
    dispatch({ type: STOP_LOADING_UI });
  }).catch(err => {
    console.log(err);
  });
}

export const fetchMessages = (friendId) => dispatch => {
  dispatch({ type: LOADING_CHAT });
  axios.post("/api/messages/get", {friendId}).then(res => {
    dispatch({ type: STOP_LOADING_CHAT });
    dispatch({type: FETCH_MESSAGES, payload: res.data});
  }).catch(err => {
    console.log(err);
    dispatch({ type: STOP_LOADING_UI });
  });

}

export const createMessage = (message) => dispatch => {
  socket.emit("sendMessage", message);//send it real-time to friend

  //if message send by us then we have to change from to to, when reducer create conversation, it uses fromId
  dispatch(updateConversations({...message, from: message.to})); //reload conversations in reducer

  axios.post("/api/message/new", message).then(res => {
    dispatch({ type: CREATE_MESSAGE, payload: res.data });    
  }).catch(err=> {
    console.log(err);
  })
}


export const deleteConversation = (friendId,userId) => dispatch => {

  if(!userId){ //coming from socket

    dispatch({ type: DELETE_CONVERSATION, payload: friendId });

  }else{ //coming from item itself
    dispatch({ type: LOADING_UI });
  axios.post("/api/conversation/delete", {friendId}).then(res => {
    dispatch({ type: DELETE_CONVERSATION, payload: friendId });
    dispatch({ type: STOP_LOADING_UI });
    socket.emit("deleteConversation", {friendId, userId});
    //dispatch(fetchConversations());
  }).catch(err=> {
    console.log(err);
  })
  }
}

export const updateConversations = (message) => dispatch => {

  dispatch({ type: UPDATE_CONVERSATIONS, payload: message });

}

//userAvatar
export const uploadImage = (formData) => dispatch => {

  dispatch({ type: LOADING_DATA });

  axios.post("/api/avatar/upload", formData).then(res=>{
    dispatch({ type: STOP_LOADING_DATA });
    dispatch({type: UPDATE_USER_AVATAR, payload:res.data})
  }).catch(err=> {
    console.log(err);
  })


}