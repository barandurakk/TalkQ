import React, {Fragment} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {socket} from "../config/socket";
import {withSnackbar} from "react-simple-snackbar";


//components
import RequestItem from "./RequestItem";

//actions
import {getFriendRequests, fetchFriends, updateConversations, fetchConversations} from "../actions/index";

//style
import "../css/components/notifications.css"

//icons
import NotificationIcon from "../svg/notificationIcon.svg"



class Notifications extends React.Component {

    state={
        isNotification: false,
        hideSubmenu: true,
        friendRequestList: {},
    }

    //for delay
    timeout = (delay) => {
        return new Promise( res => setTimeout(res, delay) );
    }

    componentDidMount() {
        this.props.getFriendRequests(); 
        const {auth, openSnackbar} = this.props;  
        
        socket.on("newFriend", (friendId) => {
            if(friendId === auth._id){
                this.props.getFriendRequests();
            }   
        })
        socket.on("onlineAlert", user => {
            if(auth.friends.includes(user.userId)){ 
                openSnackbar(`${user.username} is online now!`)
            }   
        })

        socket.on("deleteFriend", () => {
            this.props.fetchFriends();
        })

        socket.on("requestAccepted", (username) => {
           this.props.fetchFriends();
           openSnackbar(`${username} accepted your friend request!`)
        })

        socket.on("requestRejected", (username) => {
            openSnackbar(`${username} declined your friend request!`)
        })
       
        socket.on("getMessage", async (message) => {
            console.log("message COME! notification ");
            
           // await this.timeout(1000); //waiting conversation's update in database (i know its sloppy)
           // this.props.fetchConversations(); //reload conversations
           if(this.props.conversations.length > 1){
                this.props.updateConversations({from: message.from, body: message.body});
           }else{
            this.props.fetchConversations();
           }
          
        })
       
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps.friendRequests)) {
          this.setState({ 
            isNotification: true,
            friendRequestList: nextProps.friendRequests
        });
        }else if(_.isEmpty(nextProps.friendRequests)){
            this.setState({ 
                isNotification: false,
                friendRequestList: {}
            });
        }
      }

    handleNotificationButton = () => {
        this.setState({
            hideSubmenu: !this.state.hideSubmenu
        })
    }

    renderSubmenu = () => {
        const {friendRequestList} = this.state;
        const {auth} = this.props;  
        return(
            <div className= {`notification-submenu-container ${this.state.hideSubmenu ? "hidden" : null}`} >
                <span className="request-title">FRIEND REQUESTS</span>
                <hr/>
                <div className="notification-list">
                {
                    
                    friendRequestList && friendRequestList.length > 0 ? 
                    (
                        friendRequestList.map(request => {
                            
                            return(
                                <RequestItem request={request} key={request.requester} username={auth.name} />
                            )
                        })
                    ) 
                    : 
                    (
                        <p className="noRequest-title">There is no friend request</p>
                    )
                }
                
                </div>
            </div>
        )
    }

  render() {
      const {isNotification} = this.state;
    
    return <Fragment>
    <div className="notification-button-wrapper">
        <span 
        className="notification-button"
        onClick={()=> this.handleNotificationButton()}    
        >
            <div className={`notification-exist ${isNotification ? (null): ("hidden")}`}></div>
            <img src={NotificationIcon} alt="Notification Icon" className="notification-icon" />
        </span>
    </div>
    {this.renderSubmenu()}
    
</Fragment>
  }
}

const mapStateToProps = state => {
    return{
        errors: state.ui.errors,
        loading: state.ui.loading,
        friendRequests: state.data.friendRequests,
        auth: state.data.auth,
        conversations: state.chat.conversations
    }
}

const alertOptions = {
    position: 'bottom-right',
    style: {
      borderLeft: '10px solid #077b70',
      fontSize: '16px',
      fontWeight: 600,
      textAlign: 'left',
    },
    closeStyle: {
      fontSize: '16px',
    },
}

export default connect(mapStateToProps, {getFriendRequests,fetchFriends,updateConversations, fetchConversations})(withSnackbar(Notifications, alertOptions));
