import React, {Fragment} from "react";
import {connect} from "react-redux";


//styles
// import "../css/components/friendItem.css"

class ConversationItem extends React.Component {

  render() {
      const {conversation} = this.props;
    return (
     <Fragment>
        <div className="conversationItem-container">
            <div className="conversation-avatar-wrapper">
            <img src="" alt="conversation Avatar" className={`conversation-avatar`}/>
            </div>
            <div className="conversation-info-wrapper">
                <span className="conversation-name"></span>
                <span className="conversation-id"></span>
            </div>
            <div className="conversation-action-wrapper">
                
            </div>
            
        </div>
        <hr className="conversation-divider"/>
     </Fragment>
    )
  }
}

export default connect(null)(ConversationItem);
