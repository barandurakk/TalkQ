import React from "react";

//actions
import {sendFriendRequest} from "../actions/index";

//style
import "../css/components/addFriend.css"

class AddFriend extends React.Component {

    handleSubmit = () => {
        console.log("submit!");
    }

  render() {
    return (
        <div className="addFriend-container">
            <h1 className="addFriend-title">Add Friend</h1>
            <form onSubmit={()=> this.handleSubmit()} className="addFriend-form">
                <label  className="addFriend-form-label">Friend ID: </label>
                <input type="text" placeholder="Ex: 5f6cbdf295550568a81c926d" className="addFriend-form-input" />
                <div className="addFriend-form-actions">
                <button
                type="submit"
                >
                    Send
                </button>
                <button
                
                >
                    Cancel
                </button>
                </div>
            </form>
        </div>
    )
  }
}

export default AddFriend;
