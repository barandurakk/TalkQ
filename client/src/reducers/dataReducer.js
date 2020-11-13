import {FETCH_USER, SET_REQUESTS,REJECT_REQUEST,ACCEPT_REQUEST, FETCH_FRIENDS,DELETE_FRIEND} from "../actions/types";
import _ from "lodash";

const initialState = {
  auth: {},
  friendRequests:{},
  friends: []
};

export default (state = initialState, action) => {
  switch (action.type) {
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
        friendRequests: {...newRequestList}
      }

      case ACCEPT_REQUEST:
        const acceptedReq = action.payload;
        let newRequestList0 = state.friendRequests.filter(request => request._id !== acceptedReq);
        return{
          ...state,
          friendRequests: {...newRequestList0}
        }

      case FETCH_FRIENDS:
        console.log("fetch friend reducer: ", action.payload);
        return {
          ...state,
          friends: action.payload
        }

      case DELETE_FRIEND:
        const deletedFriendId= action.payload;
        return{
          ...state
        }


    default:
      return state;
  }
};
