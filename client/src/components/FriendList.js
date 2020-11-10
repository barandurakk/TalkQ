import React from "react";
import {connect} from "react-redux";

//components
import FriendItem from "./FriendItem";

//style
import "../css/components/friendList.css";

class FriendList extends React.Component {

  

  render() {
    return <div className="friendList-container">
            {
              this.props.friends.map(friend => {
                return <FriendItem friend={friend.friends_info} key={friend.friends_info._id} />
              })
            }
    </div>
  }
}

const mapStateToProps = state => {
  return {
    friends: state.data.friends
  }
}

export default connect(mapStateToProps)(FriendList);
