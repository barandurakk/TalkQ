import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import MediaQuery from 'react-responsive'

//components
import UserDetail from "../components/UserDetail";
import ConversationList from "../components/ConversationList";
import FriendList from "../components/FriendList";
import ChatBox from "../components/ChatBox";

//icons
import googlepic from "../img/signWGoogle.png"
import logo from "../img/logo.png"

//actions
import {fetchUser, fetchFriends, fetchConversations} from "../actions/index";

//style
import "../css/pages/panel.css";


class Panel extends React.Component{

    constructor(props){
        super(props);
        this.props.fetchUser();
        this.props.fetchFriends();
        this.props.fetchConversations();
        this.state={
            selectedList: 0,
            selectFriend: null,
            showDrawer: true
        }

    }

    renderOnNotAuth = () => {
        return(
            
            <div className="noUser-container">
                <div className="noUser-wrapper">
                <img src={logo} alt="Logo" className="landing-logo" />
                    <p className="noUser-header"> Login for start <strong>chatting!</strong></p>
                    <a href="/auth/google" className="google-noUser-wrapper"><img src={googlepic} alt="GoogleSignIn" className="noUser-img" /></a>
                </div>
            </div>
        
        )
    }

    handleSelectFriend = (friend) => {
               
        this.setState({selectFriend: friend});
        
    }

    handleCloseDrawer = () => {
        this.setState({showDrawer: false});
    }

    render(){
        const { selectedList, selectFriend, showDrawer} = this.state;
        const {auth} = this.props;
        return(
            <div className="main-container">
            <div className={`left-container ${showDrawer ? ("showDrawer"):(null)}`}>
                {auth ? (
                    <UserDetail/>
                ):(
                    this.renderOnNotAuth()
                )}
                
    
                <div className="select-container">
                    <button className={`select-buttons ${selectedList === 0 ? "active":null}`}
                        onClick={() => this.setState({selectedList: 0})}
                    >Chats</button>
                    <button className={`select-buttons ${selectedList === 1 ? "active":null}`}
                     onClick={() => this.setState({selectedList: 1})}
                    >Friends</button>
                </div>
                {selectedList === 0 ? (
    
                    <ConversationList 
                    selectFriend={(friend) => {
                        this.handleSelectFriend(friend);
                    }}
                    closeDrawer = {() => this.handleCloseDrawer()}
                    />
    
                ): selectedList === 1 ? (
                    <FriendList 
                    selectFriend={(friend) => {
                        this.handleSelectFriend(friend);
                    }}
                    closeDrawer = {() => this.handleCloseDrawer()}
                    />
                ) : (null)}
       
            </div>
            <div className="right-container">
                    <MediaQuery maxDeviceWidth={600} >
                        <button
                        className="openDrawer-button"
                        onClick={()=> this.setState({showDrawer: true})}
                        > >
                        </button>
                    </MediaQuery>
                {!_.isEmpty(selectFriend) ?
                (
                    <ChatBox friend={selectFriend}/>
                ) 
                :
                (
                    <div className="noConversation-container">
                        Select <br/>
                        Conversation<br/>
                        or<br/>
                        Friend
                    </div>
                )}
                
            
            </div>
        </div>
        )
    }


}

const mapStateToProps = state => {
    return {
        auth: state.data.auth
    }
}

export default connect(mapStateToProps, {fetchUser, fetchConversations, fetchFriends})(Panel);
