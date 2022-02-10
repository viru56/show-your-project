import React, { PureComponent } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { Typography } from "@material-ui/core";
import {
  Button,
  Snackbar,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";

import notverifiedImageUrl from "../../assets/images/Group303.svg";
import { sendEmailVerification, signOut } from "../../store/actions/user_action";


/* show the message of email verification, if user email is not verified */
class EmailVerification extends PureComponent {
  state = {
    showBackdrop: false,
    snackbar: {
      open: false,
      title: "",
      message: "",
      level: "",
    },
  };
  resendMail = async () => {
    this.setState({ showBackdrop: true });
    await sendEmailVerification();
    const snackbar = {
      open: true,
      title: "Mail Sent",
      message: "We have sent you a mail to verify your email address.",
      level: "success",
    };
    this.setState({ showBackdrop: false, snackbar });
  };
  redirectToLonin = async () => {
    await signOut();
    setTimeout(this.props.history.push("/login"), 1000);
  }
  render() {
    return (
      <Grid container component="main" className="auth">
        <CssBaseline />
        <Grid item xs={false} sm={false} md={6} className="hidden-sm hidden-xs">
          <div style={{ padding: "60px", marginLeft: "100px" }}>
            <div>
              <img src={notverifiedImageUrl} className="image" alt="login" />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={6} className="flexCentre bg-white">
          <div className="NotVerified">
            <Grid item container xs={12} spacing={4}>
              <Grid item xs={12}>
                < Grid container direction="column">
                  <Grid className="descReview">
                    <Typography variant="h5" className="uppercase">
                      Email Verification Pending
                    </Typography>
                    <Typography variant={"subtitle1"}>
                      Please check your inbox and verify your email address. <br />If you did not get the verification email, click &nbsp;
                      <Button
                        color="secondary"
                        onClick={this.resendMail}
                        variant="outlined"
                      >
                        Resend mail
                      </Button>
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography
                      variant={"subtitle1"}
                      className="font-bold mr-50 ml-50"
                    >
                      Verified account? &nbsp;
                      <Button
                        color="primary"
                        variant="contained"
                        className="mr-4"
                        onClick={this.redirectToLonin}
                      >
                        Log in
                      </Button>
                      <br /> <br />


                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={this.state.snackbar.open}
            autoHideDuration={6000}
            onClose={() => this.setState({ snackbar: { open: false } })}
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
          <Backdrop
            open={this.state.showBackdrop}
            style={{ zIndex: 99999, color: "#fff" }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};

export default connect(mapStateToProps)(EmailVerification);
