import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//actions
import { logout } from "../actions/index";

//components
import AddFriend from "./AddFriend";

//styles
import "../css/components/settings.css";

//icons
import SettingIcon from "../svg/SettingIcon.svg";

class Settings extends React.Component {
  state = {
    hideSubmenu: true,
    hideAddFriend: true,
  };

  renderSubmenu = () => {
    return (
      <div className={`settings-submenu-container ${this.state.hideSubmenu ? "hidden" : null}`}>
        <div className="settings-list">
          <button
            className="settings-item"
            onClick={() => {
              this.setState({
                hideAddFriend: !this.state.hideAddFriend,
                hideSubmenu: !this.state.hideSubmenu,
              });
            }}
          >
            Add friend
          </button>
          <button
            className="settings-item"
            onClick={() => {
              this.props.logout();
              this.props.history.push("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  };

  handleSettingButton = () => {
    this.setState({
      hideSubmenu: !this.state.hideSubmenu,
    });
  };

  handleCancelAddFriend = () => {
    this.setState({
      hideAddFriend: true,
    });
  };

  render() {
    return (
      <Fragment>
        <div className="settingButton-wrapper">
          <div className="settings-button" onClick={() => this.handleSettingButton()}>
            <img src={SettingIcon} alt="Settings Icon" className="settings-icon" />
          </div>
        </div>
        {this.renderSubmenu()}

        <div className={`${this.state.hideAddFriend ? "hidden" : null}`}>
          <AddFriend onCancel={this.handleCancelAddFriend} />
        </div>
      </Fragment>
    );
  }
}

export default connect(null, { logout })(withRouter(Settings));
