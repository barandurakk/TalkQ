import React, {Fragment, useEffect, useState} from "react";


//styles
import "../css/components/conversationItem.css"

const ConversationItem = (props) => {

    const [conversation, setConversation] = useState(props.conversation)

    useEffect(() => {

        setConversation(props.conversation)

    },[props.conversation])

    return (
        
        <Fragment>

             <div className="conversationItem-container">
                 <div className="conversation-avatar-wrapper">
                 <img src={conversation.recipients_info.pictureUrl} alt="conversation Avatar" className={`conversation-avatar`}/>
                 </div>
                 <div className="conversation-info-wrapper">
         <span className="conversation-name">{conversation.recipients_info.name}</span>
           <span className="conversation-id">
               {conversation.lastMessage.length > 36 ? (
                   `${conversation.lastMessage.body.substr(0,35)}...`
               ):(
                 `${conversation.lastMessage.body}`
               )}
               </span>
                 </div>
                 <div className="conversation-action-wrapper">
                        
                 </div>
                    
             </div>
             <hr className="conversation-divider"/>
          </Fragment>
    )
}

export default ConversationItem;

// class ConversationItem extends React.Component {

//     state= {
//         conversation: this.props.conversation,
//     }

//     UNSAFE_componentWillReceiveProps(nextProps){
//         console.log(nextProps);
//         console.log("conversationItem props: ", nextProps);
//         if(nextProps.conversation){
//             this.setState({conversation: nextProps.conversation})
//         }

//     }

//   render() {
      
//       const {conversation} = this.state;
//       console.log(conversation);
//       return (
//      <Fragment>
//         <div className="conversationItem-container">
//             <div className="conversation-avatar-wrapper">
//             <img src={conversation.recipients_info.pictureUrl} alt="conversation Avatar" className={`conversation-avatar`}/>
//             </div>
//             <div className="conversation-info-wrapper">
//     <span className="conversation-name">{conversation.recipients_info.name}</span>
//       <span className="conversation-id">
//           {conversation.lastMessage.length > 36 ? (
//               `${conversation.lastMessage.body.substr(0,35)}...`
//           ):(
//             `${conversation.lastMessage.body}`
//           )}
//           </span>
//             </div>
//             <div className="conversation-action-wrapper">
                
//             </div>
            
//         </div>
//         <hr className="conversation-divider"/>
//      </Fragment>
//     )
//   }
// }

// const mapStateToProps = state => {
//     return {
//         auth: state.data.auth
//     }
// }

//export default connect(mapStateToProps)(ConversationItem);
