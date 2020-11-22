import React, {Fragment} from "react";

//styles
import "../css/components/friendItem.css"

class FriendItem extends React.Component {


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
            
        </div>
        <hr className="friend-divider"/>
        
     </Fragment>
    )
  }
}




export default (FriendItem);
