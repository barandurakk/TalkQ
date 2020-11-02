import React, {Fragment} from "react";
import { useDispatch } from 'react-redux'

//components
import UserDetail from "../components/UserDetail";
import ConversationList from "../components/ConversationList";

//actions
import {fetchUser} from "../actions/index";

//style
import "../css/pages/panel.css";

const Panel = () => {

    const dispatch = useDispatch();
    dispatch(fetchUser());

    return (
    <div className="main-container">
        <div className="left-container">
        
            <UserDetail/>
            <ConversationList/>
        
        </div>
        <div className="right-container">
        
            Selected Conversation
        
        </div>
    </div>
    )
  
}

export default (Panel);
