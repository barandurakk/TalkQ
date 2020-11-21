import React, {Fragment, useEffect, useState} from "react";
import { useDispatch } from 'react-redux';
import ReactEmoji from "react-emoji"

//styles
import "../css/components/conversationItem.css"

//icons
import DeleteIcon from "../svg/deleteIcon.svg"

//actions
import {deleteConversation} from "../actions/index";

const handleDeleteButton = (id, setShowDeletePopup, userId, dispatch) => {
    
    dispatch(deleteConversation(id, userId));
    setShowDeletePopup(false);
}

const handleCancelDeleteButton = (setShowDeletePopup) => {
    setShowDeletePopup(false);
}

const renderDeletePopup = (name, id, setShowDeletePopup, userId, dispatch) => {
    return(
    <div className="deleteFriend-container">
        <span className="deleteFriend-title">All messages with {name} will be deleted. <br/> Are you sure?</span>
        <div className="deleteFriend-actions">
            <button
            className="cancelDelete-button"
            onClick={()=> handleCancelDeleteButton(setShowDeletePopup)}
            >Cancel</button>
            <button
            className="confirmDelete-button"
            onClick={()=> handleDeleteButton(id, setShowDeletePopup, userId, dispatch)}
            >Delete</button>
        </div>
    </div>
    )
}

const ConversationItem = (props) => {
    console.log("render");
    const [conversation, setConversation] = useState(props.conversation)
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isNew , setIsNew] = useState(conversation.isNew);
    const dispatch = useDispatch();
    useEffect(() => {

        setConversation(props.conversation);
        setIsNew(false);

    },[props.conversation])



    return (
        
        <Fragment>

             <div className="conversationItem-container">
                 <div className="conversation-avatar-wrapper">
                 <img src={conversation.recipients_info.pictureUrl} alt="conversation Avatar" className={`conversation-avatar`}/>
                 </div>
                 <div className="conversation-info-wrapper">
         <span className="conversation-name">{conversation.recipients_info.name}</span>
           <span className="conversation-id">
               {conversation.lastMessage.length > 36 ? (
                ReactEmoji.emojify(`${conversation.lastMessage.body.substr(0,35)}...`, {emojiType:"emojione"})
               ):(
                    ReactEmoji.emojify(`${conversation.lastMessage.body}`, {emojiType:"emojione"})
               )}
               </span>
                 </div>
                 <div className="conversation-newMessage-container">
                    {isNew ? 
                    (
                        <span>NEW</span>
                    ):
                    (
                        null
                    )}
                 </div>
                 <div className="conversation-action-wrapper">
                    <span
                    className="delete-button"
                    onClick={()=> setShowDeletePopup(true)}
                    ><img src={DeleteIcon} alt="SettingsIcon" className="delete-icon"/></span>  
                 </div>
                    
             </div>
             <hr className="conversation-divider"/>
             {showDeletePopup ? renderDeletePopup(conversation.recipients_info.name,conversation.recipients_info._id, setShowDeletePopup, props.auth, dispatch ) : (null)}
          </Fragment>
    )
}

export default ConversationItem;