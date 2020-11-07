import React, {useEffect, useState} from "react";
import { useSelector } from 'react-redux'
import io from "socket.io-client";
import _ from "lodash";

//styles
import "../css/components/userDetail.css"

//components
import Settings from "./Settings";
import Notifications from "./Notifications";

let socket;

const UserDetail = () => {
    
    const ENDPOINT = "localhost:5000";
    const auth = useSelector(state=> state.data.auth);

    useEffect(() => {
        socket = io.connect(ENDPOINT);
        if(!_.isEmpty(auth)){
            
            socket.emit("online", {username : auth.name})
            socket.on("notification", notification => {
                console.log(notification);
            })
        }

        return () => {
            socket.emit("disconnect");
            socket.off();
        }

    }, [auth, ENDPOINT]);

    return (
    <div className="userDetail-container">
        <div className="userDetail-top">
            <div className="userDetail">
                <img src={auth.pictureUrl} className="userAvatar"/>
                <span className="userName">{auth.name}</span>
            </div>
            <div className="detail-icon-wrapper">
                <Notifications/>
                <Settings/>
            </div>
        </div> 
        <span className="userId">User ID:<strong> {auth._id}</strong></span>
          
    </div>
    )
}


export default UserDetail
