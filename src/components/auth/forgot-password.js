import React, { PureComponent } from "react";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";

import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import validate from "../../libs/forms/validate";
import { sendResetPasswordMail } from "../../store/actions/user_action";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Logo from "../logo";
import Typography from "@material-ui/core/Typography";
import { COLOR } from "../../constants/Colors";
import login from "../../assets/images/login.svg";

/* if user forgot their password, they can request to change their password */
class ForgotPassword extends PureComponent {
  state = {
    showBackdrop: false,
    snackbar: {
      open: false,
      title: "",
      message: "",
    },
    formData: {
      isFormValid: false,
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
    },
  };
  handleClose = () => {
    const snackbar = { ...this.state.snackbar };
    snackbar.open = false;
    this.setState({ snackbar });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    if (!this.state.formData.isFormValid) {
      const formData = { ...this.state.formData };
      formData.email.touched = true;
      this.setState({ formData });
      return;
    }
    this.setState({ showBackdrop: true });
    try {
      await this.props.sendResetPasswordMail({
        email: this.state.formData.email.value,
      });
      this.setState({ showBackdrop: false });
      if (this.props.User.error) {
        const snackbar = {
          open: true,
          message: this.props.User.error.message,
          title: this.props.User.error.title,
          level: "error",
        };
        this.setState({ snackbar });
      } else if (this.props.User.info) {
        const snackbar = {
          open: true,
          message: this.props.User.info.message,
          title: this.props.User.info.title,
          level: "info",
        };
        this.setState({ snackbar });
      }
    } catch (error) {
      console.log(error);
    }
  };
  handleChange = (key, value) => {
    const formData = { ...this.state.formData };
    formData[key].value = value;
    formData[key].touched = true;
    const validData = validate(key, formData);
    formData[key].valid = validData[0];
    formData[key].validationMessage = validData[1];
    if (formData.email.valid) {
      formData.isFormValid = true;
    } else {
      formData.isFormValid = false;
    }
    this.setState({ formData, serverError: "" });
  };
  render() {
    return (
      <Grid container component="main" className="auth">
        <CssBaseline />
        <Grid item xs={false} sm={false} md={6} className="hidden-sm hidden-xs">
          <div style={{ padding: "60px", marginLeft: "100px" }}>
            <Logo />
            <div style={{ marginTop: "60px" }}>
              <Typography variant="h5" gutterBottom>
                <span style={{ color: "#9B9696" }}>WELCOME TO Show Your Project</span>
                {/*<span style={{ color: COLOR.green }}>RYT</span>*/}
              </Typography>
              <Typography variant="subtitle2" style={{ color: COLOR.green }}>
                Let’s work together to bring Ideas to Life!
              </Typography>
            </div>
            <div>
              <img src={login} className="image" alt="login" />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <div className="paper mw500">
            <div className="title">
              <Typography variant="h5" gutterBottom>
                Forgot Password
              </Typography>
            </div>
            <form className="form" noValidate onSubmit={this.handleSubmit}>
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email "
                name="email"
                autoComplete="email"
                value={this.state.formData.email.value}
                onChange={(event) =>
                  this.handleChange("email", event.target.value)
                }
                helperText={this.state.formData.email.validationMessage}
                error={
                  this.state.formData.email.touched &&
                  !this.state.formData.email.valid
                }
              />
              <div className="text-center m-3">
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
                <p style={{ marginTop: "10px" }}>
                  <Link href="/login" variant="body2">
                    log In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={this.state.snackbar.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={
            <div>
              <b>{this.state.snackbar.title}</b> <br />
              {this.state.snackbar.message}
            </div>
          }
          classes={{ root: `snackbar-${this.state.snackbar.level}` }}
        />
        <Backdrop
          open={this.state.showBackdrop}
          style={{ zIndex: 99999, color: "#fff" }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      sendResetPasswordMail,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ForgotPassword));
