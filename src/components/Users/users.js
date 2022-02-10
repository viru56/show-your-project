import React, { PureComponent } from "react";
import Page from "../page";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { findAllUsers, updateUser } from "../../store/actions/user_action";
import { findIdeaDetails } from "../../store/actions/pitch_action";
import { sendNotification } from "../../store/actions/notification_action";
import Filter from "./Filter";
import PageSpinner from "../PageSpinner";
import UserCard from "./userCard";
import {
  Grid,
  Container,
  Paper,
  Typography,
  Snackbar,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";

/* see all users by their role and send request to add team member */
class Users extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      title: "",
      filteredUsers: [],
      loading: true,
      backdrop: false,
      snackbar: {
        open: false,
        title: "",
        message: "",
        level: "",
      },
    };
  }
  componentDidMount = async () => {
    window.scrollTo(0, 0);
    if (!(this.props.Idea && this.props.Idea.idea)) {
      await this.props.findIdeaDetails(this.props.match.params.id);
    }
    if (!this.props.User.users) {
      await this.props.findAllUsers(this.props.User.user.email);
    }
    const users = [];
    for (const user of this.props.User.users) {
      if (
        !(user.myPitch && user.myPitch.includes(this.props.match.params.id))
      ) {
        if (
          (this.props.User.user.requests &&
            this.props.User.user.requests.some(
              (req) =>
                req.email === user.email &&
                req.pitchId === this.props.match.params.id
            )) ||
          (user.requests &&
            user.requests.some((u) => u.pitchId === this.props.match.params.id))
        ) {
          user.isRequested = true;
        }
        if (
          user.role === "investor" &&
          this.props.match.path.indexOf("investor") > -1
        ) {
          users.push(user);
        } else if (
          user.role === "expert" &&
          this.props.match.path.indexOf("expert") > -1
        ) {
          users.push(user);
        } else if (
          user.role === "entrepreneur" &&
          this.props.match.path.indexOf("entrepreneur") > -1
        ) {
          users.push(user);
        }
      }
    }
    await this.setState({
      users,
      filteredUsers: users,
      loading: false,
    });
  };
  connect = async (user) => {
    let isNewRequest = true;
    this.setState({ backdrop: true });
    const request = {
      pitchId: this.props.Idea.idea.id,
      pitchTitle: this.props.Idea.idea.title,
      name:
        this.props.User.user.firstName[0].toUpperCase() +
        this.props.User.user.firstName.substr(1) +
        " " +
        this.props.User.user.lastName[0].toUpperCase() +
        this.props.User.user.lastName.substr(1),
      email: this.props.User.user.email,
      uid: this.props.User.user.uid,
      avatar: this.props.User.user.photoUrl || null,
      role: this.props.User.user.role,
      access: "read",
    };
    let requests = [];
    if (user.requests && user.requests.length > 0) {
      requests = user.requests;
      if (requests.findIndex((req) => req.id === request.pitchId) === -1) {
        requests.unshift(request);
      } else {
        isNewRequest = false;
      }
    } else {
      requests.push(request);
    }
    await updateUser({ email: user.email, requests });
    const snackbar = {
      open: true,
      title: "Connection Request",
      message: "Request sent successfully",
      level: "success",
    };
    const users = [...this.state.filteredUsers];
    const index = users.findIndex((u) => u.email === user.email);
    users[index].isRequested = true;
    await this.setState({
      snackbar,
      backdrop: false,
      filteredUsers: users,
    });
    const notification = {
      to: user.email,
      from: this.props.User.user.email,
      senderName:
        this.props.User.user.firstName[0].toUpperCase() +
        this.props.User.user.firstName.substr(1) +
        " " +
        this.props.User.user.lastName[0].toUpperCase() +
        this.props.User.user.lastName.substr(1),
      name:
        user.firstName[0].toUpperCase() +
        user.firstName.substr(1) +
        " " +
        user.lastName[0].toUpperCase() +
        user.lastName.substr(1),
      pitchId: this.props.Idea.idea.id,
      pitchTitle: this.props.Idea.idea.title,
      avatar: this.props.User.user.photoUrl || null,
      type: "inviteExpertOrInvestor",
      sendMail: true,
    };
    if (isNewRequest) {
      await sendNotification(notification);
    }
  };
  applyFilter = (data) => {
    if (!data) {
      this.setState({ filteredUsers: this.state.users });
    } else {
      const users = [...this.state.users];
      const filteredUsers = users.filter((user) => {
        let valid = true;
        if (data.categories.length > 0) {
          if (!user.interests || user.interests.length === 0) {
            valid = false;
          } else {
            valid =
              data.categories.filter((value) => user.interests.includes(value))
                .length > 0;
          }
        }
        if (
          data.collaboration > 0 &&
          !(user.myPitch && user.myPitch.length >= data.collaboration)
        ) {
          valid = false;
        }
        if (data.country !== "" && data.country !== user.country) {
          valid = false;
        }
        if (data.state !== "" && data.state !== user.state) {
          valid = false;
        }
        if (data.city !== "" && data.city !== user.city) {
          valid = false;
        }
        return valid;
      });
      this.setState({ filteredUsers });
    }
  };
  addSnackBar = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={this.state.snackbar.open}
        autoHideDuration={2000}
        onClose={() =>
          this.setState({ snackbar: { ...this.state.snackbar, open: false } })
        }
        message={
          <div>
            <b>{this.state.snackbar.title}</b> <br />
            {this.state.snackbar.message}
          </div>
        }
        classes={{
          root: `snackbar-${this.state.snackbar.level}`,
        }}
      />
    );
  };
  addBackdrop = () => {
    return (
      <Backdrop
        open={this.state.backdrop}
        style={{ zIndex: 99999, color: "#fff" }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };
  render() {
    if (this.state.loading) {
      return <PageSpinner />;
    }
    return (
      <Page className="users">
        <Container>
          <Paper className="mb-3 p-3">
            <Grid container>
              <Grid item md={10} xs={12} className="text-center">
                <Typography variant="h6" component="div">
                  {this.props.match.path.indexOf("investor") > -1
                    ? "Find an Investor"
                    : this.props.match.path.indexOf("expert") > -1
                    ? "Find an Expert"
                    : "Find an Entrepreneur"}
                </Typography>
              </Grid>
              <Grid item md={2} xs={12} className="text-center">
                <Filter applyFilter={this.applyFilter} />
              </Grid>
            </Grid>
          </Paper>
          <Paper className="p-3">
            <Grid
              container
              spacing={3}
              justifyContent="center"
              className="allInvestor investor-block"
            >
              {this.state.filteredUsers.length > 0 ? (
                this.state.filteredUsers.map((user) => {
                  return (
                    <Grid item key={user.id}>
                      <UserCard user={user} connect={this.connect} />
                    </Grid>
                  );
                })
              ) : (
                <Grid>No User Found</Grid>
              )}
            </Grid>
          </Paper>
        </Container>
        {this.addBackdrop()}
        {this.addSnackBar()}
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
    Idea: state.Idea,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      findAllUsers,
      findIdeaDetails,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Users));
