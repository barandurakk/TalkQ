import React from "react";
import {connect} from "react-redux";

//components
import FriendItem from "./FriendItem";

//style
import "../css/components/friendList.css";

class FriendList extends React.Component {

  state={
    friends: this.props.friends
  }
  
  UNSAFE_componentWillReceiveProps(nextProps){
    console.log(nextProps);
    if(nextProps.friends){
      this.setState({friends: nextProps.friends})
    }
  }

  render() {
    return <div className="friendList-container">
            {
              this.state.friends.map(friend => {
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
