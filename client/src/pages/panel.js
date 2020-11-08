import React, {Fragment, useState, useEffect} from "react";
import { useDispatch } from 'react-redux'

//components
import UserDetail from "../components/UserDetail";
import ConversationList from "../components/ConversationList";
import FriendList from "../components/FriendList";

//actions
import {fetchUser} from "../actions/index";

//style
import "../css/pages/panel.css";

const Panel = () => {

    const [selectedList, setSelectedList] = useState(0);
     const dispatch = useDispatch();

    useEffect(() => {  
        dispatch(fetchUser());    
    }, [])


    return (
    <div className="main-container">
        <div className="left-container">
        
            <UserDetail/>

            <div className="select-container">
                <button className="select-buttons"
                    onClick={() => setSelectedList(0)}
                >Conversations</button>
                <button className="select-buttons"
                 onClick={() => setSelectedList(1)}
                >Friends</button>
            </div>

            {selectedList === 0 ? (
                <ConversationList/>

            ): selectedList === 1 ? (
                <FriendList/>
            ) : (null)}
            
            
        
        </div>
        <div className="right-container">
        
            Selected Conversation
        
        </div>
    </div>
    )
  
}

export default (Panel);
