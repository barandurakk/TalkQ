import React, { Fragment } from "react";
import {connect} from "react-redux";
import _ from "lodash";
import keys from "../config/keys";
import {socket} from "../config/socket";

//actions
import {sendFriendRequest} from "../actions/index";

//style
import "../css/components/addFriend.css"

//icons
import SuccessIcon from "../svg/successIcon.svg"
import ErrorIcon from "../svg/errorIcon.svg"

class AddFriend extends React.Component {

    state= {
        friendId: "",
        errors: {},
        success: 1 //1. uncertain //2.true //3. false
    }

    //else if(!nextProps.errors.sendError && !nextProps.loading){
    //    this.setState({success: true});
    //}

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.errors.sendError) {
          this.setState({ 
            errors: nextProps.errors.sendError, success: 3 });
        }
      }

    handleSubmit = event => {
        event.preventDefault();

        const requestForm = {
            recipient: this.state.friendId
        }
            this.props.sendFriendRequest(requestForm, this.state.friendId);
            this.setState({success:2})
            
       
   
    }

    handleClose = () => {
        this.setState({friendId: "", errors: {},
        success: 1 });
        this.props.onCancel();
    }

  render() {
      const {loading} = this.props;
      const {errors, success, friendId} = this.state;
    return (
        <div className="addFriend-container">
            <h1 className="addFriend-title">Add Friend</h1>
                
                {success === 2 ? (
                    <Fragment>
                        
                        <img src={SuccessIcon} alt="Success Icon" className="success-icon" />
                        <p className="success-text">Friend request is sended succesfully <br/>TO: {friendId}</p>
                        
                        <div className="addFriend-form-actions">
                            <button
                            type="button"
                            className="addFriend-buttons cancelButton"
                            onClick={() => this.handleClose()}
                            
                            >
                                Close
                            </button>
                        </div>
                    </Fragment>
                   
                ): success === 1 || success === 3 ? (
                    <form noValidate onSubmit={this.handleSubmit} className="addFriend-form">
                        <label  className="addFriend-form-label">Friend ID: </label>
                        <input type="text" 
                        name="friendId" 
                        value={this.state.friendId} 
                        placeholder="Ex: 5f6cbdf295550568a81c926d" 
                        className="addFriend-form-input" 
                        onChange={(e)=> this.setState({[e.target.name]: e.target.value})}
                        />
                        {!_.isEmpty(errors) ? 
                        (<div>
                            <img src={ErrorIcon} alt="Error Icon" className="error-icon" />
                            <p className="error-text"> {errors}</p>
                        </div>)
                        :
                        (null)}
                        <div className="addFriend-form-actions">
                            <button
                            type="button"
                            className="addFriend-buttons cancelButton"
                            onClick={() => this.handleClose()}
                            
                            >
                                Cancel
                            </button>
                            {loading ? (
                                <p>Loading...</p>
                            ):
                            (
                                <button
                                type="submit"
                                className={`addFriend-buttons sendButton`}
                                >
                                    Send
                                </button>
                            )
                            }
                        </div>
                    </form>
                ): (null)} 
        </div>
    )
  }
}

const mapStateToProps = state => {
    return{
        loading: state.ui.loading,
        errors: state.ui.errors
    }
}

export default connect(mapStateToProps, {sendFriendRequest})(AddFriend);
