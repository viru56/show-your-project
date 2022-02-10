import React, { PureComponent } from "react";
import GetAppIcon from "@material-ui/icons/GetApp";
import EditIcon from "@material-ui/icons/Edit";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import {
  Grid,
  Typography,
  Divider,
  Link,
  Snackbar,
  Container,
  Backdrop,
  CircularProgress,
  Button,
  IconButton,
  Box,
  Paper,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  findIdeaDetails,
  updateIdeaDetails,
  downLoadPDF,
  deleteIdea,
} from "../../store/actions/pitch_action";
import { sendNotification } from "../../store/actions/notification_action";
import {
  findAllUsers,
  updateUserDetails,
  findUser,
  updateUser,
  addUser,
  findUserDetails,
} from "../../store/actions/user_action";
import PageSpinner from "../PageSpinner";
import Page from "../page";
import Skeleton from "@material-ui/lab/Skeleton";
import UserCard from "../Users/userCard";
import TeamPermissionsDialog from "./teamPermissionsDialog";
import IdeaChat from "./ideaChat";
import ShareIdeaDialog from "./shareIdeaDialog";
import defaultImage from "../../assets/images/quick-pitch.png";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ShareIcon from "@material-ui/icons/Share";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AlertDialog from "../admin/alertDialog";
import { firebaseIdeas } from "../../libs/config";

/* show idea details, ivestor and experts to whom you can connect, your team, and idea chat */
class DetailsIdea extends PureComponent {
  state = {
    downloading: false,
    shareIdeaDialogOpen: false,
    teamDialogOpen: false,
    investors: [],
    experts: [],
    entrepreneurs: [],
    allUsers: [],
    pitchCreator: null,
    canConnect: true,
    loading: true,
    showEntrepreneurs: false,
    showExpert: false,
    idea: null,
    imageLoading: true,
    askConfirmation: false,
    backdrop: false,
    isWriteAccess: false,
    isAdminAccess: false,
    snackbar: {
      open: false,
      title: "",
      message: "",
      level: "",
    },
  };
  ideaObserver = null;
  setSnackbar = (snackbar) => this.setState({ snackbar });

  async componentDidMount() {
    if (this.props.match.params.id) {
      await this.props.findUserDetails(this.props.User.user.email);
      this.ideaObserver = firebaseIdeas
        .doc(this.props.match.params.id)
        .onSnapshot((doc) => {
          const idea = doc.data();
          idea.id = doc.id;
          this.setState({ idea, loading: false });
          this.checkAdminAccess();
          this.checkWriteAccess();
          this.getAllUsers();
          this.getPitchUser();
          this.props.findUserDetails(this.props.User.user.email);
        });
    } else {
      this.props.history.goBack();
    }
  }
  componentWillUnmount() {
    if (this.ideaObserver) this.ideaObserver();
  }
  componentDidUpdate() {
    if (this.state.idea && this.state.idea.id !== this.props.match.params.id) {
      this.setState({ loading: true });
      this.getIdea(this.props.match.params.id);
    }
  }
  getAllUsers = async () => {
    await this.props.findAllUsers(this.props.User.user.email);
    const investors = [];
    const experts = [];
    const entrepreneurs = [];
    if (this.props.User.users && this.props.User.users.length > 0) {
      for (let user of this.props.User.users) {
        if (!(user.myPitch && user.myPitch.includes(this.state.idea.id))) {
          if (
            (this.props.User.user.requests &&
              this.props.User.user.requests.some(
                (req) =>
                  req.email === user.email && req.pitchId === this.state.idea.id
              )) ||
            (user.requests &&
              user.requests.some((u) => u.pitchId === this.state.idea.id))
          ) {
            user.isRequested = true;
          }
          if (user.role === "investor") {
            if (investors.length < 4) {
              investors.push(user);
            } else {
              const index = investors.findIndex((u) => !!u.isRequested);
              if (index !== -1) {
                investors.splice(index, 1);
                investors.push(user);
              }
            }
          } else if (user.role === "expert") {
            if (experts.length < 4) {
              experts.push(user);
            } else {
              const index = experts.findIndex((u) => !!u.isRequested);
              if (index !== -1) {
                experts.splice(index, 1);
                experts.push(user);
              }
            }
          } else if (user.role === "entrepreneur") {
            if (entrepreneurs.length < 4) {
              entrepreneurs.push(user);
            } else {
              const index = entrepreneurs.findIndex((u) => !!u.isRequested);
              if (index !== -1) {
                entrepreneurs.splice(index, 1);
                entrepreneurs.push(user);
              }
            }
          }
        }
      }
      this.setState({
        investors,
        experts,
        entrepreneurs,
        allUsers: this.props.User.users,
      });
    }
  };
  getIdea = async (id) => {
    await this.props.findIdeaDetails(id);
    if (this.props.Idea.idea !== null) {
      await this.setState({ loading: false, idea: this.props.Idea.idea });
      this.getAllUsers();
      this.getPitchUser();
      this.checkAdminAccess();
      this.checkWriteAccess();
    } else {
      this.props.history.push("/");
    }
  };
  handleLike = async () => {
    const idea = { ...this.state.idea };
    const chat = idea.chat ? { ...this.state.idea.chat } : {};
    const data = {
      createdAt: new Date(),
      email: this.props.User.user.email,
    };
    if (chat.likes && chat.likes.length > 0) {
      if (chat.likes.findIndex((like) => like.email === data.email) !== -1) {
        const snackbar = {
          open: true,
          title: "Upvoted Idea",
          message: "You have already upvoted this idea",
          level: "info",
        };
        this.setSnackbar(snackbar);
        return;
      } else {
        chat.likes.push(data);
      }
    } else {
      chat.likes = [data];
    }
    if (chat.dislikes && chat.dislikes.length > 0) {
      var index = chat.dislikes.findIndex((like) => like.email === data.email);
      if (index > -1) {
        chat.dislikes.splice(index, 1);
      }
    }
    idea.chat = chat;
    await this.setState({ idea });
    // send notification
    if (this.state.idea.email !== this.props.User.user.email) {
      const notification = {
        to: this.state.idea.email,
        from: this.props.User.user.email,
        pitchId: this.state.idea.id,
        pitchTitle: this.state.idea.title,
        avatar: this.props.User.user.photoUrl || null,
        name: this.state.idea.createdBy,
        type: "vote",
        sendMail: true,
      };
      await sendNotification(notification);
    }
    await this.props.updateIdeaDetails(idea);
    if (this.props.Idea.error) {
      console.log(this.props.Idea.error);
    }
  };

  handleDislike = async () => {
    const idea = { ...this.state.idea };
    const chat = idea.chat ? { ...this.state.idea.chat } : {};
    const data = {
      createdAt: new Date(),
      email: this.props.User.user.email,
    };
    if (chat.dislikes && chat.dislikes.length > 0) {
      if (
        chat.dislikes.findIndex((dislike) => dislike.email === data.email) !==
        -1
      ) {
        const snackbar = {
          open: true,
          title: "Downvoted Idea",
          message: "You have already downvoted this idea",
          level: "info",
        };
        this.setSnackbar(snackbar);
        return;
      } else {
        chat.dislikes.push(data);
      }
    } else {
      chat.dislikes = [data];
    }
    if (chat.likes && chat.likes.length > 0) {
      var index = chat.likes.findIndex((like) => like.email === data.email);
      if (index > -1) {
        chat.likes.splice(index, 1);
      }
    }
    // const snackbar = {
    //   open: true,
    //   title: "Downvoted Idea",
    //   message: "You have downvoted this idea",
    //   level: "success",
    // };
    idea.chat = chat;
    await this.setState({ idea });
    // this.setSnackbar(snackbar);
    if (this.state.idea.email !== this.props.User.user.email) {
      const notification = {
        to: this.state.idea.email,
        from: this.props.User.user.email,
        pitchTitle: this.state.idea.title,
        pitchId: this.state.idea.id,
        avatar: this.props.User.user.photoUrl || null,
        name: this.state.idea.createdBy,
        type: "vote",
        sendMail: true,
      };
      await sendNotification(notification);
    }
    await this.props.updateIdeaDetails(idea);
    if (this.props.Idea.error) {
      console.log(this.props.Idea.error);
    }
    // send notification
  };
  handleShareIdeaDialogOpen = async () => {
    this.setState({ shareIdeaDialogOpen: true });
  };
  handleShareIdeaDialogClose = (idea) => {
    if (idea) {
      const snackbar = {
        open: true,
        title: "Idea shared successfully",
        message: "",
        level: "success",
      };
      this.setSnackbar(snackbar);
    }
    this.setState({ shareIdeaDialogOpen: false });
  };
  getPitchUser = async () => {
    const doc = await findUser(this.state.idea.email);
    const canConnect = !(
      (doc.data().requests &&
        doc
          .data()
          .requests.some(
            (req) =>
              req.pitchId === this.state.idea.id &&
              req.email === this.props.User.user.email
          )) ||
      (this.props.User.user.requests &&
        this.props.User.user.requests.some(
          (req) => req.pitchId === this.state.idea.id
        ))
    );
    await this.setState({ pitchCreator: doc.data(), canConnect });
  };
  requestToCollaborate = async () => {
    this.setState({ backdrop: true });
    await this.getPitchUser();
    const request = {
      pitchId: this.state.idea.id,
      pitchTitle: this.state.idea.title,
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
    const requests = this.state.pitchCreator.requests || [];
    requests.unshift(request);
    await updateUser({ email: this.state.pitchCreator.email, requests });
    const snackbar = {
      open: true,
      title: "Connection Request",
      message: "Request sent successfully",
      level: "success",
    };
    this.setState({ snackbar, backdrop: false, canConnect: false });
    const notification = {
      to: this.state.pitchCreator.email,
      from: this.props.User.user.email,
      senderName:
        this.props.User.user.firstName[0].toUpperCase() +
        this.props.User.user.firstName.substr(1) +
        " " +
        this.props.User.user.lastName[0].toUpperCase() +
        this.props.User.user.lastName.substr(1),
      name:
        this.state.pitchCreator.firstName[0].toUpperCase() +
        this.state.pitchCreator.firstName.substr(1) +
        " " +
        this.state.pitchCreator.lastName[0].toUpperCase() +
        this.state.pitchCreator.lastName.substr(1),
      pitchId: this.state.idea.id,
      pitchTitle: this.state.idea.title,
      role: this.props.User.user.role,
      avatar: this.props.User.user.photoUrl || null,
      type: "collaborate",
      sendMail: true,
    };
    await sendNotification(notification);
  };
  connect = async (user, access) => {
    let isNewRequest = true;
    this.setState({ backdrop: true });
    const request = {
      pitchId: this.state.idea.id,
      pitchTitle: this.state.idea.title,
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
      access: access || "read",
    };
    let requests = [];
    if (user.requests && user.requests.length > 0) {
      requests = user.requests;
      if (requests.findIndex((req) => req.pitchId === request.pitchId) === -1) {
        requests.unshift(request);
      } else {
        isNewRequest = false;
      }
    } else {
      requests.push(request);
    }
    const snackbar = {
      open: true,
      title: "Connection Request",
      message: "Request sent successfully",
      level: "success",
    };
    if (isNewRequest) {
      await addUser({ email: user.email, requests });
      this.getAllUsers();
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
        pitchId: this.state.idea.id,
        pitchTitle: this.state.idea.title,
        avatar: this.props.User.user.photoUrl || null,
        type: access ? "invite" : "inviteExpertOrInvestor",
        sendMail: true,
      };
      await sendNotification(notification);
    }
    await this.setState({ snackbar, backdrop: false, canConnect: false });
  };
  inviteTeamMember = async (email, access) => {
    const doc = await findUser(email);
    let user = {
      email,
      firstName: "new",
      lastName: "user",
    };
    if (doc.exists) {
      user = doc.data();
    }
    this.connect(user, access);
  };
  showTeamDetails = () => {
    return (
      <div className="title">
        <Typography className="name" variant="body2">
          Team Members &nbsp;
          {this.state.isAdminAccess && (
            <Typography
              component="span"
              className="edit-team"
              onClick={this.handleTeamPermissionsDialogOpen}
            >
              <EditIcon
                className="mr-1"
                fontSize="inherit"
                style={{ color: "#1a5749" }}
              />
              Edit
            </Typography>
          )}
        </Typography>
        <Typography variant="body2" className="team">
          {this.state.idea.team.map((t, i) => (
            <span
              key={i}
              onClick={() => this.props.history.push("/profile/" + t.uid)}
            >
              {t.name} (Entrepreneur) <br />
            </span>
          ))}
          {this.state.idea.entrepreneurs.map((t, i) => (
            <span
              key={i}
              onClick={() => this.props.history.push("/profile/" + t.uid)}
            >
              {t.name} (Entrepreneur)
              <br />
            </span>
          ))}
          {this.state.idea.experts.map((t, i) => (
            <span
              key={i}
              onClick={() => this.props.history.push("/profile/" + t.uid)}
            >
              {t.name} (Expert) <br />
            </span>
          ))}
          {this.state.idea.investors.map((t, i) => (
            <span
              key={i}
              onClick={() => this.props.history.push("/profile/" + t.uid)}
            >
              {t.name} (Investor)
              <br />
            </span>
          ))}
        </Typography>
      </div>
    );
  };
  handleTeamPermissionsDialogClose = async (data) => {
    if (data) {
      this.setState({ teamDialogOpen: false, backdrop: true });
      if (data.inviteTeamMember.length > 0) {
        for (let teamMember of data.inviteTeamMember) {
          await this.inviteTeamMember(teamMember.email, teamMember.access);
        }
      }
      if (data.deletedUsers.length > 0) {
        for (let du of data.deletedUsers) {
          const user = this.state.allUsers.find((user) => user.email === du);
          if (user) {
            if (user.myPitch)
              user.myPitch.splice(user.myPitch.indexOf(this.state.idea.id), 1);
            else user.myPitch = [];
            delete user.isRequested;
            await updateUser({ email: user.email, myPitch: user.myPitch });
          }
        }
      }
      if (data.pendingRequests.length > 0) {
        for (let pr of data.pendingRequests) {
          const user = this.state.allUsers.find(
            (user) => user.email === pr.email
          );
          if (user) {
            if (pr.deleted) {
              user.requests.splice(
                user.requests.findIndex(
                  (req) => req.pitchId === this.state.idea.id
                ),
                1
              );
            } else {
              user.requests.forEach((req) => {
                if (req.pitchId === this.state.idea.id) req.access = pr.access;
              });
            }
            await updateUser({ email: user.email, requests: user.requests });
          }
        }
      }
      await this.props.updateIdeaDetails(data.idea);
      const snackbar = {
        open: true,
        title: "Permission Status",
        message: "Permissions updated successfully",
        level: "success",
      };
      this.getAllUsers();
      await this.setState({ backdrop: false, snackbar });
    } else {
      this.setState({ teamDialogOpen: false });
    }
  };
  handleTeamPermissionsDialogOpen = async () => {
    if (!this.props.User.users || this.props.User.users.length === 0) {
      await this.props.findAllUsers(this.props.User.user.email);
    }
    await this.setState({ teamDialogOpen: true });
  };
  checkAdminAccess = () => {
    const email = this.props.User.user.email;
    const isAdminAccess =
      this.state.idea.email === email ||
      this.state.idea.team.some(
        (user) => user.email === email && user.access === "admin"
      ) ||
      this.state.idea.entrepreneurs.some(
        (user) => user.email === email && user.access === "admin"
      ) ||
      this.state.idea.experts.some(
        (user) => user.email === email && user.access === "admin"
      ) ||
      this.state.idea.investors.some(
        (user) => user.email === email && user.access === "admin"
      );
    this.setState({ isAdminAccess });
  };
  checkWriteAccess = () => {
    const email = this.props.User.user.email;
    const isWriteAccess =
      this.state.idea.email === email ||
      this.state.idea.team.some(
        (user) =>
          user.email === email &&
          (user.access === "write" || user.access === "admin")
      ) ||
      this.state.idea.entrepreneurs.some(
        (user) =>
          user.email === email &&
          (user.access === "write" || user.access === "admin")
      ) ||
      this.state.idea.experts.some(
        (user) =>
          user.email === email &&
          (user.access === "write" || user.access === "admin")
      ) ||
      this.state.idea.investors.some(
        (user) =>
          user.email === email &&
          (user.access === "write" || user.access === "admin")
      );
    this.setState({ isWriteAccess });
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
  downLoadPDF = async (event) => {
    event.preventDefault();
    try {
      this.setState({ downloading: true });
      const data = {
        createdBy: this.props.Idea.idea.createdBy,
        title: this.props.Idea.idea.title,
        description: this.props.Idea.idea.description,
        files: this.props.Idea.idea.files,
        images: this.props.Idea.idea.images,
        solutionToOffer: this.props.Idea.idea.solutionToOffer,
        solutionDelivery: this.props.Idea.idea.solutionDelivery,
        problemToSolve: this.props.Idea.idea.problemToSolve,
        strategy: this.props.Idea.idea.strategy,
        competition: this.props.Idea.idea.competition,
        swotAnalysis: this.props.Idea.idea.swotAnalysis,
        ideaDescrition: this.props.Idea.idea.ideaDescrition,
        implementationModel: this.props.Idea.idea.implementationModel,
        funds: this.props.Idea.idea.funds,
        financialModel: this.props.Idea.idea.financialModel,
      };
      const result = await downLoadPDF(data);

      if (!result) {
        const snackbar = {
          open: true,
          title: "Download idea",
          message: "Server Error in downloading idea, Please try again later",
          level: "error",
        };
        this.setState({ snackbar });
      }
      this.setState({ downloading: false });
    } catch (error) {
      console.log(error);
    }
  };
  getIdeaLikeDislikeCount() {
    let count = 0;
    if (this.state.idea.chat) {
      if (this.state.idea.chat.likes && this.state.idea.chat.likes.length > 0) {
        count += this.state.idea.chat.likes.length;
      }
      if (
        this.state.idea.chat.dislikes &&
        this.state.idea.chat.dislikes.length > 0
      ) {
        count -= this.state.idea.chat.dislikes.length;
      }
    }
    return count;
  }
  userLikedIdea() {
    let liked = false;
    if (
      this.state.idea.chat &&
      this.state.idea.chat.likes &&
      this.state.idea.chat.likes.length > 0
    ) {
      liked = this.state.idea.chat.likes.some(
        (u) => u.email === this.props.User.user.email
      );
    }
    return liked;
  }
  userDislikedIdea() {
    let disliked = false;
    if (
      this.state.idea.chat &&
      this.state.idea.chat.dislikes &&
      this.state.idea.chat.dislikes.length > 0
    ) {
      disliked = this.state.idea.chat.dislikes.some(
        (u) => u.email === this.props.User.user.email
      );
    }
    return disliked;
  }
  bookmarkIdea = async () => {
    const user = { ...this.props.User.user };
    let title = "Idea Added";
    let message = "Your idea has been added to Favourites";
    const ideaIndex = this.props.User.user.savedIdeas
      ? this.props.User.user.savedIdeas.indexOf(this.state.idea.id)
      : -1;
    if (ideaIndex > -1) {
      user.savedIdeas.splice(ideaIndex, 1);
      title = "Idea Removed";
      message = "Your idea has been removed from Favourites";
    } else {
      user.savedIdeas
        ? user.savedIdeas.push(this.state.idea.id)
        : (user.savedIdeas = [this.state.idea.id]);
    }
    await this.props.updateUserDetails(user);
    const snackbar = {
      open: true,
      title,
      message,
      level: "info",
    };
    this.setState({ snackbar });
  };
  handleDialogClose = async (isDelete) => {
    if (isDelete) {
      this.setState({ backdrop: true });
      await deleteIdea(this.state.idea.id);
      this.props.history.push("/");
    }
    this.setState({ askConfirmation: false });
  };
  ideaCategory = () => {
    const category = [...this.state.idea.category];
    const index = category.indexOf("Other");
    if (index > -1) {
      category.splice(index, 1);
      category.push(this.state.idea.otherInterest);
    }
    return category.join(", ");
  };
  render() {
    if (this.state.loading) {
      return <PageSpinner />;
    }
    return (
      <Page className="detailsPitch p-3">
        <div className="m-3" id="detailsPitch">
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Grid item>
                  <IconButton
                    aria-label="upvote"
                    size="small"
                    className="p-0 no-outline"
                    onClick={this.handleLike}
                  >
                    <ArrowDropUpIcon
                      fontSize="large"
                      style={{ color: this.userLikedIdea() ? "green" : null }}
                    ></ArrowDropUpIcon>
                  </IconButton>
                </Grid>
                <Grid item>
                  <Box className="pl-2" style={{ lineHeight: 0.5 }}>
                    {this.getIdeaLikeDislikeCount().toString().length === 1 ? (
                      <span>&nbsp;{this.getIdeaLikeDislikeCount()}</span>
                    ) : (
                      <span>{this.getIdeaLikeDislikeCount()}</span>
                    )}
                  </Box>
                </Grid>
                <Grid item>
                  <IconButton
                    aria-label="downvote"
                    className="p-0 no-outline"
                    size="small"
                    onClick={this.handleDislike}
                  >
                    <ArrowDropDownIcon
                      fontSize="large"
                      style={{ color: this.userDislikedIdea() ? "red" : null }}
                    ></ArrowDropDownIcon>
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h5" className="idea-title">
                {this.state.idea.title}
              </Typography>
            </Grid>
            <Grid item>
              {this.state.isWriteAccess && (
                <Button
                  style={{ textTransform: "inherit" }}
                  className="edit-pitch no-outline"
                  onClick={() =>
                    this.props.history.push("/edit-pitch/" + this.state.idea.id)
                  }
                >
                  <EditIcon
                    style={{ fontSize: "1rem", color: "#1a5749" }}
                    className="mr-2"
                  />
                  Edit Idea
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} ld={8} md={8} sm={12}>
              <Grid item xs={12}>
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={12} ld={4} md={4} className="noprint">
                    <Divider style={{ height: "4px", background: "green" }} />
                    <div className="title">
                      <Typography className="name capital" variant="h6">
                        Entrepreneur
                      </Typography>
                      <Typography className="type capital" variant="body2">
                        {this.state.idea.createdBy}
                      </Typography>
                    </div>
                    {this.state.idea.totalFunding && (
                      <div className="title">
                        <Typography className="name capital" variant="h6">
                          Invested (USD)
                        </Typography>
                        <Typography className="type" variant="body2">
                          $
                          {new Intl.NumberFormat("en-CA", {
                            maximumSignificantDigits: 3,
                          }).format(this.state.idea.totalFunding)}
                        </Typography>
                      </div>
                    )}
                    {this.state.idea.requiredFunding && (
                      <div className="title">
                        <Typography className="name capital" variant="h6">
                          Required (USD)
                        </Typography>
                        <Typography className="type" variant="body2">
                          {this.state.idea.requiredFunding}
                        </Typography>
                      </div>
                    )}
                    {this.state.idea.stage && (
                      <div className="title">
                        <Typography className="name capital" variant="h6">
                          Stage
                        </Typography>
                        <Typography className="type" variant="body2">
                          {this.state.idea.stage}
                        </Typography>
                      </div>
                    )}
                    {this.state.idea.category &&
                      this.state.idea.category.length > 0 && (
                        <div className="title">
                          <Typography className="name capital" variant="h6">
                            Category
                          </Typography>
                          <Typography className="type" variant="body2">
                            {this.ideaCategory()}
                          </Typography>
                        </div>
                      )}
                    {this.showTeamDetails()}

                    {this.state.idea.websiteUrl && (
                      <div className="title">
                        <Typography className="name capital" variant="h6">
                          Website Url
                        </Typography>
                        <Link
                          href={
                            this.state.idea.websiteUrl.startsWith("http")
                              ? this.state.idea.websiteUrl
                              : "//" + this.state.idea.websiteUrl
                          }
                          target="__blank"
                        >
                          {this.state.idea.websiteUrl}
                        </Link>
                      </div>
                    )}

                    {this.state.idea.files.pitchFiles.length > 0 && (
                      <div className="title">
                        <Button
                          style={{ textTransform: "inherit", paddingLeft: 0 }}
                          href={this.state.idea.files.pitchFiles[0].url}
                          target="__blank"
                          download
                        >
                          <GetAppIcon
                            size="large"
                            style={{ color: "#1a5749" }}
                            className="mr-2"
                          />
                          Download Investor Pitch
                        </Button>
                      </div>
                    )}

                    {this.state.idea.files.quickPitchFiles &&
                      this.state.idea.files.quickPitchFiles.length > 0 && (
                        <div className="title">
                          <Button
                            style={{ textTransform: "inherit", paddingLeft: 0 }}
                            href={this.state.idea.files.quickPitchFiles[0].url}
                            download
                          >
                            <GetAppIcon
                              size="large"
                              style={{ color: "#1a5749" }}
                              className="mr-2"
                            />
                            Download Attachment
                          </Button>
                        </div>
                      )}

                    <div className="title">
                      {!this.state.isWriteAccess &&
                        this.props.User.user.role !== "admin" &&
                        !(
                          this.props.User.user.myPitch &&
                          this.props.User.user.myPitch.includes(
                            this.state.idea.id
                          )
                        ) && (
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "#1a5749",
                              color: "#fff",
                              textTransform: "inherit",
                            }}
                            onClick={this.requestToCollaborate}
                            className="no-outline"
                            disabled={!this.state.canConnect}
                          >
                            {!this.state.canConnect
                              ? "Requested"
                              : "Collaborate in this idea"}
                          </Button>
                        )}
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    ld={8}
                    md={8}
                    id="detailsPitch"
                    style={{ position: "relative" }}
                  >
                    <div className="imageContainer">
                      {this.state.imageLoading && (
                        <Skeleton
                          animation="wave"
                          variant="rect"
                          height="435px"
                          className="idea-image"
                        />
                      )}
                      <img
                        src={
                          this.state.idea.images.pitchImages.length > 0
                            ? this.state.idea.images.pitchImages[0].url
                            : defaultImage
                        }
                        alt={
                          this.state.idea.images.pitchImages.length > 0
                            ? this.state.idea.images.pitchImages[0].name
                            : "title"
                        }
                        onLoad={async () =>
                          await this.setState({ imageLoading: false })
                        }
                        style={
                          this.state.imageLoading
                            ? { visibility: "hidden" }
                            : { visibility: "visible" }
                        }
                        className="idea-image"
                        id="pitchImg"
                      />
                    </div>

                    <Grid
                      container
                      justifyContent="space-evenly"
                      alignItems="flex-start"
                    >
                      <Grid item>
                        <Button
                          onClick={this.downLoadPDF}
                          style={{ textTransform: "inherit" }}
                          disabled={this.state.downloading}
                        >
                          {this.state.downloading ? (
                            <CircularProgress
                              color="primary"
                              className="mr-2"
                              size={18}
                              thickness={4}
                            />
                          ) : (
                            <CloudDownloadIcon
                              size="large"
                              style={{ color: "#1a5749" }}
                              className="mr-2"
                            />
                          )}
                          Download Idea
                        </Button>
                      </Grid>

                      <Grid item>
                        {this.props.User.user.role !== "entrepreneur" && (
                          <Button
                            onClick={this.bookmarkIdea}
                            style={{ textTransform: "inherit" }}
                          >
                            {this.props.User.user.savedIdeas &&
                            this.props.User.user.savedIdeas.indexOf(
                              this.state.idea.id
                            ) > -1 ? (
                              <StarIcon
                                className="icon"
                                style={{ color: "#1a5749" }}
                              />
                            ) : (
                              <StarBorderIcon
                                className="icon icon-bottom"
                                style={{ color: "#1a5749" }}
                              />
                            )}
                            Mark as Favourite
                          </Button>
                        )}
                      </Grid>
                      <Grid item>
                        <Button
                          onClick={this.handleShareIdeaDialogOpen}
                          style={{ textTransform: "inherit" }}
                        >
                          <ShareIcon
                            className="mr-2"
                            style={{ color: "#1a5749" }}
                          />
                          Share Idea
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <hr className="mt-5 mb-0" />

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom className="noprint">
                    Brief description
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {this.state.idea.description}
                  </Typography>
                </Grid>
                <hr />
                <Grid item xs={12} className="mb-3">
                  <Typography variant="h6" gutterBottom>
                    Problem/Challenge you are trying to solve
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {this.state.idea.problemToSolve}
                  </Typography>
                  <Grid container spacing={1}>
                    {this.state.idea.images.problemToSolve.length > 0 &&
                      this.state.idea.images.problemToSolve.map(
                        (image, index) => (
                          <Grid item key={index} xs={12} ld={3} md={3} sm={6}>
                            <img
                              src={image.url}
                              alt={image.name}
                              width="100%"
                            />
                          </Grid>
                        )
                      )}
                    {this.state.idea.videos.problemToSolve.length > 0 &&
                      this.state.idea.videos.problemToSolve.map(
                        (video, index) => (
                          <Grid item key={index} xs={12} ld={3} md={3} sm={6}>
                            <video
                              controls
                              className="noprint"
                              width="100%"
                              style={{ border: "1px solid #ccc" }}
                            >
                              <source src={video.url} type="video/mp4" />
                            </video>
                          </Grid>
                        )
                      )}
                  </Grid>
                </Grid>
                <hr />
                <Grid item xs={12} className="mb-3">
                  <Typography variant="h6" gutterBottom>
                    Solution you are offering
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {this.state.idea.solutionToOffer}
                  </Typography>
                  <Grid container spacing={1}>
                    {this.state.idea.images.solutionToOffer.length > 0 &&
                      this.state.idea.images.solutionToOffer.map(
                        (image, index) => (
                          <Grid item key={index} xs={12} ld={3} md={3} sm={6}>
                            <img
                              src={image.url}
                              alt={image.name}
                              width="100%"
                            />
                          </Grid>
                        )
                      )}
                    {this.state.idea.videos.solutionToOffer.length > 0 &&
                      this.state.idea.videos.solutionToOffer.map(
                        (video, index) => (
                          <Grid item key={index} xs={12} ld={3} md={3} sm={6}>
                            <video
                              controls
                              className="noprint"
                              width="100%"
                              style={{ border: "1px solid #ccc" }}
                            >
                              <source src={video.url} type="video/mp4" />
                            </video>
                          </Grid>
                        )
                      )}
                  </Grid>
                </Grid>
                <hr />
                <Grid item xs={12} className="mb-3">
                  <Typography variant="h6" gutterBottom>
                    The team
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {this.state.idea.solutionDelivery}
                  </Typography>
                  <Grid container spacing={1}>
                    {this.state.idea.images.solutionDelivery.length > 0 &&
                      this.state.idea.images.solutionDelivery.map(
                        (image, index) => (
                          <Grid item key={index} xs={12} ld={3} md={3} sm={6}>
                            <img
                              src={image.url}
                              alt={image.name}
                              width="100%"
                            />
                          </Grid>
                        )
                      )}
                    {this.state.idea.videos.solutionDelivery.length > 0 &&
                      this.state.idea.videos.solutionDelivery.map(
                        (video, index) => (
                          <Grid item key={index} xs={12} ld={3} md={3} sm={6}>
                            <video
                              controls
                              className="noprint"
                              width="100%"
                              style={{ border: "1px solid #ccc" }}
                            >
                              <source src={video.url} type="video/mp4" />
                            </video>
                          </Grid>
                        )
                      )}
                  </Grid>
                </Grid>
                {this.state.idea.strategy && (
                  <>
                    <hr />
                    <Grid item xs={12} className="mb-3">
                      <Typography variant="h6" gutterBottom>
                        Describe the market size and penetration strategy
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {this.state.idea.strategy}
                      </Typography>
                    </Grid>
                    {this.state.idea.files.investorPitchFiles &&
                      this.state.idea.files.investorPitchFiles.strategy &&
                      this.state.idea.files.investorPitchFiles.strategy.length >
                        0 && (
                        <Grid container spacing={1}>
                          {this.state.idea.files.investorPitchFiles.strategy.map(
                            (image, index) => (
                              <Grid
                                item
                                key={index}
                                xs={12}
                                ld={3}
                                md={3}
                                sm={6}
                              >
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  width="100%"
                                  style={{
                                    maxHeight: 200,
                                    objectFit: "contain",
                                  }}
                                />
                              </Grid>
                            )
                          )}
                        </Grid>
                      )}
                  </>
                )}
                {this.state.idea.competition && (
                  <>
                    <hr />
                    <Grid item xs={12} className="mb-3">
                      <Typography variant="h6" gutterBottom>
                        Describe your competition
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {this.state.idea.competition}
                      </Typography>
                    </Grid>
                    {this.state.idea.files.investorPitchFiles &&
                      this.state.idea.files.investorPitchFiles.competition &&
                      this.state.idea.files.investorPitchFiles.competition
                        .length > 0 && (
                        <Grid container spacing={1}>
                          {this.state.idea.files.investorPitchFiles.competition.map(
                            (image, index) => (
                              <Grid
                                item
                                key={index}
                                xs={12}
                                ld={3}
                                md={3}
                                sm={6}
                              >
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  width="100%"
                                  style={{
                                    maxHeight: 200,
                                    objectFit: "contain",
                                  }}
                                />
                              </Grid>
                            )
                          )}
                        </Grid>
                      )}
                  </>
                )}
                {this.state.idea.swotAnalysis && (
                  <>
                    <hr />
                    <Grid item xs={12} className="mb-3">
                      <Typography variant="h6" gutterBottom>
                        SWOT Analysis
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {this.state.idea.swotAnalysis}
                      </Typography>
                    </Grid>
                    {this.state.idea.files.investorPitchFiles &&
                      this.state.idea.files.investorPitchFiles.swotAnalysis &&
                      this.state.idea.files.investorPitchFiles.swotAnalysis
                        .length > 0 && (
                        <Grid container spacing={1}>
                          {this.state.idea.files.investorPitchFiles.swotAnalysis.map(
                            (image, index) => (
                              <Grid
                                item
                                key={index}
                                xs={12}
                                ld={3}
                                md={3}
                                sm={6}
                              >
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  width="100%"
                                  style={{
                                    maxHeight: 200,
                                    objectFit: "contain",
                                  }}
                                />
                              </Grid>
                            )
                          )}
                        </Grid>
                      )}
                  </>
                )}
                {this.state.idea.ideaDescrition && (
                  <>
                    <hr />
                    <Grid item xs={12} className="mb-3">
                      <Typography variant="h6" gutterBottom>
                        Why is this a good time to launch your idea
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {this.state.idea.ideaDescrition}
                      </Typography>
                    </Grid>
                    {this.state.idea.files.investorPitchFiles &&
                      this.state.idea.files.investorPitchFiles.ideaDescrition &&
                      this.state.idea.files.investorPitchFiles.ideaDescrition
                        .length > 0 && (
                        <Grid container spacing={1}>
                          {this.state.idea.files.investorPitchFiles.ideaDescrition.map(
                            (image, index) => (
                              <Grid
                                item
                                key={index}
                                xs={12}
                                ld={3}
                                md={3}
                                sm={6}
                              >
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  width="100%"
                                  style={{
                                    maxHeight: 200,
                                    objectFit: "contain",
                                  }}
                                />
                              </Grid>
                            )
                          )}
                        </Grid>
                      )}
                  </>
                )}
                
                {this.state.idea.implementationModel && (
                  <>
                    <hr />
                    <Grid item xs={12} className="mb-3">
                      <Typography variant="h6" gutterBottom>
                        The implementation model
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {this.state.idea.implementationModel}
                      </Typography>
                    </Grid>
                    {this.state.idea.files.investorPitchFiles &&
                      this.state.idea.files.investorPitchFiles
                        .implementationModel &&
                      this.state.idea.files.investorPitchFiles
                        .implementationModel.length > 0 && (
                        <Grid container spacing={1}>
                          {this.state.idea.files.investorPitchFiles.implementationModel.map(
                            (image, index) => (
                              <Grid
                                item
                                key={index}
                                xs={12}
                                ld={3}
                                md={3}
                                sm={6}
                              >
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  width="100%"
                                  style={{
                                    maxHeight: 200,
                                    objectFit: "contain",
                                  }}
                                />
                              </Grid>
                            )
                          )}
                        </Grid>
                      )}
                  </>
                )}
                {this.state.idea.funds && (
                  <>
                    <hr />
                    <Grid item xs={12} className="mb-3">
                      <Typography variant="h6" gutterBottom>
                        Source and use of funds
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {this.state.idea.funds}
                      </Typography>
                    </Grid>
                    {this.state.idea.files.investorPitchFiles &&
                      this.state.idea.files.investorPitchFiles.funds &&
                      this.state.idea.files.investorPitchFiles.funds.length >
                        0 && (
                        <Grid container spacing={1}>
                          {this.state.idea.files.investorPitchFiles.funds.map(
                            (image, index) => (
                              <Grid
                                item
                                key={index}
                                xs={12}
                                ld={3}
                                md={3}
                                sm={6}
                              >
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  width="100%"
                                  style={{
                                    maxHeight: 200,
                                    objectFit: "contain",
                                  }}
                                />
                              </Grid>
                            )
                          )}
                        </Grid>
                      )}
                  </>
                )}
                {this.state.idea.financialModel && (
                  <>
                    <hr />
                    <Grid item xs={12} className="mb-3">
                      <Typography variant="h6" gutterBottom>
                        Financial model/Projections and key ratios
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {this.state.idea.financialModel}
                      </Typography>
                    </Grid>
                    {this.state.idea.files.investorPitchFiles &&
                      this.state.idea.files.investorPitchFiles.financialModel &&
                      this.state.idea.files.investorPitchFiles.financialModel
                        .length > 0 && (
                        <Grid container spacing={1}>
                          {this.state.idea.files.investorPitchFiles.financialModel.map(
                            (image, index) => (
                              <Grid
                                item
                                key={index}
                                xs={12}
                                ld={3}
                                md={3}
                                sm={6}
                              >
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  width="100%"
                                  style={{
                                    maxHeight: 200,
                                    objectFit: "contain",
                                  }}
                                />
                              </Grid>
                            )
                          )}
                        </Grid>
                      )}
                  </>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} ld={4} md={4} sm={12} className="noprint">
              <IdeaChat
                idea={this.state.idea}
                setSnackbar={(snackbar) => this.setState({ snackbar })}
              />
            </Grid>
          </Grid>
          <hr />
          {this.state.isWriteAccess && this.state.idea.publish && (
            <Container fixed className="noprint">
              {this.state.experts.length > 0 && (
                <div>
                  <Grid container justifyContent="space-between" className="mb-2">
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        Connect with Experts
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Link
                        color="primary"
                        to={"/experts/" + this.state.idea.id}
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          this.props.history.push(
                            "/experts/" + this.state.idea.id
                          );
                        }}
                      >
                        See all
                      </Link>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="center" spacing={3}>
                    {this.state.experts.map((user) => (
                      <Grid item key={user.id}>
                        <UserCard user={user} connect={this.connect} />
                      </Grid>
                    ))}
                  </Grid>
                  <hr />
                </div>
              )}
              {this.state.investors.length > 0 && (
                <div>
                  <Grid container justifyContent="space-between" className="mb-2">
                    <Grid item>
                      <Typography variant="h6" gutterBottom>
                        Connect with Investors
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Link
                        color="primary"
                        to={"/investors/" + this.state.idea.id}
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          this.props.history.push(
                            "/investors/" + this.state.idea.id
                          );
                        }}
                      >
                        See all
                      </Link>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="center" spacing={3}>
                    {this.state.investors.map((user) => (
                      <Grid item key={user.id}>
                        <UserCard
                          user={user}
                          connect={this.connect}
                          isRequested={user.isRequested}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <hr />
                </div>
              )}
              {this.state.showEntrepreneurs &&
                this.state.entrepreneurs.length > 0 && (
                  <div>
                    <Grid container justifyContent="space-between" className="mb-2">
                      <Grid item>
                        <Typography variant="h6" gutterBottom>
                          Connect with Entrepreneurs
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Link
                          color="primary"
                          to={"/entrepreneurs/" + this.state.idea.id}
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            this.props.history.push(
                              "/entrepreneurs/" + this.state.idea.id
                            );
                          }}
                        >
                          See all
                        </Link>
                      </Grid>
                    </Grid>
                    <Grid container justifyContent="center" spacing={3}>
                      {this.state.entrepreneurs.map((user) => (
                        <Grid item key={user.id}>
                          <UserCard user={user} connect={this.connect} />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                )}
            </Container>
          )}
          {this.props.User.user.email === this.state.idea.email && (
            <Container>
              <Paper elevation={2} className="p-3">
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Box>
                      <b>Delete this Idea</b> <br />
                      Important: Once you delete an Idea, there is no going
                      back!
                    </Box>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => this.setState({ askConfirmation: true })}
                    >
                      Delete this Idea
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Container>
          )}
          <div>
            <IconButton
              aria-label="scroll"
              size="medium"
              onClick={() => {
                window.scrollBy({
                  top: window.innerHeight + 100,
                  behavior: "smooth",
                });
              }}
              className="scroll-btn"
            >
              <ExpandMoreIcon></ExpandMoreIcon>
            </IconButton>
          </div>
        </div>
        {this.addSnackBar()}
        {this.addBackdrop()}

        {this.state.teamDialogOpen && (
          <TeamPermissionsDialog
            open={this.state.teamDialogOpen}
            onClose={this.handleTeamPermissionsDialogClose}
            idea={this.state.idea}
            loggedInUser={this.props.User.user.email}
            users={this.props.User.users}
          />
        )}
        {this.state.shareIdeaDialogOpen && (
          <ShareIdeaDialog
            open={this.state.shareIdeaDialogOpen}
            onClose={this.handleShareIdeaDialogClose}
            idea={this.state.idea}
          />
        )}
        {this.state.askConfirmation && (
          <AlertDialog
            show={this.state.askConfirmation}
            handleClose={this.handleDialogClose}
            message="Do you want to delete this Idea?"
          />
        )}
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
    Idea: state.Idea,
    Notification: state.Notification,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      findIdeaDetails,
      updateIdeaDetails,
      findAllUsers,
      updateUserDetails,
      findUserDetails,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DetailsIdea));
