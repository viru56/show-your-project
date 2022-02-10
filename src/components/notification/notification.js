import React, { PureComponent } from "react";
import Page from "../page";
import { Container, Box, Grid, Button, Divider, Avatar } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { withRouter } from "react-router";
import { connect } from "react-redux";
/* you can see all your notifications */
class Notification extends PureComponent {
  render() {
    return (
      <Page className="notification">
        <Container>
          <Grid container justifyContent="space-between" alignItems="flex-start">
            <Grid item>
              <Box fontWeight="fontWeightBold" fontSize="1.2rem">
                Notification
              </Box>
            </Grid>
            <Grid item>
              <Button
                className="no-outline"
                color="primary"
                onClick={event => {
                  event.preventDefault();
                  this.props.history.push("/account-settings/notification");
                }}
              >
                Notification settings
              </Button>
            </Grid>
          </Grid>
          <Divider />
          <Grid container className="message-box">
            {this.props.Notification &&
            this.props.Notification.notifications &&
            this.props.Notification.notifications.length > 0 ? (
              this.props.Notification.notifications.map(notification => (
                <Grid item key={notification.id} xs={12}>
                  <Box className="message-text">
                    <Avatar src={notification.avatar}>
                      <AccountCircleIcon />
                    </Avatar>
                    <span className="p-2">{notification.message}</span>
                  </Box>
                  <Divider />
                </Grid>
              ))
            ) : (
              <Box>You do not have any notification</Box>
            )}
          </Grid>
        </Container>
      </Page>
    );
  }
}

const mapStateToProps = state => {
  return {
    Notification: state.Notification
  };
};

export default connect(mapStateToProps)(withRouter(Notification));
