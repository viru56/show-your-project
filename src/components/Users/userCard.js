import React, { useState } from "react";
import {
  makeStyles,
  Card,
  Typography,
  Button,
  CardMedia,
  Divider,
} from "@material-ui/core";
import defaultImage from "../../assets/images/quick-pitch.png";
import csc from "country-state-city";
import { withRouter } from "react-router";
const useStyles = makeStyles({
  root: {
    //fontFamily:'Poppins',
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    width: 250,
  },
  cardImage: {
    height: 120,
    width: 120,
    margin: "0 auto",
    borderRadius: "50%",
    position: "relative",
    zIndex: 10,
    cursor: "pointer",
  },
  actionButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  userName: {
    cursor: "pointer",
    minHeight: 60,
    textTransform: "capitalize",
    "&:hover": {
      textDecoration: "underline",
      color: "#007bff",
    },
  },
  hrLine: {
    position: "relative",
    top: 69,
  },
  secondaryButton: {
    backgroundColor: "#1a5749",
    borderColor: "#1a5749",
    color: "#fff",
  },
  role: {
    color: "#999",
    fontWeight: "bold",
  },
});

/* this is a user card, shor detials of user, we are using this on admin, people, details idea, users page */
function UserCard(props) {
  const { user } = props;

  const classes = useStyles();
  const [photo, setPhoto] = useState(
    user.photoUrl || user.avatar || defaultImage
  );
  return (
    <div>
      <Divider className={classes.hrLine} />
      <Card className={classes.root}>
        <CardMedia
          component="img"
          src={photo}
          alt="not found"
          className={classes.cardImage}
          onError={() => setPhoto(defaultImage)}
          onClick={() => props.history.push("/profile/" + user.uid)}
        />
        <Typography
          variant="h6"
          className={classes.userName + " overflow-ellipses"}
          onClick={() => props.history.push("/profile/" + user.uid)}
        >
          {user.firstName} {user.lastName} {user.name}
        </Typography>
        <Typography>
          {isNaN(user.city) ? user.city : csc.getCityById(user.city).name}
        </Typography>

        <Typography className={`capital mt-2 mb-2 ${classes.role}`}>
          {user.role}
        </Typography>

        {props.connect && (
          <Button
            color="primary"
            variant="outlined"
            onClick={() => props.connect(user)}
            className={`${classes.actionButton} no-outline`}
            disabled={user.isRequested}
          >
            {user.isRequested ? "Requested" : "Connect"}
          </Button>
        )}
        {props.delete && (
          <Button
            variant="contained"
            onClick={() => props.delete(user)}
            className={`${classes.secondaryButton} no-outline mt-3 mb-3`}
          >
            Delete
          </Button>
        )}
      </Card>
    </div>
  );
}

export default withRouter(UserCard);
