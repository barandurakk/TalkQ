import {FETCH_USER, SET_REQUESTS,REJECT_REQUEST,ACCEPT_REQUEST, FETCH_FRIENDS,DELETE_FRIEND,LOADING_DATA,STOP_LOADING_DATA} from "../actions/types";

const initialState = {
  auth: {},
  friendRequests:{},
  friends: [],
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      }

      case STOP_LOADING_DATA:
      return {
        ...state,
        loading: false
      }

    case FETCH_USER:
      return {
        ...state,
        auth: action.payload
      }

    case SET_REQUESTS:
      return{
        ...state,
        friendRequests: action.payload
      }

    case REJECT_REQUEST:
      const deletedReq = action.payload;
      let newRequestList = state.friendRequests.filter(request => request._id !== deletedReq._id);
      return{
        ...state,
        friendRequests: newRequestList
      }

      case ACCEPT_REQUEST:
        const acceptedReq = action.payload;
        let newRequestList0 = state.friendRequests.filter(request => request._id !== acceptedReq);
        return{
          ...state,
          friendRequests: newRequestList0
        }

      case FETCH_FRIENDS:
       
        return {
          ...state,
          friends: action.payload
        }

      case DELETE_FRIEND:
        console.log("deleteFriendReducer: ", action.payload );
        const deletedFriendId= action.payload;
       
       let newFriendList = state.friends.filter(friend => friend.friends_info._id !== deletedFriendId);
       
       return{
          ...state,
          friends: newFriendList
        }


    default:
      return state;
  }
};
