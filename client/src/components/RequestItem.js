import React, { Fragment } from "react";
import {connect} from "react-redux";
import {socket} from "../config/socket";

//actions
import {rejectFriendRequest, acceptFriendRequest, fetchFriends} from "../actions/index";

//style
import "../css/components/requestItem.css";

//icons
import AcceptIcon from "../svg/successIcon.svg"
import RejectIcon from "../svg/errorIcon.svg"


class RequestItem extends React.Component {

  handleAcceptButton = (id) => {
    const {request,username} = this.props;
    this.props.acceptFriendRequest(id, request, username);
    
  }

  handleRejectButton = (id) => {
    this.props.rejectFriendRequest(id);
  }

  render() {
    const {request} = this.props;
    return (
      <Fragment>
      <div className="requestItem-container">
        <div className="requester-avatar-wrapper">
        <img src={request.requesterAvatar} alt="Requester Avatar" className="requester-avatar"/>
        </div>
        <div className="requester-info-wrapper">
         <span className="requester-name">{request.requesterName}</span>
         <span className="requester-id">{request.requester}</span>
        </div>
        <div className="requester-action-wrapper">
          <span
            className="accept-button"
            onClick={()=> this.handleAcceptButton(request._id)}
          ><img src={AcceptIcon} alt="AcceptIcon" className="accept-icon"/></span>
          <span
            className="reject-button"
            onClick={()=> this.handleRejectButton(request._id)}
          ><img src={RejectIcon} alt="RejectIcon" className="reject-icon"/></span>
        </div>
      </div>
      <hr className="request-divider"/>
      </Fragment>
    )
  }
}

export default connect(null, {rejectFriendRequest, acceptFriendRequest,fetchFriends})(RequestItem);
