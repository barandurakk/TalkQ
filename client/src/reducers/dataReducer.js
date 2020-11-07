import {FETCH_USER, SET_REQUESTS} from "../actions/types";
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

    default:
      return state;
  }
};
