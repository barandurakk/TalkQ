import React, {useState, useEffect} from "react";
import { useDispatch } from 'react-redux';
import _ from "lodash";

//components
import UserDetail from "../components/UserDetail";
import ConversationList from "../components/ConversationList";
import FriendList from "../components/FriendList";
import ChatBox from "../components/ChatBox";

//actions
import {fetchUser, fetchFriends, fetchConversations} from "../actions/index";

//style
import "../css/pages/panel.css";


const handleSelectFriend = (friend, setSelectFriend) => {
               
        setSelectFriend(friend);
}

const Panel = () => {

    const [selectedList, setSelectedList] = useState(0);
    const [selectFriend, setSelectFriend] = useState(null);
     const dispatch = useDispatch();

    useEffect(() => {  
        dispatch(fetchUser());
        dispatch(fetchConversations()); 
        dispatch(fetchFriends());
        // eslint-disable-next-line
    }, [])


    return (
    <div className="main-container">
        <div className="left-container">
            <UserDetail/>

            <div className="select-container">
                <button className={`select-buttons ${selectedList === 0 ? "active":null}`}
                    onClick={() => setSelectedList(0)}
                >Conversations</button>
                <button className={`select-buttons ${selectedList === 1 ? "active":null}`}
                 onClick={() => setSelectedList(1)}
                >Friends</button>
            </div>

            {selectedList === 0 ? (
                <ConversationList selectFriend={(friend) => {
                    handleSelectFriend(friend, setSelectFriend);
                }}/>

            ): selectedList === 1 ? (
                <FriendList selectFriend={(friend) => {
                    handleSelectFriend(friend, setSelectFriend);
                }}/>
            ) : (null)}
            
            
        </div>
        <div className="right-container">
                
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

export default (Panel);
