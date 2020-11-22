import React from "react";
import {connect} from "react-redux";
import Loader from "react-loader-spinner"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

//components
import FriendItem from "./FriendItem";

import {deleteFriend} from "../actions/index";

//style
import "../css/components/friendList.css";

//icons
import DeleteIcon from "../svg/deleteIcon.svg"

class FriendList extends React.Component {

  state={
    friends: this.props.friends,
    loading: false,
    showDeletePopup: false,
    popupDetails: {}
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

    handleDeleteButton = (id) => {
         this.props.deleteFriend(id, this.props.auth._id);
         this.setState({showDeletePopup:false});
     }

     renderDeletePopup = () => {
        const {popupDetails} = this.state;
         return(
         <div className="deleteFriend-container">
             <span className="deleteFriend-title">{popupDetails.friendName} will no longer be your friend and all messages will be deleted?</span>
             <div className="deleteFriend-actions">
                 <button
                 className="cancelDelete-button"
                 onClick={()=> this.setState({showDeletePopup: false})}
                 >Cancel</button>
                 <button
                 className="confirmDelete-button"
                 onClick={()=> this.handleDeleteButton(popupDetails.friendId)}
                 >Delete</button>
             </div>
         </div>
         )
     }
  

  render() {
    const {friends, loading} = this.state;
    return <div className="friendList-container">
            {
              !loading ? (
                friends.map(friend => {
                  return <div
                          className="friends-listItem-container"
                          key={friend.friends_info._id}
                          >

                            <div
                              className="main-friend-container"
                              onClick={() => {
                                this.props.selectFriend(friend.friends_info);
                                this.props.closeDrawer();
                              }}
                            >
                              <FriendItem 
                              friend={friend.friends_info}/>
                            </div>
                            <div className="friend-action-wrapper">
                              <span
                              className="delete-button"
                              onClick={()=> {
                                this.setState({showDeletePopup: true, popupDetails: {friendName: friend.friends_info.name, friendId: friend.friends_info._id}})
                              }}
                              ><img src={DeleteIcon} alt="SettingsIcon" className="delete-icon"/></span>
                            </div>
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
           {this.state.showDeletePopup ? this.renderDeletePopup() : (null)}  
    </div>
  }
}

const mapStateToProps = state => {
  return {
    friends: state.data.friends,
    loading: state.data.loading,
    auth: state.data.auth
  }
}

export default connect(mapStateToProps, {deleteFriend})(FriendList);
