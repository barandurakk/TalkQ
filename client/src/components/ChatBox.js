import React, {Fragment } from "react";

import {socket} from "../config/socket";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {connect} from "react-redux";
import Loader from "react-loader-spinner"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import ReactEmoji from "react-emoji"

//style
import "../css/components/chatBox.css"

//icons
import SettingsIcon from "../svg/SettingIcon.svg"
import SendIcon from "../svg/sendIcon.svg"

//actions
import {fetchMessages,createMessage,getCachedMessages,updateCachedMessages} from "../actions/index";

class ChatBox extends React.Component{

    constructor(props){
        super(props);
        this.state= {
            newMessage:[],
            loading: false,
            body: "",
            friend:{},
            friends:[]
        }
        this.chatBottom = React.createRef();
        
    }

    timeout = (delay) => {
        return new Promise( res => setTimeout(res, delay) );
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        
        if(nextProps.friend._id !== this.props.friend._id){   
            if(!this.state.friends.includes(nextProps.friend._id)){
               
                this.props.fetchMessages(nextProps.friend._id);
                this.setState({friends: [...this.state.friends, nextProps.friend._id]})
            }else{              
               this.props.getCachedMessages(nextProps.friend._id);
            }  
        }
        if(nextProps.messages !== this.props.messages){
            this.setState({newMessage: nextProps.messages});    
            this.timeout(200).then(()=>{
                this.scrollToBottom();
            }).catch(err=> console.log(err));  
        }
        if(nextProps.loading){
            this.setState({loading: true})
        }else if(!nextProps.loading){
            this.setState({loading: false})
        }
    }

    componentDidMount(){
        
        this.setState({friends: [...this.state.friends, this.props.friend._id]})
        this.props.fetchMessages(this.props.friend._id);
        socket.on("getMessage", message => {
            
            if(message.from === this.props.friend._id){
                this.setState({newMessage: [...this.state.newMessage, message]});
                //update cached message
                this.props.updateCachedMessages(message.from, message);

            } else{
                //update cached messages
                this.props.updateCachedMessages(message.from, message);
            }        
        })
    }

    scrollToBottom = () => {
        this.chatBottom.current.scrollIntoView({ behavior: "auto" });
    }

    handleKeyPress = (event) => {
        const {friend, auth} = this.props;
        const {body} = this.state;
        
        if (event.key === 'Enter') {
            this.handleSendButton(friend, body, auth._id);
          }
    }

    handleSendButton = async (friend, body, from) => {
        const {auth} = this.props;
        if(body !== "" && body!==null ) {
            
            const message = {
                to: friend._id,
                friendName: friend.name, //for reducer
                friendAvatar: friend.pictureUrl, //for reducer,
                userName: auth.name, //for socket
                userAvatar: auth.pictureUrl,   //for socket
                from,
                body,
                dateSent: new Date().toISOString(),
            }        
            this.setState({newMessage: [...this.state.newMessage, message]}) //show your message to screen
            this.props.createMessage(message);//send it to database  
            this.setState({body: ""});
            await this.timeout(200);
            this.scrollToBottom();
        }    
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
                  
                 {loading ? (
                    <div className="chatbox-loading-container">
                        <Loader
                            type="TailSpin"
                            color="#077b70"
                            height={60}
                            width={60}
                            visible={this.props.loading} 
                        />           
                     </div>   
                 ): newMessage.length > 0 ? (

                     newMessage.map(message => 
                         {
                           
                             if(message.from === auth._id){
                                 return (
                                        <div className="sendingMessage-box" key={message._id ? message._id : Math.random()}>
                                        <div className="sendingMessage-container" >    
                               
                                            <div className="text-container">
                                                <span className="message-text">{ReactEmoji.emojify(message.body, {emojiType:"emojione"})}</span>
                                            </div>
                                            
                                            <div className="message-time-container">
                                                <span className="message-time">{dayjs(message.dateSent).format("HH:mm")}</span> 
                                            </div>                                 
                                        </div>
                                        </div>
                                     
                                 )
                             }else {
                                 return(
                                    <div className="comingMessage-box" key={message._id ? message._id : Math.random()}>
                                        <div className="comingMessage-container" >
                                            <div className="text-container">
                                                <span className="message-text">{ReactEmoji.emojify(message.body, {emojiType:"emojione"})}</span> 
                                            </div>
                                            <div className="message-time-container">
                                                <span className="message-time">{dayjs(message.dateSent).format("HH:mm")}</span> 
                                            </div> 
                                        </div>
                                        </div>
                                     
                                 )
                               
                             }
                        
                         })
                 ):
                 (
                     <div className="noMessage-container">
                         <span className="noMessage-text">Send a message to <br/>{friend.name}!</span>
                     </div>
                     
                 )}
                  <div ref={this.chatBottom} />
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
                 autoComplete="off"
                 onChange={(e)=> this.setState({body: e.target.value})}
                 onKeyPress={this.handleKeyPress}
                 />
                 <div 
                 className="send-icon-container"
                 onClick={()=> this.handleSendButton(friend, body, auth._id)}
                 >
                    <img src={SendIcon} alt="sendIcon"/>
                 </div>
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
        conversations: state.chat.conversations,
        messageCache: state.chat.messageCache
    }
}


export default connect(mapStateToProps, {fetchMessages, createMessage, getCachedMessages,updateCachedMessages})(ChatBox);
