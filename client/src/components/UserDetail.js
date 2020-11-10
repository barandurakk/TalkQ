import React from "react";
import { useSelector } from 'react-redux'
import _ from "lodash";

//styles
import "../css/components/userDetail.css"

//components
import Settings from "./Settings";
import Notifications from "./Notifications";


const UserDetail = () => {
    const auth = useSelector(state=> state.data.auth);
  

    return (
    <div className="userDetail-container">
        <div className="userDetail-top">
            <div className="userDetail">
                <img src={auth.pictureUrl} className="userAvatar" alt="User Avatar"/>
                <span className="userName">{auth.name}</span>
            </div>
            {!_.isEmpty(auth) ? (
                <div className="detail-icon-wrapper">
                <Notifications/>
                <Settings/>
            </div>
            ):(
                null
            )}
            
        </div> 
        <span className="userId">User ID:<strong> {auth._id}</strong></span>
          
    </div>
    )
}


export default UserDetail
