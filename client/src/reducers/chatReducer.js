import {
  CREATE_CONVERSATION , 
  FETCH_CONVERSATIONS,
  FETCH_MESSAGES,
  CREATE_MESSAGE,
  LOADING_CHAT,
  STOP_LOADING_CHAT,
  UPDATE_CONVERSATIONS,
  DELETE_CONVERSATION,
  SAVE_TO_MESSAGE_CACHE,
  GET_MESSAGE_CACHE,
  UPDATE_MESSAGE_CACHE
  } from "../actions/types";

const initialState = {
  conversations: [],
  messages: [],
  messageCache: [],
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
        const friendName= action.payload.friendName;
        const friendAvatar= action.payload.friendAvatar;
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
            return true;
          }
          return false;
      })

      //check if there is already a conversation if not create in reducer (for less database connection)
      if(!selectedConversation){

        updatedConvList= [
                {
                  createdAt: new Date().toISOString,
                  recipients_info: {_id: from, pictureUrl: friendAvatar, name: friendName},
                  lastMessage: {dateSent: new Date().toISOString, body: body},
                } 
                ,...conversations]

      }else{

        //create a conversation list without selected conversation
      conversations.splice(indexOfComing, 1);
    
      //update last message 
      if( body.length > 36 ){
        selectedConversation.lastMessage.body = `${body.substr(0,35)}...`;
      }else{
        selectedConversation.lastMessage.body = body;
      }
     
     
      //create a new list 
      updatedConvList = [selectedConversation, ...conversations]

      }
   
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

      case SAVE_TO_MESSAGE_CACHE:

        return {
          ...state,
          messageCache: [...state.messageCache, 
                          {friendId: action.payload.friendId, messages: action.payload.messages} ]
        }

      case UPDATE_MESSAGE_CACHE:
        const cacheList = state.messageCache;

        cacheList.map(obj => {
          if(obj.friendId === action.payload.friendId){
            obj.messages.push(action.payload.message)
            return true;
          }
          return false;
        })

      return{
        ...state,
        messageCache: cacheList
      }

      case GET_MESSAGE_CACHE:
        const friendId = action.payload;
        let askedMessages = state.messageCache.filter(cacheItem => cacheItem.friendId === friendId);
        return{
          ...state,
          messages: askedMessages[0].messages
        }

      case CREATE_MESSAGE:
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

      case DELETE_CONVERSATION:
          let conversationList = state.conversations;
          let indexOfDeleted;

          conversationList.map((conversation, x) => {
          
          if(conversation.recipients_info._id === action.payload){
            indexOfDeleted = x;
           return true;
          }
          return false;
        })

        //create a conversation list without selected conversation
        conversationList.splice(indexOfDeleted, 1);
        

          return {
              ...state,
              conversations: conversationList
          }

    default:
      return state;
  }
};
