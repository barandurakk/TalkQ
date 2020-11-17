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
    if(nextProps.friends){
      this.setState({friends: nextProps.friends})
    }
  }

  render() {
    return <div className="friendList-container">
            {
              this.state.friends.map(friend => {
                return <div
                        key={friend.friends_info._id}
                        onClick={() => this.props.selectFriend(friend.friends_info)}
                        >
                        <FriendItem 
                        friend={friend.friends_info}/>
                      </div>
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
