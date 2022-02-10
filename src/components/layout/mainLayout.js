import React, { Component } from "react";
import { Content, Header } from "./";
import { withRouter } from "react-router-dom";
import {
  findUserDetails,
  updateUserDetails,
} from "../../store/actions/user_action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PageSpinner from "../PageSpinner";
import Chat from "../chat/chat";
import { firebase } from "../../libs/config";

/* use this HOC for autherised pages, check for user is authorised or not */
class MainLayout extends Component {
  state = {
    loading: true,
  };
  observer = null;
  componentDidMount() {
    /* it will check user details every time when page refresh
    * check if user is logged in or not
     */
    this.observer = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        await this.props.findUserDetails(user.email);
        await this.setState({ loading: false });
        if (this.props.User.user) {
          if (!this.props.User.user.role) {
            this.props.history.push("/role");
          } else {
            if (
              !this.props.User.user.isVerified ||
              this.props.User.user.reject
            ) {
              this.props.history.push("/notVerified");
            }
            if (!this.props.User.user.emailVerified) {
              if (user.emailVerified) {
                const updatedUser = this.props.User.user;
                updatedUser.emailVerified = true;
                this.props.updateUserDetails(updatedUser);
              } else {
                this.props.history.push("/emailVerification");
              }
            }
          }
        } else {
          this.props.history.push("/login");
        }
      } else {
        this.props.history.push("/login");
      }
    });
  }
  componentWillUnmount() {
    this.observer();
  }
  render() {
    const { children } = this.props;
    return this.state.loading ? (
      <PageSpinner />
    ) : (
      <main className="sr-app bg-light">
        <Content>
          <Header />
          {children}
          {/* <Footer /> */}
          <Chat />
        </Content>
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ findUserDetails, updateUserDetails }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MainLayout));
