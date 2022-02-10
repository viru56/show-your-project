import React, { PureComponent } from "react";
import { withRouter } from "react-router";
import Page from "../page";
import PageSpinner from "../PageSpinner";
import {
  Container,
  Paper,
  Grid,
  Box,
  Link,
  Typography,
  CircularProgress,
  Backdrop,
  Snackbar,
  Button,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { updateUser } from "../../store/actions/user_action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PersonIcon from "@material-ui/icons/Person";
import csc from "country-state-city";
import StarBorderSharpIcon from "@material-ui/icons/StarBorderSharp";
import StarSharpIcon from "@material-ui/icons/StarSharp";
import {
  findConnections,
  addConnection,
  findUserWithConnection,
  updateConnection,
  removeConnection,
} from "../../store/actions/connection_action";
import AlertDialog from "../admin/alertDialog";
import linkedin from "../../assets/images/linkedin.svg";
import { sendNotification } from "../../store/actions/notification_action";

/* see other person profile, their interests, ratings */
class ProfileDetails extends PureComponent {
  state = {
    user: null,
    loading: true,
    rating: 0,
    email: "",
    isRequested: false,
    isConnected: false,
    isAccepting: false,
    askConfirmation: false,
    backdrop: false,
    snackbar: {
      open: false,
      title: "",
      message: "",
      level: "",
    },
  };
  upadateRating = async (newRating) => {
    const rating = newRating ? newRating : 0;
    this.setState({ rating });
    const user = { ...this.state.user };
    user.ratings[rating]++;
    try {
      await updateUser(user);
      this.setState({ rating, user });
    } catch (error) {
      console.log(error);
    }
  };
  getAvarageRating = () => {
    const ratings = this.state.user.ratings;
    const rate = Number(
      (
        (ratings[1] +
          ratings[2] * 2 +
          ratings[3] * 3 +
          ratings[4] * 4 +
          ratings[5] * 5) /
        ratings.reduce((a, c) => a + c)
      ).toFixed(2)
    );
    if (rate) {
      return rate;
    }
    return 0;
  };
  componentDidUpdate() {
    if (
      this.state.user &&
      this.state.user.uid !== this.props.match.params.uid
    ) {
      this.getUserDetails();
    }
  }
  componentDidMount = async () => {
    try {
      if (this.props.match.params.uid) {
        await this.props.findConnections(this.props.User.user.email);
        const index = this.props.Connection.connections.findIndex(
          (con) => con.uid === this.props.match.params.uid
        );
        if (index !== -1) {
          const isConnected = this.props.Connection.connections[index]
            .isConnected;
          this.setState({
            isAccepting: isConnected ? false : true,
            isConnected,
          });
        }
        this.getUserDetails();
      } else {
        this.props.history.pop();
      }
    } catch (error) {
      console.log(error);
    }
  };
  getUserDetails = async () => {
    try {
      let isRequested = false;
      let isConnected = false;
      this.setState({ loading: true });
      let user = this.props.User.user;
      if (this.props.User.user.email !== this.props.match.params.uid) {
        user = await findUserWithConnection({
          email: this.props.match.params.uid,
          connectionEmail: this.props.User.user.email,
        });
      }
      if (user) {
        if (user.country && !isNaN(user.country)) {
          user.country = csc.getCountryById(user.country).name;
        }
        if (user.state && !isNaN(user.state)) {
          user.state = csc.getStateById(user.state).name;
        }
        if (user.city && !isNaN(user.city)) {
          user.city = csc.getCityById(user.city).name;
        }
        if (!user.ratings) {
          user.ratings = [0, 0, 0, 0, 0, 0];
        }
        if (user.connection && !this.state.isAccepting) {
          isRequested = true;
          isConnected = user.connection.isConnected;
        }
        this.setState({ loading: false, user, isConnected, isRequested });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      console.log(error);
      this.props.history.pop();
    }
  };
  connect = async () => {
    if (!this.state.isRequested) {
      this.setState({ backdrop: true });
      const connection = {
        name:
          this.props.User.user.firstName[0].toUpperCase() +
          this.props.User.user.firstName.substr(1) +
          " " +
          this.props.User.user.lastName[0].toUpperCase() +
          this.props.User.user.lastName.substr(1),
        email: this.props.User.user.email,
        avatar: this.props.User.user.photoUrl || null,
        uid: this.props.User.user.uid,
        role: this.props.User.user.role,
        to: this.state.user.email,
        isConnected: false,
      };
      await addConnection(connection);
      const snackbar = {
        open: true,
        title: "Request Status",
        message: "Connection request sent successfully",
        level: "success",
      };
      await this.setState({ isRequested: true, backdrop: false, snackbar });
      await sendNotification({
        ...connection,
        senderName: connection.name,
        name:
          this.state.user.firstName[0].toUpperCase() +
          this.state.user.firstName.substr(1) +
          " " +
          this.state.user.lastName[0].toUpperCase() +
          this.state.user.lastName.substr(1),
        sendMail: true,
        role:this.props.User.user.role,
        to: this.state.user.email,
        type: "connect",
      });
    }
  };
  rejectRequest = async () => {
    this.setState({ backdrop: true });
    await this.props.updateConnection({
      type: "reject",
      connectionEmail: this.state.user.email,
      email: this.props.User.user.email,
    });
    this.setState({ backdrop: false, isAccepting: false });
  };
  acceptRequest = async () => {
    this.setState({ backdrop: true });
    const connection = {
      name:
        this.props.User.user.firstName + " " + this.props.User.user.lastName,
      email: this.props.User.user.email,
      avatar: this.props.User.user.photoUrl || null,
      uid:this.props.User.user.uid,
      role: this.props.User.user.role,
      isConnected: true,
    };
    await this.props.updateConnection({
      type: "accept",
      connectionEmail: this.state.user.email,
      connection,
    });
    this.setState({ backdrop: false, isAccepting: false, isConnected: true });
  };
  openConfirmationDialog = () => {
    this.setState({
      askConfirmation: true,
    });
  };
  handleDialogClose = async (isDelete) => {
    if (isDelete) {
      this.setState({ backdrop: true });
      await removeConnection({
        email: this.props.User.user.email,
        connectionEmail: this.state.user.email,
      });
      this.setState({
        backdrop: false,
        isConnected: false,
        isRequested: false,
      });
    }
    this.setState({
      askConfirmation: false,
    });
  };
  userCategory = (category) => {
    const index = category.indexOf("Other");
    if (index > -1) {
      category.splice(index, 1);
      category.push(this.state.user.otherInterest);
    }
    return category.join(", ");
  };
  render() {
    if (this.state.loading) {
      return <PageSpinner color="primary" />;
    }
    return (
      <Page className="Profile-Details-Page">
        <Container fixed>
          <Paper elevation={2} className="paper mb-30">
            {this.state.user ? (
              <>
                <div className="header">
                  <div className="user-photo">
                    {this.state.user.photoUrl ? (
                      <img
                        className="image"
                        src={this.state.user.photoUrl}
                        alt={this.state.user.firstName}
                      />
                    ) : (
                        <PersonIcon className="user-icon" />
                      )}
                  </div>
                </div>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={3}
                  className="main"
                >
                  <Grid item>
                    <Box
                      fontWeight="fontWeightBold"
                      fontSize="1.6rem"
                      className="capital"
                      maxWidth="500px"
                    >
                      {this.state.user.firstName}&nbsp;
                      {this.state.user.lastName}
                      {this.state.user.linkedInProfileUrl && (
                        <Link
                          href={this.state.user.linkedInProfileUrl}
                          target="_blank"
                          className="ml-2"
                        >
                          <img src={linkedin} alt="linkedin" width="32" />
                        </Link>
                      )}
                    </Box>
                    <Box fontSize="1.2rem" className="capital">
                      {this.state.user.role}
                    </Box>
                    <Box
                      fontWeight="fontWeightBold"
                      fontSize="1.2rem"
                      className="capital"
                    >
                      {this.state.user.city && this.state.user.city + ","}
                      &nbsp;
                      {this.state.user.state && this.state.user.state + ","}
                      &nbsp;
                      {this.state.user.country}
                    </Box>

                    { this.state.user?.interests?.length > 0 && (
                      <Box
                        fontSize="1rem"
                        className="mt-5"
                        maxWidth="500px"
                        fontWeight="500"
                      >
                        Industries: &nbsp;
                        {this.userCategory(this.state.user.interests)}
                      </Box>
                    )}

                    {this.state.user.myPitch &&
                      this.state.user.myPitch.length > 0 && (
                        <Box fontSize="0.8remrem">
                          Collaborated on {this.state.user.myPitch.length} {this.state.user.myPitch.length > 1 ? 'Ideas' : 'Idea'}
                        </Box>
                      )}
                    <Box>
                      {this.state.user.phone &&
                        this.props.User.user.role === "admin" && (
                          <Link href={"tel:" + this.state.user.phone}>
                            Phone # {this.state.user.phone}
                          </Link>
                        )}
                    </Box>
                    {this.getAvarageRating() > 0 && (
                      <Box
                        component="div"
                        style={{ display: "flex" }}
                        mt={1}
                        borderColor="transparent"
                      >
                        Rating {this.getAvarageRating()}
                        <StarSharpIcon
                          style={{ fontSize: "0.8rem", margin: "4px" }}
                        />
                      </Box>
                    )}
                  </Grid>
                  <Grid item>
                    <Grid container direction="column">
                      <Grid item>
                        <Box
                          component="fieldset"
                          mb={3}
                          borderColor="transparent"
                          className="capital"
                        >
                          <Typography component="legend">
                            Rate&nbsp;{this.state.user.firstName}&nbsp;
                            {this.state.user.lastName}
                          </Typography>
                          <Rating
                            className="rating"
                            name="rating"
                            emptyIcon={
                              <StarBorderSharpIcon
                                fontSize="inherit"
                                style={{ color: "#000" }}
                              />
                            }
                            value={this.state.rating}
                            onChange={(event, newValue) => {
                              this.upadateRating(newValue);
                            }}
                          />
                        </Box>
                      </Grid>
                      {this.props.User.user.uid !==
                        this.props.match.params.uid && (
                          <Grid item>
                            {this.state.isAccepting ? (
                              <>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  onClick={this.acceptRequest}
                                  className="mr-3"
                                >
                                  Accept request
                              </Button>
                                <Button
                                  color="secondary"
                                  variant="outlined"
                                  onClick={this.rejectRequest}
                                >
                                  Reject
                              </Button>
                              </>
                            ) : this.state.isConnected ? (
                              <Button
                                color="secondary"
                                variant="outlined"
                                onClick={this.openConfirmationDialog}
                              >
                                Remove
                              </Button>
                            ) : (
                                  <Button
                                    color="primary"
                                    variant="outlined"
                                    onClick={this.connect}
                                    disabled={this.state.isRequested}
                                  >
                                    {this.state.isRequested
                                      ? "Request sent"
                                      : "Connect"}
                                  </Button>
                                )}
                          </Grid>
                        )}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : (
                <Box p={3}>
                  There is no user record corresponding to this identifier. The
                  user may have been deleted or not registered with us yet.
                </Box>
              )}
          </Paper>
          {this.state.user && this.state.user.about && (
            <Paper className="mt-3 p-3">
              <Box fontWeight="fontWeightBold" fontSize="1.2rem">
                About me
              </Box>
              <p>{this.state.user.about}</p>
            </Paper>
          )}
        </Container>
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
            root: `snackbar-${
              this.state.snackbar.level ? this.state.snackbar.level : "error"
              }`,
          }}
        />
        <Backdrop
          open={this.state.backdrop}
          style={{ zIndex: 99999, color: "#fff" }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {this.state.askConfirmation && (
          <AlertDialog
            show={this.state.askConfirmation}
            handleClose={this.handleDialogClose}
            message="Do you want to remove this connection?"
          />
        )}
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
    Connection: state.Connection,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      findConnections,
      updateConnection,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProfileDetails));
