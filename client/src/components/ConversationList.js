import React from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

//actions
import { deleteConversation } from "../actions/index";

//components
import ConversationItem from "./ConversationItem";

//style
import "../css/components/conversationList.css";

//icons
import DeleteIcon from "../svg/deleteIcon.svg";

class ConversationList extends React.Component {
  state = {
    conversations: this.props.conversations,
    loading: false,
    showDeletePopup: false,
    popupDetails: {},
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.conversations.length > 0) {
      this.setState({ conversations: nextProps.conversations });
    }
    if (nextProps.loading) {
      this.setState({ loading: true });
    } else if (!nextProps.loading) {
      this.setState({ loading: false });
    }
  }

  handleDeleteButton = (id) => {
    this.props.deleteConversation(id, this.props.auth._id);
    this.setState({ showDeletePopup: false });
  };

  renderDeletePopup = () => {
    const { popupDetails } = this.state;
    return (
      <div className="deleteconversation-container">
        <span className="deleteconversation-title">
          All messages with {popupDetails.friendName} will be deleted. <br /> Are you sure?
        </span>
        <div className="deleteconversation-actions">
          <button
            className="cancelDelete-button"
            onClick={() => this.setState({ showDeletePopup: false })}
          >
            Cancel
          </button>
          <button
            className="confirmDelete-button"
            onClick={() => this.handleDeleteButton(popupDetails.friendId)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { auth } = this.props;
    return (
      <div className="convList-container">
        {!this.props.loading ? (
          this.state.conversations.map((conversation) => {
            return (
              <div className="conversation-listItem-container" key={conversation._id}>
                <div
                  className="main-conv-container"
                  onClick={() => {
                    this.props.selectFriend(conversation.recipients_info);
                    this.props.closeDrawer();
                  }}
                >
                  <ConversationItem conversation={conversation} auth={auth._id} />
                </div>

                <div className="conversation-action-wrapper">
                  <span
                    className="delete-button"
                    onClick={() => {
                      this.setState({
                        showDeletePopup: true,
                        popupDetails: {
                          friendName: conversation.recipients_info.name,
                          friendId: conversation.recipients_info._id,
                        },
                      });
                    }}
                  >
                    <img src={DeleteIcon} alt="SettingsIcon" className="delete-icon" />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="conversations-loading-container">
            <Loader
              type="TailSpin"
              color="#077b70"
              height={40}
              width={40}
              visible={this.props.loading}
            />
          </div>
        )}
        {this.state.showDeletePopup ? this.renderDeletePopup() : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    conversations: state.chat.conversations,
    loading: state.ui.loading,
    auth: state.data.userDetails,
  };
};

export default connect(mapStateToProps, { deleteConversation })(ConversationList);
