import { SELECT_CONVERSATION, FETCH_CONVERSATIONS,FETCH_MESSAGES,CREATE_MESSAGE } from "../actions/types";

const initialState = {
  selectedConversation: {},
  conversations: [],
  messages: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_CONVERSATION:
      return {
        ...state,
        selectedConversation: action.payload
      };

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

    default:
      return state;
  }
};
