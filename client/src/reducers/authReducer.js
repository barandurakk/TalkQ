import {
  AUTH_ERROR,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  STOP_USER_LOADING,
  USER_LOADING,
} from "../actions/types";

const initialState = {
  isAuthenticated: false,
  errorMessage: "",
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true,
        errorMessage: "",
      };

    case SET_UNAUTHENTICATED:
      return {
        ...state,
        isAuthenticated: false,
      };

    case USER_LOADING:
      return {
        ...state,
        loading: true,
      };

    case STOP_USER_LOADING:
      return {
        ...state,
        loading: false,
      };

    case AUTH_ERROR:
      return {
        ...state,
        errorMessage: { ...action.payload },
      };

    default:
      return state;
  }
};
