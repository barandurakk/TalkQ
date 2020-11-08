import React, {Fragment} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import io from 'socket.io-client';


//components
import RequestItem from "./RequestItem";

//actions
import {getFriendRequests} from "../actions/index";

//style
import "../css/components/notifications.css"

//icons
import NotificationIcon from "../svg/notificationIcon.svg"



class Notifications extends React.Component {

    state={
        isNotification: false,
        hideSubmenu: true,
        friendRequestList: {}
    }

    componentWillMount(){ 
        this.props.getFriendRequests();
        this.socket = io.connect(`http://localhost:5000`);
    }

    componentDidMount() {
        const {auth} = this.props;   
        this.socket.on("newFriend", (friendId) => {
            if(friendId === auth._id){
                this.props.getFriendRequests();
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
        return(
            <div className= {`notification-submenu-container ${this.state.hideSubmenu ? "hidden" : null}`} >
                <div className="notification-list">
                {
                    
                    friendRequestList && friendRequestList.length > 0 ? 
                    (
                        friendRequestList.map(request => {
                            
                            return(
                                <RequestItem request={request} key={request.requester} />
                            )
                        })
                    ) 
                    : 
                    (
                        <p>There is no friend request</p>
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
        auth: state.data.auth
    }
}

export default connect(mapStateToProps, {getFriendRequests})(Notifications);
