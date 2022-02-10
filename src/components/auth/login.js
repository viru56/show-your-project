import React, { PureComponent } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import VpnKeyOutlinedIcon from "@material-ui/icons/VpnKeyOutlined";
// import linkedin from "../../assets/images/linkedin.svg";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
// import facebook from "../../assets/images/facebook.svg";
// import twitter from "../../assets/images/twitter.svg";
import google from "../../assets/images/google.svg";
import validate from "../../libs/forms/validate";
import {
  signIn,
  signInWithGoogle,
  signInWithTwitter,
  signInWithFacebook,
  signInWithLinkedIn
} from "../../store/actions/user_action";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Logo from "../logo";
// import login from "../../assets/images/login.svg";
import Typography from "@material-ui/core/Typography";
// import { COLOR } from "../../constants/Colors";
//import { LinkedIn } from "react-linkedin-login-oauth2";
//import { firebaseConfig } from "../../libs/config";

class Login extends PureComponent {
  state = {
    showBackdrop: false,
    snackbar: {
      open: false,
      title: "",
      message: "",
      level: ""
    },
    formData: {
      isFormValid: false,
      email: {
        value: "",
        validation: {
          isRequired: true,
          isEmail: true
        },
        valid: false,
        touched: false,
        validationMessage: ""
      },
      password: {
        value: "",
        validation: {
          isRequired: true,
          minLength: 6
        },
        valid: false,
        touched: false,
        validationMessage: ""
      }
    }
  };
  handleClose = () => {
    const snackbar = { ...this.state.snackbar };
    snackbar.open = false;
    this.setState({ snackbar });
  };
  handleSubmit = async event => {
    event.preventDefault();
    if (!this.state.formData.isFormValid) {
      const formData = { ...this.state.formData };
      formData.email.touched = true;
      formData.password.touched = true;
      this.setState({ formData });
      return;
    }
    this.setState({ showBackdrop: true });
    try {
      await this.props.signIn({
        email: this.state.formData.email.value.toLowerCase(),
        password: this.state.formData.password.value
      });
      if (this.props.User.error) {
        if (this.props.User.error.title === "Email Verification Pending") {
          this.props.history.push("/emailVerification");
        }
        if (this.props.User.error.title === "Account Inactive") {
          this.props.history.push("/notVerified");
        }
        const snackbar = {
          open: true,
          message: this.props.User.error.message,
          title: this.props.User.error.title,
          level: "error"
        };
        this.setState({ snackbar, showBackdrop: false });
      } else if (this.props.User.user.isNewUser) {
        this.props.history.push("/role");
      } else {
        if (this.props.User.user.role === "admin") {
          this.props.history.push("/admin-dashboard");
        } else {
          this.props.history.push("/");
        }
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
    if (formData.email.valid && formData.password.valid) {
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
        level: "error"
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
        level: "error"
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

      <div className="auth">
        <Grid container>
          <Grid item md={6} className="hidden-sm hidden-xs show-form">
            <div style={{ padding: "60px", marginLeft: "100px" }}>
              <Logo />
              <div style={{ marginTop: "60px" }}>
                <Typography variant="h5" gutterBottom>
                  <span style={{ color: "#9B9696" }}>WELCOME TO Show Your Project</span>
                  {/*<span style={{ color: COLOR.green }}>RYT</span>*/}
                </Typography>
              </div>
              <div>
                {/*<img src={login} className="image" alt="login" />*/}
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>

            <div className="paper mw500">
              <div className="title">
                <Typography variant="h5" gutterBottom>
                  Welcome Back
              </Typography>
                {/* <Typography variant="subtitle2">Welcome Back</Typography>
              <hr style={{ width: "80%", borderColor: "#fff" }} /> */}
              </div>
              <form className="form" noValidate onSubmit={this.handleSubmit}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{ marginLeft: '15px', color: "#fff" }}
                >
                  Login Using
              </Typography>
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
                    onFailure={error => this.signInWithLinkedIn(error, null)}
                    onSuccess={data => this.signInWithLinkedIn(null, data)}
                    redirectUri={firebaseConfig.linkedInRedirectURL}
                    state={firebaseConfig.state}
                  >
                    <Avatar alt="linkedIn" src={linkedin} className="avatar" />
                  </LinkedIn> */}
                </div>
                <p className="or">
                  <span>OR</span>
                </p>
                <TextField
                  variant="filled"
                  margin="normal"
                  className='login-text-field'
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <MailOutlineIcon />
                      </InputAdornment>
                    ),
                  }}
                  id="email"
                  label="Email "
                  name="email"
                  autoComplete="email"
                  value={this.state.formData.email.value}
                  onChange={event =>
                    this.handleChange("email", event.target.value)
                  }
                  helperText={this.state.formData.email.validationMessage}
                  error={
                    this.state.formData.email.touched &&
                    !this.state.formData.email.valid
                  }
                />
                <TextField
                  variant="filled"
                  margin="normal"
                  className='login-text-field'
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <VpnKeyOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"

                  autoComplete="current-password"
                  value={this.state.formData.password.value}
                  onChange={event =>
                    this.handleChange("password", event.target.value)
                  }
                  helperText={this.state.formData.password.validationMessage}
                  error={
                    this.state.formData.password.touched &&
                    !this.state.formData.password.valid
                  }
                />
                <Grid container>
                  <Grid item xs>
                    {/* <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  /> */}
                  </Grid>
                  <Grid item>
                    <Link href="/forgot-password" variant="body2">
                      Forgot password?
                  </Link>
                  </Grid>
                </Grid>
                <div className="text-center m-3">
                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    color="primary"
                  >
                    Log In
                </Button>
                  <hr className='btn-line' />
                  <p style={{ marginTop: "10px", color: "#fff" }}>
                    Don't have an account <br />
                    <Link href="/register" variant="body2">
                      Create a new account using email
                  </Link>
                  </p>
                </div>
              </form>
            </div>

          </Grid>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
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
            classes={{
              root: `snackbar-${
                this.state.snackbar.level ? this.state.snackbar.level : "error"
                }`
            }}
          />
          <Backdrop
            open={this.state.showBackdrop}
            style={{ zIndex: 99999, color: "#fff" }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    User: state.User
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      signIn,
      signInWithGoogle,
      signInWithFacebook,
      signInWithTwitter,
      signInWithLinkedIn
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Login));
