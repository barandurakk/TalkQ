import React, {useState} from "react";
import { useSelector } from 'react-redux'
import _ from "lodash";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useSnackbar } from 'react-simple-snackbar'

//styles
import "../css/components/userDetail.css"

//components
import Settings from "./Settings";
import Notifications from "./Notifications";

//icons
import CopyIcon from "../svg/copyIcon.svg"


const UserDetail = () => {
    const auth = useSelector(state=> state.data.auth);
    const loading = useSelector(state => state.data.loading);
    const [openSnackbar, closeSnackbar] = useSnackbar();
  

    return (
        !loading ? (
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
            <div className="userId-container">
                <span className="userId">
                    ID:<strong> {auth._id}</strong>
                </span>
                <CopyToClipboard 
                    text={auth._id}
                    onCopy={() => openSnackbar("User ID Copied!")}
                >
                    <div className="copyIcon-wrapper" >
                        <img src={CopyIcon} alt="copyIcon" className="copy-icon" />
                    </div>
                 </CopyToClipboard> 
            </div>
            
              
        </div>
        ):(
            <p>Loading</p>
        )
    )
}


export default UserDetail
