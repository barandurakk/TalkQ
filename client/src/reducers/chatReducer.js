import {
  CREATE_CONVERSATION , 
  FETCH_CONVERSATIONS,
  FETCH_MESSAGES,
  CREATE_MESSAGE,
  LOADING_CHAT,
  STOP_LOADING_CHAT,
  UPDATE_CONVERSATIONS
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

    case UPDATE_CONVERSATIONS:
      
        const from = action.payload.from;
        const to = action.payload.to;
        const body = action.payload.body;
        let indexOfComing;
        let selectedConversation;
        let conversations = state.conversations;
        let updatedConvList;
        
            //find the conversation index has a new message
            // eslint-disable-next-line
          conversations.map((conversation, x) => {
          
          if(conversation.recipients_info._id === from || conversation.recipients_info._id === to){
            selectedConversation = conversation;
            indexOfComing = x;
          }
      })
      
      //create a conversation list without selected conversation
      conversations.splice(indexOfComing, 1);
    
      //update last message 
      selectedConversation.lastMessage.body = body;
     
      //create a new list 
      updatedConvList = [selectedConversation, ...conversations]
        
   
      return{
        ...state,
        conversations: updatedConvList
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
