import React, {Fragment, useEffect, useState} from "react";
import ReactEmoji from "react-emoji"

//styles
import "../css/components/conversationItem.css"


const ConversationItem = (props) => {
  
    const [conversation, setConversation] = useState(props.conversation)
    useEffect(() => {

        setConversation(props.conversation);

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
                    
                </div>
                <hr className="conversation-divider"/> 
               
             
          </Fragment>
    )
}

export default ConversationItem;