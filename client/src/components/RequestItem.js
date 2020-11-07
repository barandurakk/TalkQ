import React from "react";

//style
import "../css/components/requestItem.css";

class RequestItem extends React.Component {
  render() {
    const {request} = this.props;
    return (
      <div className="requestItem-container">
                 <img src={request.requesterAvatar} alt="Requester Avatar" className="requester-avatar"/>
                  {request.requesterName}
      </div>
    )
  }
}

export default RequestItem;
