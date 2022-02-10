import React, { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Badge,
  Typography,
  Tooltip,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import defaultImage from "../../assets/images/quick-pitch.png";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";


/* show all connected users and ideas you created or you are a part of that idea */
export default function ConnectionDialog(props) {
  const currentUser = useSelector((state) => state.User.user);
  const [state, setState] = useState({
    photoUrl: currentUser.photoUrl,
    loadingPhoto: true,
    open: false,
  });
  const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
      color: "#1B71FB",
    },
    tooltip: {
      backgroundColor: "#1B71FB",
    },
  }));

  function IdeaTitleTooltip(props) {
    const classes = useStylesBootstrap();

    return <Tooltip classes={classes} {...props} />;
  }
  const toggle = () => {
    setState({
      ...state,
      open: !state.open,
    });
  };
  const laodUserAvatar = () => {
    if (state.photoUrl) {
      return (
        <div>
          <Avatar
            style={{ display: state.loadingPhoto ? "none" : "block" }}
            className="photo"
            alt={currentUser.firstName}
            src={state.photoUrl}
            onLoad={() => setState({ ...state, loadingPhoto: false })}
            onError={() => {
              setState({ ...state, loadingPhoto: false, photoUrl: null });
            }}
          />
          {state.loadingPhoto ? (
            <Skeleton
              animation="wave"
              variant="circle"
              width={32}
              height={32}
            />
          ) : null}
        </div>
      );
    } else {
      return (
        <Avatar className="photo-name">
          {currentUser.firstName[0].toUpperCase() +
            currentUser.lastName[0].toUpperCase()}
        </Avatar>
      );
    }
  };
  const showLastMessage = (message) => {
    let text = "";
    if (message.sender === currentUser.email) {
      text += "You: ";
    } else {
      text += message.name.split(" ")[0] + ": ";
    }
    text += message.content.substr(0, 25);
    if (message.content.length > 25) {
      text += "...";
    }
    return <div className="last-message">{text}</div>;
  };
  const showName = (name, type) => {
    if (type === "group") {
      name = "Team " + name;
    }
    if (name.length > 22) {
      name = name.substr(0, 19);
      name += "...";
    }
    return name;
  };
  return (
    <div className="connection-dialog">
      <div className="header" onClick={toggle}>
        {laodUserAvatar()}
        <Box className="pl-3" fontWeight="fontWeightBold">
          <Badge
            badgeContent={!state.open ? props.allUnreadMessages : 0}
            color="secondary"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            classes={{
              colorSecondary: "badgeSecondary",
              anchorOriginTopRightRectangular: "badge-position",
            }}
          >
            <Typography variant="h6">Messaging</Typography>
          </Badge>
        </Box>
      </div>
      {state.open && (
        <div className="connections">
          {props.connections.length > 0 ? (
            props.connections.map((connection) => (
              <div key={connection.id}>
                <Divider style={{ marginLeft: 42 }} />
                <div
                  className="connection"
                  onClick={() =>
                    props.openChatDialog(
                      connection.id,
                      connection.email ? "single" : "group"
                    )
                  }
                >
                  <Avatar
                    src={connection.avatar || defaultImage}
                    className="photo"
                  />
                  <Box className="pl-1 name">
                    <Badge
                      badgeContent={connection.unread}
                      color="secondary"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      classes={{
                        colorSecondary: "badgeSecondary",
                        anchorOriginTopRightRectangular: "badge-position",
                      }}
                    >
                      {connection.name.length > 19 ? (
                        <IdeaTitleTooltip title={connection.name}>
                          <span className="capital">
                            {showName(
                              connection.name,
                              connection.email ? "single" : "group"
                            )}
                          </span>
                        </IdeaTitleTooltip>
                      ) : (
                        <span className="capital">
                          {showName(
                            connection.name,
                            connection.email ? "single" : "group"
                          )}
                        </span>
                      )}
                    </Badge>
                    {connection.lastMessage &&
                      showLastMessage(connection.lastMessage)}
                  </Box>
                </div>
              </div>
            ))
          ) : (
            <Box className="p-1 text-center">No Connection found</Box>
          )}
        </div>
      )}
    </div>
  );
}
