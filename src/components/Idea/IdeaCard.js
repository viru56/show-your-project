import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Divider,
  Snackbar,
  Box,
  Tooltip,
} from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import ShareIcon from "@material-ui/icons/Share";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import { updateUserDetails } from "../../store/actions/user_action";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as moment from "moment";
import Skeleton from "@material-ui/lab/Skeleton";
import defaultImage from "../../assets/images/quick-pitch.png";
import { updateIdeaDetails } from "../../store/actions/pitch_action";
import { addNotification } from "../../store/actions/notification_action";
import ShareIdeaDialog from "./shareIdeaDialog";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { makeStyles } from "@material-ui/core/styles";

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

  return <Tooltip classes={classes} {...props} placement="top" />;
}
/* idea card, we are using this in the dashboad page and admin idea page */
function IdeaCard(props) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    title: "",
    message: "",
    level: "info",
  });
  const [ideaSavedIndex, setIdeaSavedIndex] = useState(
    props.User.user.savedIdeas
      ? props.User.user.savedIdeas.indexOf(props.idea.id)
      : -1
  );
  const [idea, setIdea] = useState(props.idea);
  const [image, setImage] = useState({ loading: true, height: 0 });
  const textLimit = (text, limit = 200) => {
    let result = text ? text.substring(0, limit) : "";
    if (text && text.length > limit) {
      result = result.substring(0, limit - 3) + "...";
    }
    return result;
  };
  const shareIdea = (event) => {
    setshareIdeaDialogOpen(true);
  };
  const handleShareIdeaDialogClose = (idea) => {
    if (idea) {
      setIdea(setIdea);
      const snackbar = {
        open: true,
        title: "Idea shared successfully",
        message: "",
        level: "success",
      };
      setSnackbar(snackbar);
    }
    setshareIdeaDialogOpen(false);
  };
  const [shareIdeaDialogOpen, setshareIdeaDialogOpen] = useState(false);
  const bookmarkIdea = async (event) => {
    event.stopPropagation();
    const user = props.User.user;
    let title = "Idea Added";
    let message = "Your idea has been added to Favourites";
    const index = user.savedIdeas ? user.savedIdeas.indexOf(props.idea.id) : -1;
    if (index > -1) {
      user.savedIdeas.splice(index, 1);
      setIdeaSavedIndex(-1);
      title = "Idea Removed";
      message = "Your idea has been removed from Favourites";
    } else {
      user.savedIdeas
        ? user.savedIdeas.push(props.idea.id)
        : (user.savedIdeas = [props.idea.id]);
      setIdeaSavedIndex(user.savedIdeas.length - 1);
    }
    await props.updateUserDetails(user);
    if (props.refreshSavedIdea) props.refreshSavedIdea();
    setSnackbar({ open: true, title, message, level: "info" });
  };

  return (
    <div>
      <Card className="idea-card">
        {image.loading ? (
          <Skeleton animation="wave" variant="rect" height="200px" />
        ) : null}
        <CardMedia
          component="img"
          alt={
            idea.images.pitchImages[0]
              ? idea.images.pitchImages[0].name
              : "no-image"
          }
          height={image.height}
          image={
            idea.images.pitchImages[0]
              ? idea.images.pitchImages[0].url
              : defaultImage
          }
          title={
            idea.images.pitchImages[0]
              ? idea.images.pitchImages[0].name
              : "no-title"
          }
          onLoad={() => setImage({ loading: false, height: 200 })}
          onClick={() => {
            props.history.push("/detailsIdea/" + idea.id);
          }}
          className="cursor-pointer idea-image"
        />
        <div className="icons">
          {props.delete ? (
            <div>
              <DeleteForeverIcon
                className="cursor-pointer"
                style={{ color: "#1a5749" }}
                onClick={() => props.delete(idea.id)}
              />
            </div>
          ) : (
            <div>
              {props.User.user.role !== "entrepreneur" && (
                <div>
                  {ideaSavedIndex > -1 ? (
                    <StarIcon
                      className="icon icon-top"
                      onClick={bookmarkIdea}
                    />
                  ) : (
                    <StarBorderIcon
                      className="icon icon-bottom"
                      onClick={bookmarkIdea}
                    />
                  )}
                </div>
              )}
              <ShareIcon className="icon icon-top fs-20" onClick={shareIdea} />
            </div>
          )}
        </div>
        <CardContent className="pb-1 pt-1">
          <Typography
            gutterBottom
            variant="h6"
            component="h6"
            className="title fs-16"
            onClick={() => {
              props.history.push("detailsIdea/" + idea.id);
            }}
          >
            {idea.title.length > 23 ? (
              <IdeaTitleTooltip title={idea.title}>
                <div>
                  {textLimit(idea.title, 23)}
                  <span>{moment(idea.createdAt.toDate()).format("LL")}</span>
                </div>
              </IdeaTitleTooltip>
            ) : (
              <>
                {textLimit(idea.title, 23)}
                <span>{moment(idea.createdAt.toDate()).format("LL")}</span>
              </>
            )}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            className="fs-13 minHeight-100"
          >
            {textLimit(idea.description, 235)}
          </Typography>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="mt-1"
          >
            <Grid item>
              <Typography
                variant="body1"
                color="textPrimary"
                component="p"
                className="capital fs-15"
              >
                {idea.createdBy}
              </Typography>
            </Grid>
            {props.User.user.email === idea.email && (
              <Grid item>
                <Typography variant="caption" component="p" className="capital">
                  {idea.publish ? "Live" : "Saved"}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Divider />
          {idea.totalFunding && (
            <Typography
              variant="button"
              component="div"
              className="fs-12 pt-5 pb-5"
            >
              $
              {new Intl.NumberFormat("en-CA", {
                maximumSignificantDigits: 3,
              }).format(idea.totalFunding)}
              &nbsp; invested
            </Typography>
          )}

          {((idea.team && idea.team.length > 0) ||
            (idea.investors && idea.investors.length > 0) ||
            (idea.experts && idea.experts.length > 0)) && <Divider />}
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              {idea.team && idea.team.length > 0 && (
                <Typography variant="body2" component="p" className="mt-1">
                  Entrepreneur&nbsp;
                  {idea.team.length +
                    (idea.entrepreneurs && idea.entrepreneurs.length)}
                </Typography>
              )}
            </Grid>
            <Grid item>
              {idea.investors && idea.investors.length > 0 && (
                <Typography
                  variant="body2"
                  component="p"
                  className="fs-12 pt-0 pb-5"
                >
                  Investor&nbsp;{idea.investors.length}
                </Typography>
              )}
            </Grid>
            <Grid item>
              {idea.experts && idea.experts.length > 0 && (
                <Typography
                  variant="body2"
                  component="p"
                  className="fs-12 pt-0 pb-5"
                >
                  Expert&nbsp;{idea.experts.length}
                </Typography>
              )}
            </Grid>
          </Grid>
          {idea.chat && (
            <>
              {(idea.chat.likes || idea.chat.dislikes || idea.chat.shares) && (
                <Divider />
              )}
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  {idea.chat.likes && idea.chat.likes.length > 0 && (
                    <Typography variant="caption" component="p">
                      <ThumbUpAltIcon style={{ fontSize: "15px" }} />
                      &nbsp;{idea.chat.likes.length}
                    </Typography>
                  )}
                </Grid>
                <Grid item>
                  {idea.chat.dislikes && idea.chat.dislikes.length > 0 && (
                    <Typography variant="caption" component="p">
                      <ThumbDownAltIcon style={{ fontSize: "15px" }} />
                      &nbsp;{idea.chat.dislikes.length}
                    </Typography>
                  )}
                </Grid>
                <Grid item>
                  {idea.chat.shares && idea.chat.shares.length > 0 && (
                    <Typography variant="caption" component="p">
                      <ShareIcon style={{ fontSize: "15px" }} />
                      &nbsp;{idea.chat.shares.length}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
        {idea.investorReadyPitch && (
          <Grid
            container
            justifyContent="center"
            elevation={1}
            alignItems="center"
            style={{
              background: "#1B71FB",
              bottom: 0,
              position: "absolute",
            }}
          >
            <Grid item>
              <Box className="ideaBoxButton">Investor ready</Box>
            </Grid>
          </Grid>
        )}
        {!idea.publish && props.User.user.email === idea.email && (
          <Grid
            container
            justifyContent="center"
            elevation={1}
            alignItems="center"
            style={{
              background: "#1a5749",
              bottom: 0,
              position: "absolute",
              cursor: "pointer",
            }}
            onClick={() => props.history.push("/edit-pitch/" + idea.id)}
          >
            <Grid item>
              <Box className="ideaBoxButton complete-pitch-link ">
                Complete your pitch now
              </Box>
            </Grid>
          </Grid>
        )}
      </Card>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false })}
        message={
          <div>
            <b>{snackbar.title}</b> <br />
            {snackbar.message}
          </div>
        }
        classes={{ root: `snackbar-${snackbar.level}` }}
      />
      {shareIdeaDialogOpen && (
        <ShareIdeaDialog
          open={shareIdeaDialogOpen}
          onClose={handleShareIdeaDialogClose}
          idea={props.idea}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
    Idea: state.Idea,
    Notification: state.Notification,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateUserDetails,
      updateIdeaDetails,
      addNotification,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(IdeaCard));
