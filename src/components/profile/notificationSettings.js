import React, { useState } from "react";
import { Typography, Grid, Divider, Button, Switch, Box } from "@material-ui/core";
import { updateUserDetails } from "../../store/actions/user_action";

/* change notifications settings  */
export default function NotificationSettings(props) {
  const [editForm, setEditForm] = useState(false);
  const [notification, setnotification] = useState(
    props.user.notification || {
      comment: true,
      like: true,
      vote:true,
      joinInvestorOrExpert: true,
      joinTeamMember: true,
    }
  );
  const handleChange = (name) => (event) => {
    const newNotification = { ...notification };
    newNotification[name] = event.target.checked;
    setnotification(newNotification);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { ...props.user, notification };
    props.showHideBackdrop(true);
    await props.dispatch(updateUserDetails(data));
    props.showHideBackdrop(false);
    setEditForm(false);
    props.showSnackbar(
      "Update details",
      "Your notification settings is changed"
    );
  };
  const resetForm = () => {
    setnotification({
      ...(props.user.notification || {
        comment: true,
        like: true,
        vote:true,
        joinInvestorOrExpert: true,
        joinTeamMember: true,
      }),
    });
    setEditForm(false);
  };
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={props.name !== "notification"}
      id="notification"
      aria-labelledby="Notification"
      className="notification-tab"
    >
      <form
        noValidate
        autoComplete="off"
        className="profile-form"        onSubmit={handleSubmit}
      >
        <Grid container justifyContent="space-between" alignItems="center" className="pt-3 pb-3">
          <Grid item xs={9}>
            <Box fontWeight="fontWeightBold">I would like to receive notifications for:</Box>
          </Grid>
          <Grid item xs={3}>
            {!editForm && (
              <Button variant="outlined" color="secondary" onClick={() => setEditForm(true)}>
                Edit
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item sm={9} xs={9} md={6} ld={6}>
            <label>Comments on your idea</label>
          </Grid>
          <Grid item sm={3} xs={3} md={6} ld={6}>
            {editForm ? (
              <Switch
                checked={notification.comment}
                onChange={handleChange("comment")}
                value={notification.comment}
                color="primary"
                inputProps={{ "aria-label": "comment" }}
              />
            ) : (
                <label>{notification.comment ? "Yes" : "No"}</label>

              )}
          </Grid>
        </Grid>
        <Divider className="divider" />
        <Grid container>
          <Grid item sm={9} xs={9} md={6} ld={6}>
            <label>Like on your comment</label>
          </Grid>
          <Grid item sm={3} xs={3} md={6} ld={6}>
            {editForm ? (
              <Switch
                checked={notification.like}
                onChange={handleChange("like")}
                value={notification.like}
                color="primary"
                inputProps={{ "aria-label": "like or dislike" }}
              />
            ) : (
                <label>{notification.like ? "Yes" : "No"}</label>
              )}
          </Grid>
        </Grid>
        <Divider className="divider" />
        <Grid container>
          <Grid item sm={9} xs={9} md={6} ld={6}>
            <label>Upvote & Downvote on Idea</label>
          </Grid>
          <Grid item sm={3} xs={3} md={6} ld={6}>
            {editForm ? (
              <Switch
                checked={notification.vote}
                onChange={handleChange("vote")}
                value={notification.vote}
                color="primary"
                inputProps={{ "aria-label": "upvote or downvote" }}
              />
            ) : (
                <label>{notification.vote ? "Yes" : "No"}</label>
              )}
          </Grid>
        </Grid>
        <Divider className="divider" />
        <Grid container>
          <Grid item sm={9} xs={9} md={6} ld={6}>
            <label>Request to join as an Expert or an Investor</label>
          </Grid>
          <Grid item sm={3} xs={3} md={6} ld={6}>
            {editForm ? (
              <Switch
                checked={notification.joinInvestorOrExpert}
                onChange={handleChange("joinInvestorOrExpert")}
                value={notification.joinInvestorOrExpert}
                color="primary"
                inputProps={{ "aria-label": "join expert or investor" }}
              />
            ) : (
                <label>{notification.joinInvestorOrExpert ? "Yes" : "No"}</label>
              )}
          </Grid>
        </Grid>
        <Divider className="divider" />
        <Grid container>
          <Grid item sm={9} xs={9} md={6} ld={6}>
            <label>Request to join as a Team member</label>
          </Grid>
          <Grid item sm={3} xs={3} md={6} ld={6}>
            {editForm ? (
              <Switch
                checked={notification.joinTeamMember}
                onChange={handleChange("joinTeamMember")}
                value={notification.joinTeamMember}
                color="primary"
                inputProps={{ "aria-label": "join team member" }}
              />
            ) : (
                <label>{notification.joinTeamMember ? "Yes" : "No"}</label>
              )}
          </Grid>
        </Grid>
        {editForm && (
          <div>
            <Divider className="divider" />
            <Grid
              container
              justifyContent="flex-end"
              alignItems="center"
              spacing={3}
              className="p-3"
            >
              <Grid item>
                <Button onClick={resetForm}>Cancel</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  Update
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </form>
    </Typography>
  );
}
