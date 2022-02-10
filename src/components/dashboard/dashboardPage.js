import Page from "../page";
import React, { PureComponent } from "react";
import RequestCard from "../request/RequestCard";
import IdeaCard from "../Idea/IdeaCard";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  findAllIdeas,
  updateIdeaDetails,
} from "../../store/actions/pitch_action";
import { updateUserDetails } from "../../store/actions/user_action";
import {
  findConnections,
  updateConnection,
} from "../../store/actions/connection_action";
import {
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  Input,
  ListItemText,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IdeaCardSkeleton from "../Idea/IdeaCardSkeleton";
import { industryOfInterestsDataArray } from "../../constants/mockResponse";
import { sendNotification } from "../../store/actions/notification_action";


/* lending page of the website where we show all the ideas */
class DashboardPage extends PureComponent {
  state = {
    ideas: null,
    loading: true,
    myIdeasSelected: false,
    backdrop: false,
    selectedCategory: ["All Categories"],
  };
  componentDidMount = async () => {
    await this.props.findAllIdeas();
    if (this.props.Idea.error) {
      console.log(this.props.Idea.error);
      this.setState({ loading: false });
    } else {
      if (this.props.User.user.role === "entrepreneur") {
        const ideas = [];
        for (const idea of this.props.Idea.ideas) {
          if (
            idea.email === this.props.User.user.email ||
            (this.props.User.user.myPitch &&
              this.props.User.user.myPitch.includes(idea.id))
          ) {
            ideas.push(idea);
          }
        }
        await this.setState({ ideas, loading: false });
        if (this.state.ideas.length === 0) {
          this.props.history.push("/create-pitch");
          return;
        }
      } else {
        const allIdeas = [];
        for (const idea of this.props.Idea.ideas) {
          if (idea.publish) {
            allIdeas.push(idea);
          }
        }
        this.setState({ ideas: allIdeas, loading: false });
      }
      if (!this.props.Connection.connection) {
        await this.props.findConnections(this.props.User.user.email);
      }
    }
  };
  acceptorCancelRequest = async (pitchId, email, type) => {
    const user = { ...this.props.User.user };
    const requestIndex = user.requests.findIndex(
      (req) => req.pitchId === pitchId && req.email === email
    );
    const request = user.requests[requestIndex];
    user.requests.splice(requestIndex, 1);
    const pitch = this.props.Idea.ideas.find((idea) => idea.id === pitchId);
    if (type === "accept") {
      if (request.email === pitch.email) {
        if (user.myPitch) {
          if (!user.myPitch.includes(pitchId)) user.myPitch.push(pitchId);
        } else {
          user.myPitch = [pitchId];
        }
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
        } else {
          pitch[`${user.role}s`].push({
            name: user.firstName + " " + user.lastName,
            email: user.email,
            access: request.access || "read",
            uid: user.uid,
          });
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
            access: request.access || "read",
            uid: request.uid,
          });
        } else {
          pitch[`${request.role}s`].push({
            name: request.name,
            email: request.email,
            access: request.access || "read",
            uid: request.uid,
          });
        }
        pitch.user = {
          email: request.email,
          pitchId: pitchId,
        };
      }
      updateIdeaDetails(pitch);
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
      });
    }
    await this.props.updateUserDetails(user);
  };
  acceptorCancelConnectionRequest = async (email, type) => {
    this.setState({ backdrop: true });
    if (type === "reject") {
      await this.props.updateConnection({
        type: "reject",
        connectionEmail: email,
        email: this.props.User.user.email,
      });
    } else {
      const connection = {
        name:
          this.props.User.user.firstName + " " + this.props.User.user.lastName,
        email: this.props.User.user.email,
        avatar: this.props.User.user.photoUrl || null,
        uid: this.props.User.user.uid,
        role: this.props.User.user.role,
        isConnected: true,
      };
      this.props.updateConnection({
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
    }
    this.setState({ backdrop: false });
  };
  changeCategory = (categories) => {
    if (categories.length > 0) {
      if (categories.includes("All Categories")) {
        categories.shift();
      }
    } else {
      categories.push("All Categories");
    }
    this.setState({
      selectedCategory: categories,
      loading: true,
    });
    setTimeout(this.filterIdeas, 1000);
  };
  filterIdeas = () => {
    const ideas = [];
    const pitchIn = [];
    if (this.state.selectedCategory.includes("All Categories")) {
      this.setState({ loading: false, ideas: this.props.Idea.ideas });
      return;
    }
    for (let cat of this.state.selectedCategory) {
      for (let pitch of this.props.Idea.ideas) {
        if (pitch.publish && pitch.category && pitch.category.includes(cat)) {
          if (!pitchIn.includes(pitch.id)) {
            ideas.push(pitch);
            pitchIn.push(pitch.id);
          }
        }
      }
    }
    this.setState({ loading: false, ideas });
  };
  showMyIdeas = () => {
    if (!this.state.myIdeasSelected && this.props.User.user.myPitch) {
      const ideas = this.props.Idea.ideas.filter((idea) =>
        this.props.User.user.myPitch.includes(idea.id)
      );
      this.setState({ myIdeasSelected: !this.state.myIdeasSelected, ideas });
    } else {
      this.setState({
        myIdeasSelected: !this.state.myIdeasSelected,
        ideas: this.props.Idea.ideas,
      });
    }
  };
  render() {
    return (
      <Page className="DashboardPage">
        <Grid container spacing={2}>
          <Grid item xs={12} ld={9} md={9} sm={12}>
            {this.props.User.user.role === "entrepreneur" ? (
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Button
                    variant="outlined"
                    size="large"
                    color="default"
                    className="create-new-idea-btn"
                    onClick={() => this.props.history.push("create-pitch")}
                    startIcon={<AddCircleIcon />}
                  >
                    Create New Idea
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid
                container
                spacing={3}
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Grid item>Show me:</Grid>
                <Grid item>
                  <FormControl variant="outlined" className="multi-select">
                    <Select
                      labelId="demo-mutiple-checkbox-label"
                      id="demo-mutiple-checkbox"
                      className="pb-1"
                      multiple
                      fullWidth
                      value={this.state.selectedCategory}
                      onChange={(event) =>
                        this.changeCategory(event.target.value)
                      }
                      input={<Input />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={this.state.menuProps}
                    >
                      {industryOfInterestsDataArray.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox
                            color="primary"
                            checked={
                              this.state.selectedCategory.indexOf(name) > -1
                            }
                          />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {this.props.User.user.myPitch &&
                  this.props.User.user.myPitch.length > 0 && (
                    <Grid item>
                      {this.state.myIdeasSelected ? (
                        <Button
                          color="secondary"
                          variant="contained"
                          disableElevation
                          onClick={this.showMyIdeas}
                        >
                          My Ideas
                        </Button>
                      ) : (
                        <Button
                          color="default"
                          variant="outlined"
                          disableElevation
                          onClick={this.showMyIdeas}
                        >
                          My Ideas
                        </Button>
                      )}
                    </Grid>
                  )}
              </Grid>
            )}
            <hr />

            {this.state.loading ? (
              <Grid container justifyContent="space-evenly" alignItems="flex-start">
                <Grid item>
                  <IdeaCardSkeleton />
                </Grid>
                <Grid item>
                  <IdeaCardSkeleton />
                </Grid>
                <Grid item>
                  <IdeaCardSkeleton />
                </Grid>
              </Grid>
            ) : (
              <Grid
                container
                justifyContent="space-evenly"
                alignItems="flex-start"
                spacing={3}
                className="mt-2"
              >
                {this.state.ideas && this.state.ideas.length > 0 ? (
                  this.state.ideas.map((idea) => (
                    <Grid item key={idea.id} className="mb-3">
                      <IdeaCard idea={idea} />
                    </Grid>
                  ))
                ) : (
                  <Grid item>No Pitch Found</Grid>
                )}
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} ld={3} md={3} sm={12}>
            <RequestCard
              className="mt-10"
              requests={this.props.User.user.requests || []}
              connections={this.props.Connection.connections.filter(
                (con) => !con.isConnected
              )}
              acceptorCancelRequest={this.acceptorCancelRequest}
              acceptorCancelConnectionRequest={
                this.acceptorCancelConnectionRequest
              }
            />
          </Grid>
        </Grid>
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
      findAllIdeas,
      updateUserDetails,
      updateIdeaDetails,
      findConnections,
      updateConnection,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardPage));
