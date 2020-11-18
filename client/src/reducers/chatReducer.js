import {
  CREATE_CONVERSATION , 
  FETCH_CONVERSATIONS,
  FETCH_MESSAGES,
  CREATE_MESSAGE,
  LOADING_CHAT,
  STOP_LOADING_CHAT
  } from "../actions/types";

const initialState = {
  conversations: [],
  messages: [],
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {

    case FETCH_CONVERSATIONS:
      return {
          ...state,
          conversations: action.payload
      }

      case FETCH_MESSAGES:
        const message=action.payload;
      return {
          ...state,
          messages: message
      }

      case  CREATE_MESSAGE:
          //add message maybe?
          
          return {
              ...state
          }

      case LOADING_CHAT:
        return {
          ...state,
          loading: true
        }

        case STOP_LOADING_CHAT:
        return {
          ...state,
          loading: false
        }

      case CREATE_CONVERSATION:
          return {
              ...state,
              conversations: [...state.conversations, action.payload]
          }

    default:
      return state;
  }
};
