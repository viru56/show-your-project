import React, { PureComponent } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
// import facebook from "../../assets/images/facebook.svg";
// import twitter from "../../assets/images/twitter.svg";
import google from "../../assets/images/google.svg";
//import linkedin from "../../assets/images/linkedin.svg";
import validate from "../../libs/forms/validate";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import VpnKeyOutlinedIcon from "@material-ui/icons/VpnKeyOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";

import {
  signUp,
  signInWithGoogle,
  signInWithFacebook,
  signInWithTwitter,
} from "../../store/actions/user_action";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Logo from "../logo";
//import login from "../../assets/images/login.svg";
import Typography from "@material-ui/core/Typography";
import { COLOR } from "../../constants/Colors";
//import { LinkedIn } from "react-linkedin-login-oauth2";
//import { firebaseConfig } from "../../libs/config";
class Register extends PureComponent {
  state = {
    termsAndCondition: false,
    showBackdrop: false,
    snackbar: {
      open: false,
      title: "",
      message: "",
    },
    formData: {
      isFormValid: false,
      firstName: {
        value: "",
        validation: {
          isRequired: true,
          maxLength: 150,
          isName: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      lastName: {
        value: "",
        validation: {
          isRequired: true,
          maxLength: 150,
          isName: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
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
      password: {
        value: "",
        validation: {
          isRequired: true,
          isPassword: true
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      confirmPassword: {
        value: "",
        validation: {
          confirmPass: "password",
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


    try {
      event.preventDefault();
      this.setState({ showBackdrop: true });
      const data = {
        firstName: this.state.formData.firstName.value.trim(),
        lastName: this.state.formData.lastName.value.trim(),
        email: this.state.formData.email.value.toLowerCase(),
        password: this.state.formData.password.value,
      };
      await this.props.signUp(data);
      this.setState({ showBackdrop: false });
      if (this.props.User.error) {
        const snackbar = {
          open: true,
          message: this.props.User.error.message,
          title: this.props.User.error.title,
          level: "error",
        };
        this.setState({ snackbar });
      } else {
        this.props.history.push("/role");
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
    if (
      formData.firstName.valid &&
      formData.lastName.valid &&
      formData.email.valid &&
      formData.password.valid &&
      formData.confirmPassword.valid
    ) {
      formData.isFormValid = true;
    } else {
      formData.isFormValid = false;
    }
    this.setState({ formData });
  };
  signInWithFacebook = async () => {
    try {
      this.setState({ showBackdrop: true });
      await this.props.signInWithFacebook();
      this.setState({ showBackdrop: false });
      this.redirectUser();
    } catch (error) {
      console.log(error);
    }
  };
  signInWithTwitter = async () => {
    try {
      this.setState({ showBackdrop: true });
      await this.props.signInWithTwitter();
      this.setState({ showBackdrop: false });
      this.redirectUser();
    } catch (error) {
      console.log(error);
    }
  };
  signInWithGoogle = async () => {
    try {
      this.setState({ showBackdrop: true });
      await this.props.signInWithGoogle();
      this.setState({ showBackdrop: false });
      this.redirectUser();
    } catch (error) {
      console.log(error);
    }
  };
  signInWithLinkedIn = async (error, data) => {
    if (error) {
      console.log(error);
      const snackbar = {
        open: true,
        title: "LinkedIn Error",
        message:
          "LinkedIn login is not available now, please try with facebook/google",
        level: "error",
      };
      this.setState({ snackbar });
    } else {
      this.setState({ showBackdrop: true });
      await this.props.signInWithLinkedIn(data.code);
      this.setState({ showBackdrop: false });
      this.redirectUser();
    }
  };
  redirectUser = () => {
    if (this.props.User.error) {
      const snackbar = {
        open: true,
        title: this.props.User.error.title,
        message: this.props.User.error.message,
        level: "error",
      };
      this.setState({ snackbar });
    } else if (this.props.User.user.isNewUser) {
      this.props.history.push("/role");
    } else {
      if (this.props.User.user.role === "admin") {
        this.props.history.push("/admin-dashboard");
      } else {
        this.props.history.push("/");
      }
    }
  };
  render() {
    return (
      <Grid container component="main" className="auth">
        <Grid item md={6} className="hidden-sm hidden-xs show-form">
          <div style={{ padding: "60px", marginLeft: "100px" }}>
            <Logo />
            <div style={{ marginTop: "60px" }}>
              <Typography variant="h5" gutterBottom>
                <span style={{ color: "#9B9696" }}>WELCOME TO Show Your Project </span>
                {/*<span style={{ color: COLOR.green }}>RYT</span>*/}
              </Typography>
              <Typography variant="subtitle2" style={{ color: COLOR.green }}>
                Let’s work together to bring Ideas to Life!
              </Typography>
            </div>
            <div>
              {/* <img src={login} className="image" alt="login" /> */}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={5}>
          <div className="paper mw500">
            <Typography
              variant="subtitle2"
              gutterBottom
              style={{ color: "#fff", marginBottom: "30px" }}
            >
              SIGN IN USING
            </Typography>
            <form className="form" noValidate onSubmit={this.handleSubmit}>
              <div className="social">
                {/* <Avatar
                  alt="facebook"
                  src={facebook}
                  className="avatar"
                  onClick={this.signInWithFacebook}
                /> */}
                <Avatar
                  alt="google"
                  src={google}
                  className="avatar"
                  onClick={this.signInWithGoogle}
                />
                {/* <Avatar
                  alt="twitter"
                  src={twitter}
                  className="avatar"
                  onClick={this.signInWithTwitter}
                /> */}
                {/* <LinkedIn
                  scope={["r_emailaddress", "r_liteprofile"]}
                  clientId={firebaseConfig.linkedInClientId}
                  onFailure={(error) => this.signInWithLinkedIn(error, null)}
                  onSuccess={(data) => this.signInWithLinkedIn(null, data)}
                  redirectUri={firebaseConfig.linkedInRedirectURL}
                  state={firebaseConfig.state}
                >
                  <Avatar alt="linkedIn" src={linkedin} className="avatar" />
                </LinkedIn> */}
              </div>
              <p className="or">
                <span>OR</span>
              </p>
              <Typography
                variant="subtitle2"
                gutterBottom
                style={{ color: "#fff" }}
              >
                SIGN UP WITH E-MAIL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6} ld={6}>
                  <TextField
                    variant="filled"
                    margin="normal"
                    required
                    fullWidth
                    id="first-name"
                    label="First Name "
                    name="first-name"
                    autoComplete='off'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <AccountCircleOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={this.state.formData.firstName.value}
                    onChange={(event) =>
                      this.handleChange("firstName", event.target.value)
                    }
                    helperText={this.state.formData.firstName.validationMessage}
                    error={
                      this.state.formData.firstName.touched &&
                      !this.state.formData.firstName.valid
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} ld={6}>
                  <TextField
                    variant="filled"
                    margin="normal"
                    required
                    fullWidth
                    id="last-name"
                    label="Last Name "
                    name="last-name"
                    autoComplete='off'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <AccountCircleOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={this.state.formData.lastName.value}
                    onChange={(event) =>
                      this.handleChange("lastName", event.target.value)
                    }
                    helperText={this.state.formData.lastName.validationMessage}
                    error={
                      this.state.formData.lastName.touched &&
                      !this.state.formData.lastName.valid
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} ld={12}>
                  <TextField
                    variant="filled"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email "
                    name="email"
                    autoComplete='off'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <MailOutlineIcon />
                        </InputAdornment>
                      ),
                    }}
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
                </Grid>
                <Grid item xs={12} sm={6} md={6} ld={6}>
                  <TextField
                    variant="filled"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete='off'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <VpnKeyOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={this.state.formData.password.value}
                    onChange={(event) =>
                      this.handleChange("password", event.target.value)
                    }
                    helperText={this.state.formData.password.validationMessage}
                    error={
                      this.state.formData.password.touched &&
                      !this.state.formData.password.valid
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} ld={6}>
                  <TextField
                    variant="filled"
                    margin="normal"
                    required
                    fullWidth
                    name="confirm-password"
                    label="Confirm Password "
                    type="password"
                    id="confirm-password"
                    autoComplete='off'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <VpnKeyOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={this.state.formData.confirmPassword.value}
                    onChange={(event) =>
                      this.handleChange("confirmPassword", event.target.value)
                    }
                    helperText={
                      this.state.formData.confirmPassword.validationMessage
                    }
                    error={
                      this.state.formData.confirmPassword.touched &&
                      !this.state.formData.confirmPassword.valid
                    }
                  />
                </Grid>
              </Grid>
              <div className="text-center m-3">
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled={!this.state.formData.isFormValid}
                >
                  Create a new account using email
                </Button>
                <p style={{ marginTop: "10px", color: "#fff" }}>
                  Already have an account? <br />
                  <Link href="/login" variant="body2">
                    Log in
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
      signUp,
      signInWithGoogle,
      signInWithFacebook,
      signInWithTwitter,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Register));
