import React, { PureComponent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Grid,
  TextField,
  Snackbar,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import validate from "../../libs/forms/validate";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { sendNotification } from "../../store/actions/notification_action";
import { updateIdeaDetails } from "../../store/actions/pitch_action";
import { findUser } from "../../store/actions/user_action";
/* you can share idea to anyone, we are using this on detail idea page and idea card */
class ShareIdeaDialog extends PureComponent {
  state = {
    backdrop: false,
    open: true,
    email: {
      value: "",
      validation: {
        isRequired: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
    },
    snackbar: {
      open: false,
      title: "",
      message: "",
      level: "",
    },
  };
  handleClose = () => {
    this.props.onClose();
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ backdrop: true });
    const doc = await findUser(this.state.email.value);
    if (!doc.exists) {
      const emailForm = { ...this.state.email };
      emailForm.validationMessage = "User does not exists";
      emailForm.valid = false;
      await this.setState({ email: emailForm, backdrop: false });
      return;
    }
    await this.setState({ open: false });
    const data = {
      createdAt: new Date(),
      sharedTo: this.state.email.value,
      sharedBy: this.props.User.user.email,
    };
    if (!this.props.idea.chat) {
      this.props.idea.chat = {};
    }
    if (this.props.idea.chat.shares) {
      this.props.idea.chat.shares.push(data);
    } else {
      this.props.idea.chat.shares = [data];
    }
    this.props.onClose(this.props.idea);
    await Promise.all([
      updateIdeaDetails({
        id: this.props.idea.id,
        chat: this.props.idea.chat,
      }),

      sendNotification({
        to: this.state.email.value,
        from: this.props.User.user.email,
        senderName:
          this.props.User.user.firstName[0].toUpperCase() +
          this.props.User.user.firstName.substr(1) +
          " " +
          this.props.User.user.lastName[0].toUpperCase() +
          this.props.User.user.lastName.substr(1),
        avatar: this.props.User.user.photoUrl || null,
        pitchId: this.props.idea.id,
        pitchTitle: this.props.idea.title,
        type: "share",
        sendMail: true,
      }),
    ]);
  };
  handleChange = (event) => {
    const email = { ...this.state.email };
    email.value = event.target.value;
    email.touched = true;
    const validData = validate("email", { email });
    email.valid = validData[0];
    email.validationMessage = validData[1];
    if (email.value === this.props.User.user.email) {
      email.validationMessage = "You can not share Idea to yourself";
      email.valid = false;
    }
    this.setState({ email });
  };
  render() {
    return (
      <div>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="dialog-title"
          open={this.state.open}
          className="team-dialog"
          fullWidth={true}
        >
          <form noValidate onSubmit={this.handleSubmit}>
            <DialogTitle id="dialog-title" className="dialog-title">
              Share Idea
              <IconButton
                aria-label="close"
                className="dialogCloseButton"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent className="dialog-content">
              <div>
                <Box fontWeight="fontWeightBold" className="mb-2">
                  Enter the e-mail to whom you want to share this idea
                </Box>

                <Grid container className="mb-3">
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Email"
                    id="email"
                    name="email"
                    autoFocus
                    required={this.state.email.validation.isRequired}
                    value={this.state.email.value}
                    onChange={this.handleChange}
                    helperText={this.state.email.validationMessage}
                    error={this.state.email.touched && !this.state.email.valid}
                  />
                </Grid>
              </div>
            </DialogContent>
            <DialogActions className="m-3">
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={!this.state.email.valid}
              >
                Share
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={this.state.snackbar.open}
          autoHideDuration={2000}
          onClose={() => this.setState({ snackbar: { open: false } })}
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};

export default connect(mapStateToProps)(withRouter(ShareIdeaDialog));
