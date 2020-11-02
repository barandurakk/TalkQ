import {FETCH_USER, SEND_REQUEST} from "../actions/types";
const initialState = {
  auth: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
        auth: action.payload
      }

    default:
      return state;
  }
};
