import React, { Component } from "react";
import Page from "../page";
import {
  Container,
  Box,
  Grid,
  Avatar,
  Paper,
  Backdrop,
  CircularProgress,
  Divider,
  Button,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateIdeaDetails,
  findAllIdeas,
} from "../../store/actions/pitch_action";
import { updateUserDetails } from "../../store/actions/user_action";
import {
  findConnections,
  updateConnection,
} from "../../store/actions/connection_action";
import { sendNotification } from "../../store/actions/notification_action";

/* see who invite you as a team member or who wants to connect with you, you can approve/ reject request */
class Request extends Component {
  state = {
    isPending: true,
    backdrop: false,
  };
  async componentDidMount() {
    if (this.props.Connection.connections.length === 0) {
      await this.props.findConnections(this.props.User.user.email);
    }

    const isPending = this.props.Connection.connections.some(
      (con) => !con.isConnected
    );
    await this.setState({ isPending });
  }

  acceptRequest = async (pitchId, email) => {
    const user = { ...this.props.User.user };
    const requestIndex = user.requests.findIndex(
      (req) => req.pitchId === pitchId && req.email === email
    );
    const request = user.requests[requestIndex];
    user.requests.splice(requestIndex, 1);
    if (!(this.props.Idea.ideas && this.props.Idea.ideas.length > 0)) {
      await this.props.findAllIdeas();
    }
    const pitch = this.props.Idea.ideas.find((idea) => idea.id === pitchId);
    if (request.email === pitch.email) {
      if (
        pitch[`${user.role}s`] &&
        pitch[`${user.role}s`].findIndex((u) => u.email === user.email) === -1
      ) {
        pitch[`${user.role}s`].push({
          name: user.firstName + " " + user.lastName,
          email: user.email,
          access: request.access || "read",
          uid: user.uid,
        });
      }
      if (user.myPitch) {
        if (!user.myPitch.includes(pitchId)) user.myPitch.push(pitchId);
      } else {
        user.myPitch = [pitchId];
      }
    } else {
      if (
        pitch[`${user.role}s`] &&
        pitch[`${user.role}s`].findIndex((u) => u.email === request.email) ===
          -1
      ) {
        pitch[`${request.role}s`].push({
          name: request.name,
          email: request.email,
          uid: request.uid,
          access: request.access || "read",
        });
      }
      pitch.user = {
        email: request.email,
        pitchId: pitchId,
      };
    }
    await Promise.all([
      this.props.updateUserDetails(user),
      updateIdeaDetails(pitch),
      sendNotification({
        senderName:
          this.props.User.user.firstName[0].toUpperCase() +
          this.props.User.user.firstName.substr(1) +
          " " +
          this.props.User.user.lastName[0].toUpperCase() +
          this.props.User.user.lastName.substr(1),
        sendMail: true,
        to: request.email,
        pitchTitle: request.pitchTitle,
        pitchId: request.pitchId,
        type: "acceptIdeaRequest",
      }),
    ]);
  };
  rejectRequest = async (pitchId,email) => {
    const user = this.props.User.user;
    const index = user.requests.findIndex(
      (req) => req.pitchId === pitchId && req.email === email
    );
    user.requests.splice(index,1);
    await this.props.updateUserDetails(user);
  };
  acceptConnectionRequest = async (email) => {
    this.setState({ backdrop: true });
    const connection = {
      name:
        this.props.User.user.firstName + " " + this.props.User.user.lastName,
      email: this.props.User.user.email,
      uid: this.props.User.user.uid,
      avatar: this.props.User.user.photoUrl || null,
      role: this.props.User.user.role,
      isConnected: true,
    };
    await this.props.updateConnection({
      type: "accept",
      connectionEmail: email,
      connection,
    });
    sendNotification({
      senderName:
        this.props.User.user.firstName[0].toUpperCase() +
        this.props.User.user.firstName.substr(1) +
        " " +
        this.props.User.user.lastName[0].toUpperCase() +
        this.props.User.user.lastName.substr(1),
      sendMail: true,
      to: email,
      type: "acceptConnectionRequest",
    });
    this.setState({ backdrop: false });
  };
  rejectConnectionRequest = async (email) => {
    this.setState({ backdrop: true });
    await this.props.updateConnection({
      type: "reject",
      connectionEmail: email,
      email: this.props.User.user.email,
    });
    this.setState({ backdrop: false });
  };
  render() {
    return (
      <Page className="request">
        <Container>
          <Grid
            container
            justifyContent="space-between"
            alignItems="flex-start"
            className="mb-2"
          >
            <Grid item>
              <Box fontWeight="fontWeightBold" fontSize="1.2rem">
                Requests
              </Box>
            </Grid>
          </Grid>
          <Paper className="message-box">
            {this.props.User.user.requests &&
              this.props.User.user.requests.length > 0 &&
              this.props.User.user.requests.map((request, index) => (
                <Grid
                  container
                  key={index}
                  style={{
                    borderBottom:
                      index !== this.props.User.user.requests.length - 1
                        ? "1px solid #ccc"
                        : 0,
                  }}
                >
                  <Grid item xs={12} sm={12} md={8} ld={8}>
                    <Box className="message-text">
                      <Avatar src={request.avatar}>
                        <AccountCircleIcon />
                      </Avatar>
                      <p className="p-2 mb-0">
                        <span
                          style={{ fontWeight: 500, cursor: "pointer" }}
                          onClick={() =>
                            this.props.history.push("/profile/" + request.uid)
                          }
                        >
                          {request.name}
                        </span>
                        <span>&nbsp;as an&nbsp;</span>
                        <span>{request.role}</span>
                        <span>&nbsp;for&nbsp;</span>
                        <span
                          style={{ fontWeight: 500, cursor: "pointer" }}
                          onClick={() =>
                            this.props.history.push(
                              "/detailsIdea/" + request.pitchId
                            )
                          }
                        >
                          {request.pitchTitle}
                        </span>
                      </p>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} ld={4}>
                    <Box className="p-2">
                      <Button
                        color="primary"
                        variant="contained"
                        className="mr-5"
                        onClick={() =>
                          this.acceptRequest(request.pitchId, request.email)
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                          this.rejectRequest(request.pitchId, request.email)
                        }
                      >
                        Reject
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            {this.state.isPending &&
              this.props.User.user.requests &&
              this.props.User.user.requests.length > 0 && <Divider />}
            {this.props.Connection.connections &&
              this.props.Connection.connections.map((con, index) => (
                <div key={index}>
                  {!con.isConnected && (
                    <Grid
                      container
                      style={{
                        borderBottom:
                          index !== this.props.Connection.connections.length - 1
                            ? "1px solid #ccc"
                            : 0,
                      }}
                    >
                      <Grid item xs={12} sm={12} md={8} ld={8}>
                        <Box className="message-text">
                          <Avatar src={con.avatar}>
                            <AccountCircleIcon />
                          </Avatar>
                          <p className="p-2 mb-0">
                            <span
                              style={{ fontWeight: 500, cursor: "pointer" }}
                              onClick={() =>
                                this.props.history.push("/profile/" + con.uid)
                              }
                            >
                              {con.name}
                            </span>
                            <span>&nbsp;as an&nbsp;</span>
                            <span>{con.role}</span>
                            <span>&nbsp;wants to connect with you&nbsp;</span>
                          </p>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} ld={4}>
                        <Box className="p-2">
                          <Button
                            color="primary"
                            variant="contained"
                            className="mr-5"
                            onClick={() =>
                              this.acceptConnectionRequest(con.email)
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            color="secondary"
                            variant="outlined"
                            onClick={() =>
                              this.rejectConnectionRequest(con.email)
                            }
                          >
                            Reject
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </div>
              ))}
            {(!this.props.User.user.requests ||
              this.props.User.user.requests.length === 0) &&
              !this.state.isPending && <Box>You do not have any requests</Box>}
          </Paper>
        </Container>
        <Backdrop
          open={this.state.backdrop}
          style={{ zIndex: 99999, color: "#fff" }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
    Idea: state.Idea,
    Connection: state.Connection,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateUserDetails,
      findAllIdeas,
      findConnections,
      updateConnection,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Request));
