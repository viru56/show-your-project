import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Typography, Box, Button } from "@material-ui/core";
import notverifiedImageUrl from "../../assets/images/Group303.svg";
import { signOut } from "../../store/actions/user_action";

/* if investor/expert profile is not verified by admin then show this info to user. */
class NotVerified extends Component {
  componentDidMount() {
    if (!this.props.User.user) {
      this.props.history.push("/login");
    }
  }
  redirectToLonin = async () => {
    await signOut();
    setTimeout(this.props.history.push("/login"), 1000);
  };
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
        <Grid item xs={12} sm={8} md={6} style={{ background: "#fff" }}>
          <div className="NotVerified">
            <Grid item container xs={12} spacing={4}>
              <Grid item xs={12}>
                <Grid container direction="column">
                  {this.props.User.user && (
                    <Grid className="desc-name">
                      <Box
                        component="h1"
                        fontSize="1rem"
                        fontWeight="fontWeightBold"
                        className="capital"
                      >
                        {this.props.User.user.firstName}&nbsp;
                        {this.props.User.user.lastName}
                      </Box>
                      <Typography>
                        Your chosen role is&nbsp;
                        <Typography
                          variant="body2"
                          color="primary"
                          component="span"
                          className="capital"
                        >
                          {this.props.User.user.role}
                        </Typography>
                      </Typography>
                    </Grid>
                  )}
                  <Grid item className="descReview">
                    <Typography variant="subtitle1">
                      We are assessing your profile and will contact you as soon
                      as we have approved your profile.
                      <br /> 
                      If any verification is
                      required, we will contact you by email or phone.
                      <br />
                      Meanwhile, please check your inbox for an email from
                      Show Your Project to authenticate your email address.
                    </Typography>
                    <Typography
                      variant={"subtitle1"}
                      style={{ fontWeight: "500" }}
                    >
                      If you have any kind of questions please feel free
                      to&nbsp;
                      <Typography className="contact-us">
                        <Link to="/notVerifiedContact"> contact us.</Link>
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item></Grid>
                  <Grid item className="text-center">
                    <Button
                      color="primary"
                      variant="outlined"
                      className="mt-4"
                      onClick={this.redirectToLonin}
                    >
                      Log in
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
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

export default connect(mapStateToProps)(withRouter(NotVerified));
