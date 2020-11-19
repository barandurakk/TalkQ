import React, {Fragment} from "react";

import {socket} from "../config/socket";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {connect} from "react-redux";

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
            console.log("message COME!");
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
       
         socket.emit("sendMessage", message);//send it real-time to friend
         this.setState({newMessage: [...this.state.newMessage, message]}) //show your message to screen
         this.props.createMessage(message, this.props.conversations);//send it to database  
         this.setState({body: ""})
     }

    render(){
        const {newMessage, loading, body} = this.state;
        const {auth, friend} = this.props;
        dayjs.extend(relativeTime);
      
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
                           
                             if(message.from === auth._id){
                                 return (
                                     <div className="comingMessage-container" key={Math.random()}>
                                         
                                        sent: {message.body}
                                             
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
        loading : state.chat.loading,
        auth: state.data.auth,
        messages: state.chat.messages,
        conversations: state.chat.conversations
    }
}


export default connect(mapStateToProps, {fetchMessages, createMessage})(ChatBox);
