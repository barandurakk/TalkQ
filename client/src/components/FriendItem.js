import React, {Fragment} from "react";
import {connect} from "react-redux";

//actions
import {deleteFriend} from "../actions/index";

//icons
import DeleteIcon from "../svg/deleteIcon.svg"

//styles
import "../css/components/friendItem.css"

class FriendItem extends React.Component {

    handleDeleteButton = (id) => {
        this.props.deleteFriend(id);
    }

  render() {
      const {friend} = this.props;
    return (
     <Fragment>
        <div className="friendItem-container">
            <div className="friend-avatar-wrapper">
            <img src={friend.pictureUrl} alt="friend Avatar" className="friend-avatar"/>
            </div>
            <div className="friend-info-wrapper">
                <span className="friend-name">{friend.name}</span>
                <span className="friend-id">{friend._id}</span>
            </div>
            <div className="friend-action-wrapper">
                <span
                className="delete-button"
                onClick={()=> this.handleDeleteButton(friend._id)}
                ><img src={DeleteIcon} alt="SettingsIcon" className="delete-icon"/></span>
            </div>
            
        </div>
        <hr className="friend-divider"/>
     </Fragment>
    )
  }
}

export default connect(null, {deleteFriend})(FriendItem);
