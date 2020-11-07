import React, {Fragment} from "react";
import {connect} from "react-redux";
import _ from "lodash";

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
        friendRequestsList: [],
    }

    componentDidMount() {
        this.props.getFriendRequests();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps.friendRequests)) {
          this.setState({ 
            isNotification: true,
            friendRequestsList: nextProps.friendRequests
        });
        }
      }

    handleNotificationButton = () => {
        this.setState({
            hideSubmenu: !this.state.hideSubmenu
        })
    }

    renderSubmenu = () => {
        const {friendRequestsList} = this.state;
        return(
            <div className= {`notification-submenu-container ${this.state.hideSubmenu ? "hidden" : null}`} >
                <div className="notification-list">
                {
                    friendRequestsList.length > 0 ? 
                    (
                        friendRequestsList.map(request => {
                            return(
                                <RequestItem request={request} key={request.requester} />
                            )
                        })
                    ) 
                    : 
                    (
                        null
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
        friendRequests: state.data.friendRequests
    }
}

export default connect(mapStateToProps, {getFriendRequests})(Notifications);
