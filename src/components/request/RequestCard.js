import React from "react";
import {
  Paper,
  Box,
  Link,
  Typography,
  Grid,
  Avatar,
  makeStyles,
} from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { withRouter } from "react-router";
const useStyles = makeStyles({
  paper: {
    padding: 10,
    marginBottom: 10,
  },
  header: {
    textAlign: "center",
  },
  subHeader: {
    textAlign: "right",
    borderBottom: "1px solid #ccc",
    marginBottom: 10,
  },
  requestList: {
    padding: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
});
/* show on dashboad page  see who invite you as a team member or who wants to connect with you, you can approve/ reject request */
function RequestCard(props) {
  const classes = useStyles();
  return (
    <Paper className={classes.paper} elevation={1}>
      <Box fontSize="1.2rem" className={classes.header}>
        Requests
      </Box>
      <Box className={classes.subHeader}>
        <Link
          className={classes.link + ' fs-14'}
          color="primary"
          href="/requests"
          to="/requests"
          onClick={(event) => {
            event.preventDefault();
            props.history.push("/requests");
          }}
        >
          See all
        </Link>
      </Box>
      {props.connections &&
        props.connections.length > 0 &&
        props.connections.map((con, index) => (
          <div key={index}>
            {!con.isConnected && (
              <Paper className={classes.requestList}>
                <Grid container>
                  <Grid item xs={2}>
                    <Avatar
                      src={con.avatar}
                      className="cursor-pointer"
                      onClick={() =>
                        props.history.push("/profile/" + con.uid)
                      }
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <Box>
                      <Typography component="div" variant="subtitle2">
                        <div
                          className="cursor-pointer capital"
                          onClick={() =>
                            props.history.push("/profile/" + con.uid)
                          }
                        >
                          {con.name}
                        </div>
                      </Typography>
                      <Typography
                        component="div"
                        variant="caption"
                        className="capital"
                      >
                        {con.role}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2} className="pt-2">
                    <CheckCircleOutlineIcon
                      className="cursor-pointer"
                      style={{ color: '#1B71FB' }}
                      onClick={() =>
                        props.acceptorCancelConnectionRequest(
                          con.email,
                          "accept"
                        )
                      }
                    />
                    <CancelOutlinedIcon
                      className="cursor-pointer"
                      style={{ color: "#ff7043" }}
                      onClick={() =>
                        props.acceptorCancelConnectionRequest(
                          con.email,
                          "reject"
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
          </div>
        ))}
      {props.requests &&
        props.requests.length > 0 &&
        props.requests.map((request, index) => (
          <Paper className={classes.requestList} key={index}>
            <Grid container>
              <Grid item xs={2}>
                <Avatar
                  src={request.avatar}
                  className="cursor-pointer"
                  onClick={() =>
                    props.history.push("/profile/" + request.uid)
                  }
                />
              </Grid>
              <Grid item xs={8}>
                <Box>
                  <Typography component="div" variant="subtitle2">
                    <div
                      className="cursor-pointer capital"
                      onClick={() =>
                        props.history.push("/profile/" + request.uid)
                      }
                    >
                      {request.name}
                    </div>

                    <Typography
                      component="span"
                      variant="caption"
                      className="capital"
                    >
                      {request.role[0].toUpperCase() + request.role.substr(1)}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      component="p"
                      className="cursor-pointer"
                      onClick={() =>
                        props.history.push("/detailsIdea/" + request.pitchId)
                      }
                    >
                      <span style={{ fontWeight: 100 }}> Idea -</span>
                      {request.pitchTitle}
                    </Typography>
                  </Typography>

                </Box>
              </Grid>
              <Grid item xs={2} className="pt-2">
                <CheckCircleOutlineIcon
                  className="cursor-pointer"
                  style={{ color: '#1B71FB' }}
                  onClick={() =>
                    props.acceptorCancelRequest(request.pitchId,request.email, "accept")
                  }
                />
                <CancelOutlinedIcon
                  className="cursor-pointer"
                  style={{ color: "#ff7043" }}
                  onClick={() =>
                    props.acceptorCancelRequest(request.pitchId,request.email, "cancel")
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      {props.connections.length === 0 && props.requests.length === 0 && (
        <Typography
          component="div"
          color="textSecondary"
          className="text-center"
          variant="body2"
          gutterBottom
        >
          You do not have any request
        </Typography>
      )}
    </Paper>
  );
}

export default withRouter(RequestCard);
