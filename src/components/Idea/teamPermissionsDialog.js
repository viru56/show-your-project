import React, { PureComponent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Grid,
  Divider,
  TextField,
  MenuItem,
  Button,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import validate from "../../libs/forms/validate";

/* see you pending requests, invite new team member and change access of a team member */
export default class TeamPermissionsDialog extends PureComponent {
  state = {
    team: this.props.idea.team || [],
    investors: this.props.idea.investors || [],
    experts: this.props.idea.experts || [],
    entrepreneurs: this.props.idea.entrepreneurs || [],
    validForm: true,
    deletedUsers: [],
    pendingRequests: [],
    teamForm: [
      {
        access: {
          value: "read",
          validation: {
            isRequired: false,
          },
          valid: true,
          touched: false,
          validationMessage: "",
        },
        email: {
          value: "",
          validation: {
            isRequired: false,
            isEmail: true,
          },
          valid: false,
          touched: false,
          validationMessage: "",
        },
      },
    ],
  };
  handleClose = () => {
    this.props.onClose();
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const inviteTeamMember = [];
    this.state.teamForm.forEach((team, index) => {
      if (team.email.value && inviteTeamMember.every(it=>it.email !==team.email.value)) {
        inviteTeamMember.push({
          access: team.access.value,
          email: team.email.value,
        });
      }
    });
    this.props.idea.team = this.state.team;
    this.props.idea.entrepreneurs = this.state.entrepreneurs;
    this.props.idea.investors = this.state.investors;
    this.props.idea.experts = this.state.experts;
    this.props.onClose({
      idea: this.props.idea,
      inviteTeamMember,
      deletedUsers: this.state.deletedUsers,
      pendingRequests: this.state.pendingRequests,
    });
  };
  handleTeamFormChange = (key, value, index) => {
    let validForm = true;
    const teamForm = [...this.state.teamForm];
    teamForm[index][key].value = value;
    teamForm[index][key].touched = true;
    const validData = validate(key, teamForm[index]);
    validForm = validData[0];
    teamForm[index][key].valid = validData[0];
    teamForm[index][key].validationMessage = validData[1];
    if (validForm) {
      let userExists = false;
      userExists =
        this.state.team.some((user) => user.email === value) ||
        this.state.entrepreneurs.some((user) => user.email === value) ||
        this.state.investors.some((user) => user.email === value) ||
        this.state.experts.some((user) => user.email === value) ||
        this.props.loggedInUser === value ||
        this.props.idea.email === value;
      if (userExists) {
        validForm = false;
        teamForm[index][key].touched = true;
        teamForm[index][key].valid = false;
        teamForm[index][key].validationMessage = "User already a team member";
      }
    }
    if (value === "") {
      validForm = true;
      teamForm[index][key].touched = false;
      teamForm[index][key].valid = true;
      teamForm[index][key].validationMessage = "";
    }
    this.setState({ teamForm, validForm });
  };
  addRow = () => {
    const teamForm = [...this.state.teamForm];
    teamForm.push({
      access: {
        value: "read",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      email: {
        value: "",
        validation: {
          isRequired: false,
          isEmail: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
    });
    this.setState({ teamForm });
  };
  removeRow = (index) => {
    const teamForm = [...this.state.teamForm];
    teamForm.splice(index, 1);
    this.setState({ teamForm });
  };
  deleteTeamMember = (role, index) => {
    if (role) {
      const deletedUsers = [...this.state.deletedUsers];
      const key = role === "team" ? role : `${role}s`;
      const data = [...this.state[key]];
      deletedUsers.push(data.splice(index, 1)[0].email);
      this.setState({ [key]: data, deletedUsers });
    } else {
      const pendingRequests = [...this.state.pendingRequests];
      pendingRequests[index].deleted = true;
      this.setState({ pendingRequests });
    }
  };
  showTeam = (role, data) => {
    return data.map((user, index) => (
      <div key={index}>
        {!user.deleted && (
          <div>
            <Grid container spacing={1} className="p-1">
              <Grid item xs={5} md={6} className="capital">
                {user.name}
              </Grid>
              <Grid item md={3} className="capital hidden-xs">
                {user.role
                  ? user.role
                  : role === "team"
                  ? "entrepreneur"
                  : role}
              </Grid>
              <Grid item xs={5} md={2}>
                <TextField
                  variant="standard"
                  fullWidth
                  select
                  id="access"
                  name="access"
                  disabled={user.email === this.props.loggedInUser}
                  value={user.access || "read"}
                  onChange={(event) => {
                    if (role) {
                      let key = role === "team" ? role : `${role}s`;
                      const team = [...this.state[key]];
                      team[index].access = event.target.value;
                      this.setState({ [key]: team });
                    } else {
                      const pendingRequests = [...this.state.pendingRequests];
                      pendingRequests[index].access = event.target.value;
                      this.setState({ pendingRequests });
                    }
                  }}
                >
                  <MenuItem key="1" value="read">
                    Read
                  </MenuItem>
                  <MenuItem key="2" value="write">
                    Write
                  </MenuItem>
                  <MenuItem key="3" value="admin">
                    Admin
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={2} md={1}>
                <IconButton
                  aria-label="delete"
                  color="secondary"
                  classes={{
                    colorSecondary: "colorSecondary",
                  }}
                  className="icon-button"
                  disabled={user.email === this.props.loggedInUser}
                  onClick={() => this.deleteTeamMember(role, index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
            {index !== data.length - 1 && <Divider />}
          </div>
        )}
      </div>
    ));
  };
  componentDidMount() {
    const pendingRequests = [];
    this.props.users.forEach((user) => {
      if (user.requests && user.requests.length > 0) {
        user.requests.forEach((request) => {
          if (request.pitchId === this.props.idea.id) {
            pendingRequests.push({
              name: user.firstName + " " + user.lastName,
              email: user.email,
              role: user.role,
              access: request.access,
              pending: true,
            });
          }
        });
      }
    });
    this.setState({ pendingRequests });
  }
  render() {
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="dialog-title"
        open={this.props.open}
        className="team-dialog"
        fullWidth={true}
      >
        <form noValidate onSubmit={this.handleSubmit}>
          <DialogTitle id="dialog-title" className="dialog-title">
            Team Permissions
            <IconButton
              aria-label="close"
              className="dialogCloseButton"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className="dialog-content">
            {(this.state.team.length > 0 ||
              this.state.entrepreneurs.length > 0 ||
              this.state.investors.length > 0 ||
              this.state.experts.length > 0) && (
              <div className="team-member">
                <Grid container>
                  <Grid item xs={12} className="p-1">
                    <Box fontWeight="fontWeightBold"> Team members </Box>
                  </Grid>
                </Grid>
                {this.state.team.length > 0 && (
                  <div>
                    <Divider />
                    {this.showTeam("team", this.state.team)}
                  </div>
                )}
                {this.state.entrepreneurs.length > 0 && (
                  <div>
                    <Divider />
                    {this.showTeam("entrepreneur", this.state.entrepreneurs)}
                  </div>
                )}
                {this.state.investors.length > 0 && (
                  <div>
                    <Divider />
                    {this.showTeam("investor", this.state.investors)}
                  </div>
                )}

                {this.state.experts.length > 0 && (
                  <div>
                    <Divider />
                    {this.showTeam("expert", this.state.experts)}
                  </div>
                )}
              </div>
            )}
            {this.state.pendingRequests.length > 0 && (
              <div className="team-member">
                <Grid container>
                  <Grid item xs={12} className="p-1">
                    <Box fontWeight="fontWeightBold"> Pending requests</Box>
                  </Grid>
                </Grid>
                <div>
                  <Divider />
                  {this.showTeam("", this.state.pendingRequests)}
                </div>
              </div>
            )}
            <div className="mt-3">
              <Box fontWeight="fontWeightBold" className="mb-2">
                Invite your team member through e-mail
              </Box>
              {this.state.teamForm.map((team, index) => (
                <Grid container key={index} className="mb-3">
                  <Grid item md={11} xs={10}>
                    <Grid container className="team-member" spacing={1}>
                      <Grid item md={10} xs={6}>
                        <TextField
                          variant="standard"
                          fullWidth
                          placeholder="Email"
                          id={"email" + index}
                          name={"email" + index}
                          required={team.email.validation.isRequired}
                          value={team.email.value}
                          onChange={(event) =>
                            this.handleTeamFormChange(
                              "email",
                              event.target.value,
                              index
                            )
                          }
                          helperText={team.email.validationMessage}
                          error={team.email.touched && !team.email.valid}
                        />
                      </Grid>
                      <Grid item md={2} xs={6}>
                        <TextField
                          variant="standard"
                          fullWidth
                          select
                          id={"access" + index}
                          name={"access" + index}
                          value={team.access.value}
                          onChange={(event) => {
                            this.handleTeamFormChange(
                              "access",
                              event.target.value,
                              index
                            );
                          }}
                        >
                          <MenuItem key="1" value="read">
                            Read
                          </MenuItem>
                          <MenuItem key="2" value="write">
                            Write
                          </MenuItem>
                          <MenuItem key="3" value="admin">
                            Admin
                          </MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} md={1} className="text-right pt-1">
                    {index === this.state.teamForm.length - 1 && index < 4 && (
                      <IconButton
                        aria-label="add"
                        color="primary"
                        className="icon-button"
                        onClick={this.addRow}
                      >
                        <AddCircleIcon />
                      </IconButton>
                    )}
                    {index < this.state.teamForm.length - 1 && (
                      <IconButton
                        aria-label="add"
                        className="icon-button"
                        onClick={() => this.removeRow(index)}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
            </div>
          </DialogContent>
          <DialogActions className="m-3">
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={!this.state.validForm}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}
