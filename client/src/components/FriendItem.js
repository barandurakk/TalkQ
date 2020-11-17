import React, {Fragment} from "react";
import {connect} from "react-redux";

//actions
import {deleteFriend} from "../actions/index";

//icons
import DeleteIcon from "../svg/deleteIcon.svg"

//styles
import "../css/components/friendItem.css"

class FriendItem extends React.Component {

    state= {
        showDeletePopup: false
    }

    handleDeleteButton = (id) => {
        this.props.deleteFriend(id);
    }

    handleCancelDeleteButton = () => {
        this.setState({showDeletePopup: false});
    }

    renderDeletePopup = (name, id) => {
        return(
        <div className="deleteFriend-container">
            <span className="deleteFriend-title">{name} will no longer be your friend ?</span>
            <div className="deleteFriend-actions">
                <button
                className="cancelDelete-button"
                onClick={()=> this.handleCancelDeleteButton()}
                >Cancel</button>
                <button
                className="confirmDelete-button"
                onClick={()=> this.handleDeleteButton(id)}
                >Delete</button>
            </div>
        </div>
        )
    }

  render() {
      const {friend} = this.props;
    return (
     <Fragment>
        <div className="friendItem-container">
            <div className="friend-avatar-wrapper">
            <img src={friend.pictureUrl} alt="friend Avatar" className={`friend-avatar`}/>
            </div>
            <div className="friend-info-wrapper">
                <span className="friend-name">{friend.name}</span>
                <span className="friend-id">{friend._id}</span>
            </div>
            <div className="friend-action-wrapper">
                <span
                className="delete-button"
                onClick={()=> this.setState({showDeletePopup: true})}
                ><img src={DeleteIcon} alt="SettingsIcon" className="delete-icon"/></span>
            </div>
            
        </div>
        <hr className="friend-divider"/>
        {this.state.showDeletePopup ? this.renderDeletePopup(friend.name,friend._id ) : (null)}
     </Fragment>
    )
  }
}

export default connect(null, {deleteFriend})(FriendItem);
