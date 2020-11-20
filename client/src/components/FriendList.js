import React from "react";
import {connect} from "react-redux";
import Loader from "react-loader-spinner"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

//components
import FriendItem from "./FriendItem";

//style
import "../css/components/friendList.css";



class FriendList extends React.Component {

  state={
    friends: this.props.friends,
    loading: false
  }
  
  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.friends){
      this.setState({friends: nextProps.friends})
    }
    if(nextProps.loading){
      this.setState({loading: true});
    }else if(!nextProps.loading){
      this.setState({loading: false});
    }
  }

  render() {
    const {friends, loading} = this.state;
    return <div className="friendList-container">
            {
              !loading ? (
                friends.map(friend => {
                  return <div
                          key={friend.friends_info._id}
                          onClick={() => this.props.selectFriend(friend.friends_info)}
                          >
                          <FriendItem 
                          friend={friend.friends_info}/>
                        </div>
                })
              ):(
                <div className="friends-loading-container">
                  <Loader
                      type="TailSpin"
                      color="#077b70"
                      height={40}
                      width={40}
                      visible={loading} 
                  />           
                </div>
              )
            }
             
    </div>
  }
}

const mapStateToProps = state => {
  return {
    friends: state.data.friends,
    loading: state.data.loading
  }
}

export default connect(mapStateToProps)(FriendList);
