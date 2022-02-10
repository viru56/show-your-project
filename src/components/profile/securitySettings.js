import React, { useState } from "react";
import { Typography, Grid, Divider, Button, Switch } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUserDetails } from "../../store/actions/user_action";

/* make your profile public or private, this page is for investor and expert only */
function SecuritySettings(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User.user);
  const [editForm, setEditForm] = useState(false);
  const [profile, setProfile] = useState(
    user.profile && user.profile === "private" ? false : true
  );
  const resetForm = () => {
    setProfile(user.profile && user.profile === "private" ? false : true);
    setEditForm(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.preventDefault();
    const data = { ...user, profile: profile ? "public" : "private" };
    props.showHideBackdrop(true);
    await dispatch(updateUserDetails(data));
    props.showHideBackdrop(false);
    setEditForm(false);
    props.showSnackbar("Update details", "your profile settings is changed");
  };
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={props.name !== "security"}
      id="security"
      aria-labelledby="Security"
      className="security-tab"
    >
      <form
        noValidate
        autoComplete="off"
        className="profile-form"
        onSubmit={handleSubmit}
      >
        <Grid container justifyContent="flex-end" alignItems="center">
          <Grid item className="p-3">
            {!editForm && (
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => setEditForm(true)}
              >
                Edit
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid container className="pb-3" alignItems="center">
          <Grid item sm={3} xs={3} md={6} ld={6}>
            <label>Profile</label>
          </Grid>
          <Grid item sm={9} xs={9} md={6} ld={6}>
            {editForm ? (
              <Grid container alignItems="center" spacing={3}>
                <Grid item>Private</Grid>
                <Grid item>
                  <Switch
                    checked={profile}
                    value={profile}
                    onChange={(e) => setProfile(e.target.checked)}
                    color="primary"
                    inputProps={{ "aria-label": "profile" }}
                  />
                </Grid>
                <Grid item>Public</Grid>
              </Grid>
            ) : (
              <label>{profile ? "Public" : "Private"}</label>
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
                <Button color="primary" variant="contained" type="submit">
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

export default withRouter(SecuritySettings);
