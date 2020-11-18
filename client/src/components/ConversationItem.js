import React, {Fragment} from "react";
import {connect} from "react-redux";


//styles
import "../css/components/conversationItem.css"

class ConversationItem extends React.Component {

  render() {
      const {conversation, auth} = this.props;
      const convDetails= conversation.recipients.filter(recipient => recipient. _id !==auth._id)
      return (
     <Fragment>
        <div className="conversationItem-container">
            <div className="conversation-avatar-wrapper">
            <img src={convDetails[0].pictureUrl} alt="conversation Avatar" className={`conversation-avatar`}/>
            </div>
            <div className="conversation-info-wrapper">
    <span className="conversation-name">{convDetails[0].name}</span>
      <span className="conversation-id">
          {conversation.lastMessage.length > 36 ? (
              `${conversation.lastMessage.body.substr(0,35)}...`
          ):(
            `${conversation.lastMessage.body}`
          )}
          </span>
            </div>
            <div className="conversation-action-wrapper">
                
            </div>
            
        </div>
        <hr className="conversation-divider"/>
     </Fragment>
    )
  }
}

const mapStateToProps = state => {
    return {
        auth: state.data.auth
    }
}

export default connect(mapStateToProps)(ConversationItem);
