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
  UPDATE_USER_AVATAR,
  SAVE_TO_MESSAGE_CACHE,
  GET_MESSAGE_CACHE,
  UPDATE_MESSAGE_CACHE,
  DELETE_MESSAGE_CACHE,
  SET_UNAUTHENTICATED,
  USER_LOADING,
  STOP_USER_LOADING,
  AUTH_ERROR,
  UNSET_USER,
  SET_AUTHENTICATED,
} from "./types";
import keys from "../config/keys";
import { socket } from "../config/socket";

//FRIENDSHIP ACTIONS

export const fetchFriends = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/api/friends")
    .then((res) => {
      dispatch({ type: STOP_LOADING_DATA });

      dispatch({ type: FETCH_FRIENDS, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateFriends = (id) => (dispatch) => {
  console.log("updateFriends Action", id);
  dispatch({ type: DELETE_FRIEND, payload: id });
  dispatch({ type: DELETE_CONVERSATION, payload: id });
};

export const deleteFriend = (friendId, userId) => (dispatch) => {
  if (!userId) {
    //coming from socket (for not delete twice in database)

    dispatch({ type: DELETE_MESSAGE_CACHE, payload: friendId });
    dispatch({ type: DELETE_FRIEND, payload: friendId });
    dispatch({ type: DELETE_CONVERSATION, payload: friendId });
  } else {
    //coming from item itself

    dispatch({ type: LOADING_UI });
    axios
      .get(`/api/friends/delete/${friendId}`)
      .then((res) => {
        dispatch({ type: DELETE_MESSAGE_CACHE, payload: friendId });
        dispatch({ type: DELETE_FRIEND, payload: friendId });
        dispatch({ type: DELETE_CONVERSATION, payload: friendId });
        dispatch({ type: STOP_LOADING_UI });
        socket.emit("deleteFriend", { friendId, userId });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

//USER ACTIONS

export const fetchUser = () => (dispatch) => {
  dispatch({ type: USER_LOADING });
  axios
    .get("/api/currentUser")
    .then((res) => {
      dispatch({ type: FETCH_USER, payload: res.data });
      dispatch({ type: SET_AUTHENTICATED });
      socket.emit("notification", { username: res.data.name, userId: res.data._id });
      dispatch({ type: STOP_USER_LOADING });
    })
    .catch((err) => {
      dispatch({ type: AUTH_ERROR, payload: err.response.data });
    });
};

export const googleAuth = (data) => (dispatch) => {
  dispatch({ type: USER_LOADING });
  axios
    .post("/api/auth/google", {
      access_token: data,
    })
    .then((res) => {
      setAuthorizationHeader(res.data);
      dispatch(fetchUser());
    })
    .catch((err) => {
      dispatch({ type: STOP_USER_LOADING });
      console.error(err);
    });
};

export const login = (data) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/api/signin", data)
    .then((res) => {
      setAuthorizationHeader(res.data);
      dispatch(fetchUser());
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      if (err.response.status === 401) {
        dispatch({ type: AUTH_ERROR, payload: { general: "Email or password is wrong!" } });
        dispatch({ type: STOP_LOADING_UI });
      } else {
        dispatch({
          type: AUTH_ERROR,
          payload: { general: "There is something wrong :( Please try again." },
        });
        dispatch({ type: STOP_LOADING_UI });
      }
    });
};

//AUTH ACTIONS
export const register = (formData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/api/signup", formData)
    .then((res) => {
      dispatch({ type: STOP_LOADING_UI });
      res.status === 200 && window.location.replace(`${keys.client_url}/login`);
    })
    .catch((err) => {
      console.log(err.response);
      if (err.response.status === 403) {
        dispatch({ type: AUTH_ERROR, payload: { general: "This email is already taken" } });
        dispatch({ type: STOP_LOADING_UI });
      } else {
        dispatch({
          type: AUTH_ERROR,
          payload: { general: "There is something wrong :( Please try again." },
        });
        dispatch({ type: STOP_LOADING_UI });
      }
    });
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("JwtToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
  dispatch({ type: UNSET_USER });
};

//FRIENDSHIP REQUEST ACTIONS

export const sendFriendRequest = (requestForm, friendId) => (dispatch) => {
  dispatch({ type: LOADING_UI });

  axios
    .post("/api/addFriend", requestForm)
    .then((res) => {
      dispatch({ type: STOP_LOADING_UI });
      dispatch({ type: CLEAR_ERRORS });
      socket.emit("newFriendRequest", friendId);
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const getFriendRequests = () => (dispatch) => {
  axios
    .get("/api/getFriendRequest")
    .then((res) => {
      dispatch({ type: SET_REQUESTS, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const rejectFriendRequest = (id, request, username) => (dispatch) => {
  axios
    .get(`/api/rejectFriend/${id}`)
    .then((res) => {
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: REJECT_REQUEST, payload: res.data });
      socket.emit("rejectRequest", { friendId: request.requester, username: username });
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const acceptFriendRequest = (id, request, username) => (dispatch) => {
  axios
    .get(`/api/acceptFriend/${id}`)
    .then((res) => {
      dispatch(fetchFriends());
      dispatch({ type: ACCEPT_REQUEST, payload: res.data });
      socket.emit("acceptRequest", { friendId: request.requester, username: username });
    })
    .catch((err) => {
      console.log(err);
    });
};

//CHAT ACTIONS

export const fetchConversations = () => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get("/api/conversations/all")
    .then((res) => {
      dispatch({ type: FETCH_CONVERSATIONS, payload: res.data });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchMessages = (friendId) => (dispatch) => {
  dispatch({ type: LOADING_CHAT });
  axios
    .post("/api/messages/get", { friendId })
    .then((res) => {
      dispatch({ type: STOP_LOADING_CHAT });
      dispatch({ type: FETCH_MESSAGES, payload: res.data });
      dispatch({ type: SAVE_TO_MESSAGE_CACHE, payload: { messages: res.data, friendId } });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: STOP_LOADING_CHAT });
    });
};

export const getCachedMessages = (friendId) => (dispatch) => {
  dispatch({ type: GET_MESSAGE_CACHE, payload: friendId });
};

export const updateCachedMessages = (friendId, message) => (dispatch) => {
  dispatch({ type: UPDATE_MESSAGE_CACHE, payload: { friendId, message } });
};

export const createMessage = (message) => (dispatch) => {
  socket.emit("sendMessage", message); //send it real-time to friend
  dispatch(updateCachedMessages(message.to, message));
  //if message send by us then we have to change from to to, when reducer create conversation, it uses fromId
  dispatch(updateConversations({ ...message, from: message.to })); //reload conversations in reducer
  axios
    .post("/api/message/new", message)
    .then((res) => {
      dispatch({ type: CREATE_MESSAGE, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteConversation = (friendId, userId) => (dispatch) => {
  if (!userId) {
    //coming from socket (for not delete twice in database)

    dispatch({ type: DELETE_CONVERSATION, payload: friendId });
    dispatch({ type: DELETE_MESSAGE_CACHE, payload: friendId });
  } else {
    //coming from item itself
    dispatch({ type: LOADING_UI });
    axios
      .post("/api/conversation/delete", { friendId })
      .then((res) => {
        dispatch({ type: DELETE_MESSAGE_CACHE, payload: friendId });
        dispatch({ type: DELETE_CONVERSATION, payload: friendId });
        dispatch({ type: STOP_LOADING_UI });
        socket.emit("deleteConversation", { friendId, userId });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

export const updateConversations = (message) => (dispatch) => {
  dispatch({ type: UPDATE_CONVERSATIONS, payload: message });
};

//userAvatar
export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_DATA });

  axios
    .post("/api/avatar/upload", formData)
    .then((res) => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: UPDATE_USER_AVATAR, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

const setAuthorizationHeader = (token) => {
  const JwtToken = `Bearer ${token}`;
  //save token to the local store
  localStorage.setItem("JwtToken", JwtToken);
  axios.defaults.headers.common["Authorization"] = JwtToken;
};
