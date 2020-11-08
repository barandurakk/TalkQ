import {FETCH_USER, SET_REQUESTS,REJECT_REQUEST,ACCEPT_REQUEST} from "../actions/types";
import _ from "lodash";

const initialState = {
  auth: {},
  friendRequests:{}
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

    default:
      return state;
  }
};
