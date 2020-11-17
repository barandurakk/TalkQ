import React, {useState, useEffect, useCallback, Fragment} from "react";
import { useDispatch,useSelector } from 'react-redux';
import {socket} from "../config/socket";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {connect} from "react-redux";
import _ from "lodash"

//style
import "../css/components/chatBox.css"

//icons
import SettingsIcon from "../svg/SettingIcon.svg"

//actions
import {fetchMessages,createMessage} from "../actions/index";

class ChatBox extends React.Component{

    state= {
        newMessage:[],
        loading: false,
        body: "",
        friend:{}
    }


    UNSAFE_componentWillReceiveProps(nextProps){
        console.log("nextProps: ", nextProps);
        if(nextProps.friend._id !== this.props.friend._id){
            this.props.fetchMessages(nextProps.friend._id);
        }
        if(nextProps.messages !== this.props.messages){
            console.log("messages changed!");
            this.setState({newMessage: nextProps.messages});
        }
        if(nextProps.loading){
            this.setState({loading: true})
        }else if(!nextProps.loading){
            this.setState({loading: false})
        }
    }

    componentDidMount(){
        this.props.fetchMessages(this.props.friend._id);
        socket.on("getMessage", message => {
                     console.log("prop when the message come: ", this.props.friend);
                     console.log("state when message come: ", this.state.newMessage);

                     if(message.from === this.props.friend._id){

                         this.setState({newMessage: [...this.state.newMessage, message]});
                     
                        }
            
                  })
    }

    handleSendButton = (friend, body, from) => {
         const message = {
             to: friend._id,
             from,
             body,
             dateSent: new Date().toISOString(),
         }
        //if there is already messages dont if not create conversation
         if(this.state.newMessage.length < 1){
           // create conversation
             console.log("create conv!");
         }
         socket.emit("sendMessage", message);//send it real-time to friend
         this.setState({newMessage: [...this.state.newMessage, message]}) //show your message to screen
         this.props.createMessage(message);//send it to database  
         this.setState({body: ""})
     }

    render(){
        const {newMessage, loading, body} = this.state;
        const {auth, friend} = this.props;
      
        return(
            <div className="chatbox-container">
            
             <div className="chatbox-topbar">
                 <div className="chatbox-userDetails">
                     <div className="chatbox-userAvatar-wrapper">
                         <img className="chatbox-userAvatar" src={friend.pictureUrl} alt="userAvatar"/>
                     </div>
                     <div className="chatbox-userName-container">
                         <span className="chatbox-userName">{friend.name}</span>
                     </div>
                 </div>
                 <div className="chatbox-setttings-container">
                     <img className="chatbox-settings-icon" alt="settingsIcon" src={SettingsIcon}/>
                 </div>
             </div>
             <div className="chatbox-messages-container">
                 {loading ? (<p>Loading</p>): newMessage.length > 0 ? (

                     newMessage.map(message => 
                         {
                           
                             if(message.from == auth._id){
                                 return (
                                     <div className="comingMessage-container" key={Math.random()}>
                                             sent : {message.body}
                                             
                                     </div>
                                 )
                             }else {
                                 return(
                                     <div className="sendingMessage-container" key={Math.random()}>
                                     comming : {message.body}
                                     </div>
                                 )
                               
                             }
                        
                         })
                 ):
                 (
                     <p>Send a message to {friend.name}</p>
                 )}
             </div>
             <div className="chatbox-input-container">
             {loading ? (
                 null
             )
             :
             (
                 <Fragment>
                 <input 
                 type="text" 
                 className="chatbox-input" 
                 placeholder="Type a message"
                 value={body}
                 name="body"
                 onChange={(e)=> this.setState({body: e.target.value})}
                 />
                 <button
                 onClick={()=> this.handleSendButton(friend, body, auth._id)}
                 >SEND</button>
                 </Fragment>
             )}
            
             </div>

         </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading : state.ui.loading,
        auth: state.data.auth,
        messages: state.chat.messages
    }
}


export default connect(mapStateToProps, {fetchMessages, createMessage})(ChatBox);







// const handleSendButton = (friend, body, from, newMessage ,setnewMessage,dispatch) => {
//     console.log("sendfriendId: ",friend._id);
//     console.log("sendOurID: ",from );
//     const message = {
//         to: friend._id,
//         from,
//         body,
//         dateSent: new Date().toISOString(),
//     }
//     //if there is already messages dont if not create conversation
//     if(newMessage.length < 1){
//         //create conversation
//         console.log("create conv!");
//     }
//     socket.emit("sendMessage", message); //send it real-time to friend
//     setnewMessage(newMessage => [...newMessage, message]) // show your message to screen
//     dispatch(createMessage(message)); //send it to database  
// }

// const getMessages = async (friendId, dispatch) => {
//     console.log("inside get message!");
//    await dispatch(fetchMessages({friendId})) //set messages  
  
// }

// const ChatBox = (props) => {

//     const dispatch = useDispatch();
//     //const friend = props.friend;   
//     dayjs.extend(relativeTime);
//     const [newMessage, setnewMessage] = useState([]);
//     const [friend, setFriend] = useState({});
//     const loading = useSelector(state=> state.ui.loading);
//     const auth = useSelector(state=> state.data.auth);
//     const [body, setBody] = useState("");
//     console.log("outside effect props: ",props.friend);
//     const messages = useSelector(state=> state.chat.messages);
    

//      useEffect(() => {
//          console.log("inside first effect");
//          getMessages(props.friend._id, dispatch);
//          console.log("messages: ", messages);
//          setFriend(props.friend);
//      },[])

//      useEffect(() => {
//          console.log("inside set message effect!")
//              setnewMessage(messages);     
//      },[])
    
    
//     useEffect(() => {
//         socket.on("getMessage", message => {
//             console.log("getMessage: ", message);
//             console.log("state when the message come: ", friend);
//             if(newMessage.length < 0) {
//                 //create conversation
//             }
//             if(message.from === friend._id){
//                 setnewMessage(newMessage => [...newMessage, message]);
//             }

//          })
//     },[])

          

//     return(
        
//         <div className="chatbox-container">
            
//             <div className="chatbox-topbar">
//                 <div className="chatbox-userDetails">
//                     <div className="chatbox-userAvatar-wrapper">
//                         <img className="chatbox-userAvatar" src={friend.pictureUrl} alt="userAvatar"/>
//                     </div>
//                     <div className="chatbox-userName-container">
//                         <span className="chatbox-userName">{friend.name}</span>
//                     </div>
//                 </div>
//                 <div className="chatbox-setttings-container">
//                     <img className="chatbox-settings-icon" alt="settingsIcon" src={SettingsIcon}/>
//                 </div>
//             </div>
//             <div className="chatbox-messages-container">
//                 {loading ? (<p>Loading</p>): newMessage.length > 0 ? (

//                     newMessage.map(message => 
//                         {
                           
//                             if(message.from == auth._id){
//                                 return (
//                                     <div className="comingMessage-container" key={Math.random()}>
//                                             sent : {message.body}
//                                             time : {dayjs(message.dateSent).fromNow()}
//                                     </div>
//                                 )
//                             }else {
//                                 return(
//                                     <div className="sendingMessage-container" key={Math.random()}>
//                                     comming : {message.body}
//                                     </div>
//                                 )
                               
//                             }
                        
//                         })
//                 ):
//                 (
//                     <p>Send a message to {friend.name}</p>
//                 )}
//             </div>
//             <div className="chatbox-input-container">
//             {loading ? (
//                 null
//             )
//             :
//             (
//                 <Fragment>
//                 <input 
//                 type="text" 
//                 className="chatbox-input" 
//                 placeholder="Type a message"
//                 value={body}
//                 name="body"
//                 onChange={(e)=> setBody(e.target.value)}
//                 />
//                 <button
//                 onClick={()=> {
//                     handleSendButton(friend, body, auth._id ,newMessage, setnewMessage, dispatch);
//                     //clear input
//                     setBody("");
//                     }}
//                 >SEND</button>
//                 </Fragment>
//             )}
            
//             </div>

//         </div>
//     )

    

// }


