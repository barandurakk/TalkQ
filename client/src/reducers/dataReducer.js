import {FETCH_USER, SET_REQUESTS,REJECT_REQUEST} from "../actions/types";
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
      const newRequestList = state.friendRequests.filter(request => request._id !== deletedReq._id);
      return{
        ...state,
        friendRequests: {...newRequestList}
      }

    default:
      return state;
  }
};
