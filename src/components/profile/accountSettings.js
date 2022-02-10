import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Backdrop,
  CircularProgress,
  Snackbar,
  Grid,
  AppBar,
  Paper,
} from "@material-ui/core";
import Page from "../page";
import SettingsIcon from "@material-ui/icons/Settings";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SecurityIcon from "@material-ui/icons/Security";
import LockIcon from "@material-ui/icons/Lock";
import ProfileSettings from "./ProfileSetting";
import NotificationSettings from "./notificationSettings";
import PasswordSettings from "./passwordSettings";
import SecuritySettings from "./securitySettings";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

/* change your account settings like update your details, change notifictions settings, change password, make your profile public/private */
export default function AccountSettings() {
  const user = useSelector((state) => state.User.user);
  const dispatch = useDispatch();
  const params = useParams();
  const [value, setValue] = useState(0);
  const [tab, setTab] = useState("profile");
  const [backdrop, setBackdrop] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    title: "",
    message: "",
    level: "",
  });
  useEffect(() => {
    if (params.tab === "notification") {
      setValue(1);
      setTab("notification");
    }else if(params.tab === "profile"){
      setValue(0);
      setTab("profile");
    }else{
      setValue(0);
      setTab("profile");
    }
  }, [params.tab]);
  const showHideBackdrop = (value) => {
    setBackdrop(value);
  };
  const showSnackbar = (title, message, level) => {
    setSnackbar({
      open: true,
      title: title || "Update Details",
      message: message || "Your details are updated",
      level: level || "success",
    });
  };
  const handleChange = async (event, value) => {
    await setValue(value);
    if (value === 0) {
      setTab("profile");
    } else if (value === 1) {
      setTab("notification");
    } else if (value === 2) {
      setTab("password");
    } else if (value === 3) {
      setTab("security");
    }
  };
  const addBackdrop = () => {
    return (
      <Backdrop open={backdrop} style={{ zIndex: 99999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };
  const addSnackBar = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false })}
        message={
          <div>
            <b>{snackbar.title}</b> <br />
            {snackbar.message}
          </div>
        }
        classes={{
          root: `snackbar-${snackbar.level}`,
        }}
      />
    );
  };
  return (
    <Page className="Profile">
      <div className="tab-container">
        <Grid container>
          <Grid item xs={12} sm={12} md={12} ld={12}>
            <AppBar
              position="static"
              color="default"
              style={{ background: "#fff" }}
            >
              <Tabs
                scrollButtons="auto"
                variant="scrollable"
                orientation="horizontal"
                value={value}
                onChange={handleChange}
                aria-label="account-settings"
                className="tabs"
                indicatorColor="primary"
              >
                <Tab
                  icon={<SettingsIcon className="tab-icon" />}
                  className="tab"
                  label="Profile"
                  id="profile"
                  aria-controls="profile"
                />
                <Tab
                  icon={<NotificationsIcon className="tab-icon" />}
                  className="tab"
                  label="Notifications"
                  id="notification"
                  aria-controls="notification"
                />
                <Tab
                  icon={<LockIcon className="tab-icon" />}
                  className="tab"
                  label="Password"
                  id="password"
                  aria-controls="password"
                />
                {(user.role === "investor" || user.role === "expert") && (
                  <Tab
                    icon={<SecurityIcon className="tab-icon" />}
                    className="tab"
                    label="Security"
                    id="security"
                    aria-controls="security"
                  />
                )}
              </Tabs>
            </AppBar>
          </Grid>
          <Grid item xs={12} sm={12} ld={12} md={12}>
            <Paper elevation={3} className="mb-3">
              <ProfileSettings
                name={tab}
                showHideBackdrop={showHideBackdrop}
                showSnackbar={showSnackbar}
              />
              <NotificationSettings
                name={tab}
                user={user}
                dispatch={dispatch}
                showHideBackdrop={showHideBackdrop}
                showSnackbar={showSnackbar}
              />
              <PasswordSettings
                name={tab}
                user={user}
                dispatch={dispatch}
                showHideBackdrop={showHideBackdrop}
                showSnackbar={showSnackbar}
              />
              <SecuritySettings
                name={tab}
                user={user}
                dispatch={dispatch}
                showHideBackdrop={showHideBackdrop}
                showSnackbar={showSnackbar}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
      {addBackdrop()}
      {addSnackBar()}
    </Page>
  );
}
