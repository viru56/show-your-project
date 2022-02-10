import React, { PureComponent } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
  Avatar,
  Popover,
  Grid,
  Button,
  Divider,
  Snackbar,
  ClickAwayListener,
  Paper,
  CircularProgress,
  Box,
  LinearProgress,
  Backdrop,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { withRouter, Link, NavLink } from "react-router-dom";
import { signOut } from "../../store/actions/user_action";
import { connect } from "react-redux";
import Logo from "../logo";
import Skeleton from "@material-ui/lab/Skeleton";
import { bindActionCreators } from "redux";
import {
  findAllNotifications,
  updateNotificationMarkAsReak,
  updateNotificationMarkAllAsReak,
} from "../../store/actions/notification_action";
import { findUserDetails, searchUsers } from "../../store/actions/user_action";
import { searchIdeas } from "../../store/actions/pitch_action";
import defaultImage from "../../assets/images/quick-pitch.png";
import { firebaseNotifications } from "../../libs/config";

/* header page of the website */
class Header extends PureComponent {
  state = {
    notifications: [],
    unread: 0,
    showNotification: false,
    userMenuAnchorEl: null,
    userMenuOpen: false,
    mobileMoreAnchorEl: null,
    isMobileMenuOpen: false,
    anchorNotificationEl: null,
    openNotificationPopover: false,
    notificationId: null,
    userAvatar: this.props.User.user.photoUrl,
    loadingPhoto: true,
    homeColor: "#79b44c",
    connectionsColor: "#000",
    favoriteideaColor: "#000",
    homeBold: "lighter",
    connectionBold: "lighter",
    favoriteideaBold: "lighter",
    showSearchPopover: false,
    searchText: "",
    users: [],
    ideas: [],
    isSearching: false,
    activeSearchOption: "",
    backdrop: false,
    snackbar: {
      open: false,
      title: "",
      message: "",
      level: "info",
    },
  };
  timer = null;
  notificationObserver = null;
  componentDidMount() {
    const adminNavPath = ["/admin-dashboard", "/report", "/users", "/ideas"];
    if (this.props.User.user) {
      const notifications = [...this.state.notifications];
      let snackbar = {};
      let type = "";
      this.notificationObserver = firebaseNotifications
        .where("to", "==", this.props.User.user.email)
        .orderBy("createdAt", "desc")
        .onSnapshot(async (querySnapshot) => {
          let unread = this.state.unread;
          await querySnapshot.docChanges().forEach((newNotification) => {
            type = newNotification.type;
            if (type === "added") {
              const notification = newNotification.doc.data();
              notification.id = newNotification.doc.id;
              if (!notification.read) unread++;
              if (this.state.showNotification) {
                snackbar = {
                  open: true,
                  title: "New Notification",
                  message: notification.message,
                  level: "info",
                };
                notifications.unshift(notification);
              } else {
                notifications.push(notification);
              }
            }
          });
          if (type === "added") {
            await this.setState({
              unread,
              notifications,
              showNotification: true,
              snackbar,
            });
            if (this.state.showNotification) {
              await this.props.findUserDetails(this.props.User.user.email);
            }
          }
        });
    }
    if (this.props.User.user.role === "admin") {
      if (adminNavPath.indexOf(this.props.location.pathname) === -1) {
        this.props.history.push("/admin-dashboard");
      }
    } else {
      if (adminNavPath.indexOf(this.props.location.pathname) > -1) {
        this.props.history.push("/");
      }
    }
  }
  componentWillUnmount() {
    if (this.notificationObserver) this.notificationObserver();
  }
  getNotificationData = async (notification) => {
    if (notification) {
      await this.props.findUserDetails(this.props.User.user.email);
    }
    const snackbar = notification ? notification : { open: false };
    await this.props.findAllNotifications(this.props.User.user.email);
    let unread = 0;
    if (this.props.Notification.notifications) {
      for (const noti of this.props.Notification.notifications) {
        if (!noti.read) unread++;
      }
    }
    await this.setState({
      notifications: this.props.Notification.notifications,
      unread,
      snackbar,
    });
  };
  handleMenuOpen = (event) => {
    this.setState({
      userMenuAnchorEl: event.currentTarget,
      userMenuOpen: true,
    });
  };
  handleMobileMenuOpen = (event) => {
    this.setState({
      mobileMoreAnchorEl: event.currentTarget,
      isMobileMenuOpen: true,
    });
  };
  logOut = async () => {
    await signOut();
    setTimeout(this.props.history.push("/login"), 1000);
  };
  handleUserMenuClose = (route) => {
    this.setState({ userMenuAnchorEl: null, userMenuOpen: false });
    if (route) {
      this.props.history.push(route);
    }
  };
  handleMobileMenuClose = (route) => {
    this.setState({ mobileMoreAnchorEl: null, isMobileMenuOpen: false });
    if (route) {
      this.props.history.push(route);
    }
  };

  handleNotificationMenuOpen = (event) => {
    this.setState({
      anchorNotificationEl: event.currentTarget,
      openNotificationPopover: true,
      notificationId: "notification-popover",
    });
  };
  handleNotificationMenuClose = () => {
    this.setState({
      anchorNotificationEl: null,
      openNotificationPopover: false,
      notificationId: undefined,
    });
  };
  markAllAsRead = async () => {
    if (this.state.unread > 0) {
      this.setState({ backdrop: true });
      await this.props.updateNotificationMarkAllAsReak();
      this.getNotificationData();
      await this.setState({ backdrop: false, unread: 0 });
      this.handleNotificationMenuClose();
    }
  };
  markAsRead = async (notification, index) => {
    if (!notification.read) {
      await this.props.updateNotificationMarkAsReak(notification.id);
      const notifications = [...this.state.notifications];
      notifications[index].read = true;
      await this.setState({
        unread: this.state.unread > 0 ? this.state.unread - 1 : 0,
        notifications,
      });
    }
    this.handleNotificationMenuClose();
    if (notification.pitchId)
      this.props.history.push("/detailsIdea/" + notification.pitchId);
  };
  notificationPopover = () => {
    return (
      <Popover
        id={this.state.notificationId}
        open={this.state.openNotificationPopover}
        anchorEl={this.state.anchorNotificationEl}
        onClose={this.handleNotificationMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography
          component="div"
          className="typography"
          style={{ maxWidth: "400px" }}
        >
          <Grid container justifyContent="space-between" alignItems="flex-start">
            <Grid item>
              <Button
                color="default"
                className="no-outline"
                variant="outlined"
                onClick={this.markAllAsRead}
                style={{ textTransform: "inherit" }}
              >
                Mark all as read
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="default"
                variant="outlined"
                onClick={() => {
                  this.handleNotificationMenuClose();
                  this.props.history.push("/account-settings/notification");
                }}
                className="no-outline"
                style={{ textTransform: "inherit" }}
              >
                Settings
              </Button>
            </Grid>
          </Grid>
          <Divider />
          <Grid container>
            <Grid item xs={12} className="messageBox">
              {this.state.notifications.length > 0 ? (
                this.state.notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <Typography
                      component="p"
                      variant="body1"
                      gutterBottom
                      className={notification.read ? "read " : "unread "}
                      onClick={() => {
                        this.markAsRead(notification, index);
                      }}
                    >
                      {notification.message}
                    </Typography>
                    <Divider />
                  </div>
                ))
              ) : (
                <Typography
                  component="p"
                  variant="body1"
                  gutterBottom
                  className="read"
                >
                  You do not have any notification
                </Typography>
              )}
              {this.addBackdrop()}
            </Grid>
            {this.state.notifications.length > 0 && (
              <Grid item xs={12} className="text-center">
                <Link
                  href="#"
                  to="/notification"
                  onClick={(event) => {
                    event.preventDefault();
                    this.handleNotificationMenuClose();
                    this.props.history.push("/notification");
                  }}
                >
                  See All
                </Link>
              </Grid>
            )}
          </Grid>
        </Typography>
      </Popover>
    );
  };
  search = (event) => {
    clearTimeout(this.timer);
    const showSearchPopover = event.target.value.trim() === "" ? false : true;
    this.setState({
      searchText: event.target.value,
      showSearchPopover,
      isSearching: showSearchPopover,
    });
    this.timer = setTimeout(() => {
      this.getUsers();
      if (this.props.User.user.role !== "entrepreneur") {
        this.getIdeas();
      }
    }, 500);
  };
  getUsers = async () => {
    try {
      const users = await searchUsers(this.state.searchText.trim());
      await this.setState({ users, isSearching: false });
    } catch (error) {
      console.log(error);
    }
  };
  getIdeas = async () => {
    try {
      const ideas = await searchIdeas(this.state.searchText.trim());
      await this.setState({ ideas, isSearching: false });
    } catch (error) {
      console.log(error);
    }
  };
  handleClickAway = () => {
    this.setState({ showSearchPopover: false, searchText: "" });
  };
  laodUserAvatar = () => {
    if (this.state.userAvatar) {
      return (
        <div>
          <Avatar
            style={{ display: this.state.loadingPhoto ? "none" : "block" }}
            alt={this.props.User.user.firstName}
            src={this.props.User.user.photoUrl}
            onLoad={() => this.setState({ loadingPhoto: false })}
            onError={() => {
              this.setState({ loadingPhoto: false, userAvatar: null });
            }}
          />
          {this.state.loadingPhoto ? (
            <Skeleton
              animation="wave"
              variant="circle"
              width={40}
              height={40}
            />
          ) : null}
        </div>
      );
    } else {
      return (
        <Avatar className="green">
          {this.props.User.user.firstName[0].toUpperCase() +
            this.props.User.user.lastName[0].toUpperCase()}
        </Avatar>
      );
    }
  };
  addSnackBar = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={this.state.snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          this.setState({ snackbar: { ...this.state.snackbar, open: false } })
        }
        message={
          <div className="snackbar-messages">
            <b>{this.state.snackbar.title}</b> <br />
            {this.state.snackbar.message}
          </div>
        }
        classes={{
          root: `snackbar-${this.state.snackbar.level}`,
        }}
      />
    );
  };
  addBackdrop = () => {
    return (
      <Backdrop
        open={this.state.backdrop}
        style={{ zIndex: 99999, color: "#fff" }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };

  favoriteideaClick = () => {
    this.setState({
      homeColor: "#000",
      connectionsColor: "#000",
      favoriteideaColor: "#79b44c",
    });
  };

  render() {
    return (
      <div className="header noprint">
        <AppBar elevation={1} color="default" className="appBar">
          <Toolbar>
            <Typography
              variant="h6"
              className="title"
              onClick={() =>
                this.props.User.user.role === "admin"
                  ? this.props.history.push("/admin-dashboard")
                  : this.props.history.push("/")
              }
            >
              <Logo width="150" />
            </Typography>
            <div className="appLink">
              {this.props.User.user.role !== "admin" ? (
                <div>
                  <NavLink
                    exact
                    to="/"
                    activeClassName="navbar__link--active"
                    className="link"
                  >
                    Home
                  </NavLink>
                  <NavLink
                    exact
                    to="/connections"
                    activeClassName="navbar__link--active"
                    className="link"
                  >
                    My Connections
                  </NavLink>
                  <NavLink
                    exact
                    to="/people"
                    activeClassName="navbar__link--active"
                    className="link"
                  >
                    People
                  </NavLink>
                  {(this.props.User.user.role === "investor" ||
                    this.props.User.user.role === "expert") && (
                    <NavLink
                      exact
                      to="/bookmarks"
                      activeClassName="navbar__link--active"
                      className="link"
                    >
                      Favourite Ideas
                    </NavLink>
                  )}
                </div>
              ) : (
                <div>
                  <NavLink
                    exact
                    to="/admin-dashboard"
                    activeClassName="navbar__link--active"
                    className="link"
                  >
                    All Requests
                  </NavLink>
                  <NavLink
                    exact
                    to="/report"
                    className="link"
                    activeClassName="navbar__link--active"
                  >
                    Report
                  </NavLink>
                  <NavLink
                    exact
                    to="/ideas"
                    className="link"
                    activeClassName="navbar__link--active"
                  >
                    Ideas
                  </NavLink>
                  <NavLink
                    exact
                    to="/users"
                    className="link"
                    activeClassName="navbar__link--active"
                  >
                    Users
                  </NavLink>
                  {/* {this.props.User.user.role !== "entrepreneur" && (
                    <NavLink to="/bookmarks"
                      onClick={() => this.favoriteideaClick()}
                      className="link"
                      style={{ color: `${this.state.favoriteideaColor}` }}>
                      Favourite Ideas
                    </NavLink>
                  )} */}
                </div>
              )}
            </div>

            <ClickAwayListener onClickAway={this.handleClickAway}>
              <div style={{ position: "relative" }}>
                <div className="search">
                  <div className="searchIcon">
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    value={this.state.searchText}
                    classes={{
                      root: "inputRoot",
                      input: this.state.showSearchPopover
                        ? "active-input inputInput"
                        : "inputInput",
                    }}
                    inputProps={{ "aria-label": "search" }}
                    onChange={this.search}
                  />
                </div>
                {this.state.showSearchPopover && (
                  <Paper className="search-box" elevation={8}>
                    {this.props.User.user.role !== "entrepreneur" && (
                      <Grid container spacing={1} className="pb-1">
                        <Grid item>
                          <div
                            className={
                              this.state.activeSearchOption === "people"
                                ? "active search-option"
                                : "search-option"
                            }
                            onClick={() => {
                              this.setState({
                                activeSearchOption:
                                  this.state.activeSearchOption !== "people"
                                    ? "people"
                                    : "",
                              });
                            }}
                          >
                            People
                          </div>
                        </Grid>
                        <Grid item>
                          <div
                            className={
                              this.state.activeSearchOption === "idea"
                                ? "active search-option"
                                : "search-option"
                            }
                            onClick={() => {
                              this.setState({
                                activeSearchOption:
                                  this.state.activeSearchOption !== "idea"
                                    ? "idea"
                                    : "",
                              });
                            }}
                          >
                            Ideas
                          </div>
                        </Grid>
                      </Grid>
                    )}
                    {this.state.isSearching &&
                      (this.state.users.length > 0 ||
                        this.state.ideas.length > 0) && (
                        <LinearProgress color="primary" />
                      )}
                    {this.props.User.user.role !== "entrepreneur" && (
                      <Divider className="mb-1" />
                    )}
                    {this.state.isSearching &&
                    this.state.users.length === 0 &&
                    this.state.ideas.length === 0 ? (
                      <div className="text-center p-3">
                        <CircularProgress color="primary" />
                      </div>
                    ) : (
                      <>
                        {this.state.users.length > 0 &&
                          this.state.activeSearchOption !== "idea" &&
                          this.state.users.map((item) => (
                            <Grid
                              container
                              key={item.id}
                              spacing={1}
                              className="item"
                            >
                              <Grid
                                item
                                className="d-flex cursor-pointer"
                                onClick={() =>
                                  this.props.history.push(item.url)
                                }
                              >
                                <Avatar
                                  alt={item.name}
                                  src={item.photoUrl || defaultImage}
                                />
                                <Box
                                  component="h6"
                                  className="capital"
                                  m={1}
                                  fontWeight="fontWeightBold"
                                >
                                  {item.name}
                                  {!this.state.activeSearchOption && (
                                    <i className="item-info">in People</i>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          ))}
                        {this.state.ideas.length > 0 &&
                          this.state.activeSearchOption !== "people" &&
                          this.state.ideas.map((item) => (
                            <Grid
                              container
                              key={item.id}
                              spacing={1}
                              className="item"
                            >
                              <Grid
                                item
                                className="d-flex cursor-pointer"
                                onClick={() =>
                                  this.props.history.push(item.url)
                                }
                              >
                                <Avatar
                                  alt={item.name}
                                  src={item.photoUrl || defaultImage}
                                />
                                <Box
                                  component="h6"
                                  className="capital"
                                  m={1}
                                  fontWeight="fontWeightBold"
                                >
                                  {item.name}
                                  {!this.state.activeSearchOption && (
                                    <i className="item-info">in Ideas</i>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          ))}
                        {!this.state.isSearching &&
                          this.state.activeSearchOption === "" &&
                          this.state.users.length === 0 &&
                          this.state.ideas.length === 0 && (
                            <div className="text-center p-3">
                              {" "}
                              No result found
                            </div>
                          )}
                        {!this.state.isSearching &&
                          this.state.users.length === 0 &&
                          this.state.activeSearchOption === "people" && (
                            <div className="text-center p-3">
                              {" "}
                              No user found
                            </div>
                          )}
                        {!this.state.isSearching &&
                          this.state.ideas.length === 0 &&
                          this.state.activeSearchOption === "idea" && (
                            <div className="text-center p-3">
                              {" "}
                              No idea found
                            </div>
                          )}
                      </>
                    )}
                  </Paper>
                )}
              </div>
            </ClickAwayListener>

            <div className="grow" />
            <div className="sectionDesktop">
              <IconButton
                aria-label="show new mails"
                color="inherit"
                className="no-outline"
                onClick={() => this.props.history.push("/contact")}
              >
                <Badge color="default">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                aria-label="show new notifications"
                color="inherit"
                className="no-outline"
                onClick={this.handleNotificationMenuOpen}
              >
                <Badge
                  badgeContent={this.state.unread}
                  color="secondary"
                  classes={{
                    colorSecondary: "badgeBgColor",
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar-desktop"
                aria-haspopup="true"
                onClick={this.handleMenuOpen}
                color="inherit"
                className="no-outline"
              >
                {this.laodUserAvatar()}
              </IconButton>
              <Menu
                id="menu-appbar-desktop"
                anchorEl={this.state.userMenuAnchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={this.state.userMenuOpen}
                onClose={this.handleUserMenuClose}
              >
                <MenuItem
                  onClick={() =>
                    this.handleUserMenuClose("/account-settings/profile")
                  }
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={this.logOut}>Sign out</MenuItem>
              </Menu>
            </div>
            <div className="sectionMobile">
              <IconButton
                aria-label="show more"
                aria-controls="menu-appbar-mobile"
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
                className="no-outline"
              >
                {this.laodUserAvatar()}
              </IconButton>
              <Menu
                anchorEl={this.state.mobileMoreAnchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                id="menu-appbar-mobile"
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={this.state.isMobileMenuOpen}
                onClose={this.handleMobileMenuClose}
              >
                <MenuItem
                  onClick={() =>
                    this.handleMobileMenuClose("/account-settings/profile")
                  }
                >
                  Profile
                </MenuItem>
                {this.props.User.user.role !== "admin" && (
                  <div>
                    <MenuItem
                      onClick={() => this.handleMobileMenuClose("/connections")}
                    >
                      My Connections
                    </MenuItem>
                    <MenuItem
                      onClick={() => this.handleMobileMenuClose("/people")}
                    >
                      People
                    </MenuItem>
                  </div>
                )}
                {(this.props.User.user.role === "investor" ||
                  this.props.User.user.role === "expoert") && (
                  <MenuItem
                    onClick={() => this.handleMobileMenuClose("/bookmarks")}
                  >
                    Favourite Ideas
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => this.handleMobileMenuClose("/notification")}
                >
                  notifications
                </MenuItem>
                <MenuItem
                  onClick={() => this.handleMobileMenuClose("/contact")}
                >
                  Contact us
                </MenuItem>
                {this.props.User.user.role === "admin" && (
                  <div>
                    <MenuItem
                      onClick={() =>
                        this.handleMobileMenuClose("/admin-dashboard")
                      }
                    >
                      All Request
                    </MenuItem>
                    <MenuItem
                      onClick={() => this.handleMobileMenuClose("/report")}
                    >
                      Report
                    </MenuItem>
                    <MenuItem
                      onClick={() => this.handleMobileMenuClose("/users")}
                    >
                      Users
                    </MenuItem>
                    <MenuItem
                      onClick={() => this.handleMobileMenuClose("/ideas")}
                    >
                      Ideas
                    </MenuItem>
                  </div>
                )}
                <MenuItem onClick={this.logOut}>Sign out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        {this.notificationPopover()}
        {this.addSnackBar()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
    Notification: state.Notification,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      findAllNotifications,
      updateNotificationMarkAsReak,
      updateNotificationMarkAllAsReak,
      findUserDetails,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
