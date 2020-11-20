import React from "react";
import {connect} from "react-redux";

//components
import ConversationItem from "./ConversationItem";

//style
import "../css/components/friendList.css";



class ConversationList extends React.Component {

  state={
    conversations: this.props.conversations,
    loading:false
  }
  
  UNSAFE_componentWillReceiveProps(nextProps){
  
    if(nextProps.conversations.length > 0){
      this.setState({conversations: nextProps.conversations})
    }
    if(nextProps.loading){
      this.setState({loading:true})
    }else if(!nextProps.loading){
      this.setState({loading:false})
    }
  }

  render() {
      const {auth} = this.props;
    return <div className="friendList-container">
           { !this.props.loading ? (
             this.state.conversations.map(conversation => {
              return(
                <div
                      key={conversation._id}
                      onClick={() => this.props.selectFriend(conversation.recipients_info)}>
                   
                      <ConversationItem 
                      
                      conversation={conversation} auth={auth._id}/>
                    </div>
              ) 
            })
           ):(
             <p>Loading</p>
           )
              
            }  
    </div>
  }
}

const mapStateToProps = state => {
  return {
    conversations: state.chat.conversations,
    loading: state.ui.loading,
    auth: state.data.auth
  }
}

export default connect(mapStateToProps)(ConversationList)
