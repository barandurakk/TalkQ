import React, { Fragment } from "react";

//style
import "../css/components/requestItem.css";

//icons
import AcceptIcon from "../svg/successIcon.svg"
import RejectIcon from "../svg/errorIcon.svg"


class RequestItem extends React.Component {

  handleAcceptButton = (id) => {
    console.log(id);
  }

  handleRejectButton = (id) => {
    console.log(id);
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

export default RequestItem;
