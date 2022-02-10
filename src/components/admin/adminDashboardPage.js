import React, { PureComponent } from "react";
import Page from "../page";
import PageSpinner from "../PageSpinner";
import {
  Container,
  Grid,
  Box,
  Link,
  Paper,
  Button,
  Divider,
  Snackbar,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { withRouter } from "react-router";
import { findAllUsers, updateUser } from "../../store/actions/user_action";
import { sendMail } from "../../store/actions/notification_action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AdminMessageDialog from "./adminMessageDialog";
import csc from "country-state-city";


/* Show all investor and expert whose profile is not approved so admin can review and approve their profile */
class AdminDashboardPage extends PureComponent {
  state = {
    users: [],
    loading: true,
    selected: "all",
    showDialog: false,
    reject: false,
    backdrop: false,
    snackbar: {
      open: false,
      title: "",
      message: "",
      level: "",
    },
    selectedUser: null,
  };
  componentDidMount = async () => {
    await this.props.findAllUsers(this.props.User.user.email, true);
    if (this.props.User.error) {
      console.log(this.props.User.error);
      this.setState({ loading: false, users: [] });
    } else {
      this.setState({ loading: false });
      this.filterUsers("all");
    }
  };
  filterUsers = (filter) => {
    const users = this.props.User.users.filter(
      (user) =>
        (user.role === "expert" || user.role === "investor") && !user.isVerified
    );
    if (filter === "all") {
      this.setState({ selected: filter, users });
    } else {
      const filteredUsers = users.filter((user) => user.role === filter);
      this.setState({ selected: filter, users: filteredUsers });
    }
  };
  handleDialogClose = async (message) => {
    this.setState({ showDialog: false });
    if (message) {
      this.setState({ backdrop: true });
      const user = { ...this.state.selectedUser };
      user.approver = this.props.User.user.email;
      user.isVerified = true;
      user.reject = this.state.reject;
      user.adminRemarks = message;
      await updateUser(user);
      await this.props.findAllUsers(this.props.User.user.email, true);
      const snackbar = {
        open: true,
        title: "Profile approved",
        message: "User profile is approved",
        level: "success",
      };
      if (this.state.reject) {
        snackbar.title = "Profile rejected";
        snackbar.message = "User profile is rejected";
      }
      this.setState({ backdrop: false, snackbar });
      await sendMail({
        to: this.state.selectedUser.email,
        useTemplate: this.state.reject ? "reject" : "approve",
        adminRemarks: message,
      });
      this.filterUsers(this.state.selected);
    }
  };
  getPhoneNumberWithCountryCode = (user) => {
    let phone = "";
    if (user.phone) {
      phone += user.phone;
    }
    if (user.country) {
      const phonecode = csc.getCountryById(user.country).phonecode;
      if (phonecode) {
        phone = csc.getCountryById(user.country).phonecode + " " + phone;
      }
    }
    return phone;
  };
  render() {
    if (this.state.loading) {
      return <PageSpinner />;
    }
    return (
      <Page className="AdminDashboardPage">
        <Container fixed>
          <div elevation={1} className="main">
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              spacing={3}
              className="p-2"
            >
              <Grid item>
                <Button
                  onClick={() => this.filterUsers("all")}
                  className={
                    this.state.selected === "all"
                      ? "seleted no-outline"
                      : "no-outline"
                  }
                >
                  All
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => this.filterUsers("investor")}
                  className={
                    this.state.selected === "investor"
                      ? "seleted no-outline"
                      : "no-outline"
                  }
                >
                  Investor
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => this.filterUsers("expert")}
                  className={
                    this.state.selected === "expert"
                      ? "seleted no-outline"
                      : "no-outline"
                  }
                >
                  Expert
                </Button>
              </Grid>
            </Grid>
            <Divider className="mb-3" />
            {this.state.users.length > 0 ? (
              this.state.users.map((user) => (
                <Paper key={user.email} elevation={1} className="m-3 p-3">
                  <Grid container>
                    <Grid item xs={12} md={2}>
                      <div className="user-details">
                        {user.photoUrl ? (
                          <img
                            src={user.photoUrl}
                            alt="user"
                            className="user-image"
                          />
                        ) : (
                          <AccountCircleIcon className="user-image" />
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box
                        component="div"
                        fontWeight="fontWeightBold"
                        className="capital"
                      >
                        {user.firstName}&nbsp;{user.lastName}
                      </Box>
                      <Box component="div" className="capital">
                        {user.role}
                      </Box>
                      <Box
                        component="div"
                        className="capital"
                        fontSize="0.8rem"
                      >
                        {user.interest && user.interests.join(", ")}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box component="div" fontWeight="fontWeightBold">
                        Phone #{this.getPhoneNumberWithCountryCode(user)}
                      </Box>
                      <Box component="div">
                      {user.email}
                      </Box>
                      <Box component="div" fontSize="0.8rem">
                        <Link
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            this.props.history.push("/profile/" + user.uid);
                          }}
                        >
                          See Profile
                        </Link>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Grid
                        container
                        justifyContent="space-evenly"
                        className="pt-3 pb-2"
                        alignItems="center"
                      >
                        <Grid item>
                          <Button
                            variant="contained"
                            className="mr-3 no-outline accept"
                            onClick={() =>
                              this.setState({
                                showDialog: true,
                                selectedUser: user,
                                reject: false,
                              })
                            }
                          >
                            Accept
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            className="ml-3 no-outline reject"
                            onClick={() =>
                              this.setState({
                                showDialog: true,
                                reject: true,
                                selectedUser: user,
                              })
                            }
                          >
                            Reject
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              ))
            ) : (
              <Box fontWeight="fontWeightBold" className="p-3">
                No User Found
              </Box>
            )}
          </div>
        </Container>

        {this.addSnackBar()}
        {this.addBackdrop()}
        {this.state.showDialog && (
          <AdminMessageDialog
            open={this.state.showDialog}
            onClose={this.handleDialogClose}
          />
        )}
      </Page>
    );
  }
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
          this.setState({
            snackbar: { open: false, level: this.state.snackbar.level },
          })
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
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AdminDashboardPage));
