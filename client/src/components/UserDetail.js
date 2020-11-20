import React, {useState} from "react";
import { useSelector, useDispatch } from 'react-redux'
import _ from "lodash";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useSnackbar } from 'react-simple-snackbar'
import Loader from "react-loader-spinner"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

//styles
import "../css/components/userDetail.css"

//components
import Settings from "./Settings";
import Notifications from "./Notifications";

//icons
import CopyIcon from "../svg/copyIcon.svg"

//actions
import { uploadImage } from "../actions/index";


const onImageChange = (event,dispatch) => {
    const imageInInput = event.target.files[0];
    const formData = new FormData();
    formData.append("file", imageInInput, imageInInput.name);
    dispatch(uploadImage(formData));
}

const onEditImage = () => {
   
    const imageInput = document.getElementById("imageInput");
    imageInput.click();
  };

  const renderBigAvatar = (avatar,setShowBigAvatar) => {
      return(
          <div className="bigAvatar-container">
              
              <img src={avatar} className="userAvatarBig" alt="User Avatar"/>
              <div className="bigAvatar-actions">
                <span
                onClick={()=>setShowBigAvatar(false)}
                >Close</span>
                <span
                onClick={()=>onEditImage()}
                >Change</span>
              </div>
             
          </div>
      )
  }

const UserDetail = () => {
    const [showBigAvatar, setShowBigAvatar] = useState(false);
    const auth = useSelector(state=> state.data.auth);
    const loading = useSelector(state => state.data.loading);
    const [openSnackbar] = useSnackbar();
    const dispatch = useDispatch();
    return (
        !loading ? (
            <div className="userDetail-container">
            <div className="userDetail-top">
                <div className="userDetail">
                    <span
                    onClick={()=> setShowBigAvatar(!showBigAvatar)}>
                        <img src={auth.pictureUrl} className="userAvatar" alt="User Avatar"/>
                    </span>
                    <input type="file" id="imageInput" hidden="hidden" onChange={(event) => onImageChange(event,dispatch)} />
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
            
              {showBigAvatar ? (renderBigAvatar(auth.pictureUrl,setShowBigAvatar)):(null)}
        </div>
        ):(
            <div className="loading-container">
                <Loader
                    type="TailSpin"
                    color="#077b70"
                    height={100}
                    width={100}
                    visible={loading} 
                />
                
            </div>
            
        )
        
    )
}


export default UserDetail
