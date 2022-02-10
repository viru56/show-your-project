import React, { PureComponent } from "react";
import {
  Grid,
  TextField,
  Avatar,
  Badge,
  Button,
  Typography,
} from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateIdeaDetails } from "../../store/actions/pitch_action";
import { sendNotification } from "../../store/actions/notification_action";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import parse from "html-react-parser";

/* idea chat, any one can comment on the idea, like, reply on the comments */
class IdeaChat extends PureComponent {
  state = {
    commentsCount: this.props.idea.chat?.comments?.length || 0,
    comment: "",
    replyOnCommentIndex: null,
    commentReply: "",
    maxLevel: 3,
    commentMenuAnchorEl: null,
    commentMenuOpen: false,
    editingComment: false,
    newComment: "",
    selectedCommentIndex: null,
  };
  messageRef = React.createRef(null);
  childMsgRef = React.createRef(null);
  componentDidMount() {
    this.scrollToBottom();
  }
  async componentDidUpdate() {
    const commentsCount = this.props.idea.chat?.comments?.length || 0;
    if (commentsCount > this.state.commentsCount) {
      await this.setState({ commentsCount });
      this.scrollToBottom();
    }
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    if (this.state.comment && this.state.comment.trim()) {
      const idea = { ...this.props.idea };
      const chat = idea.chat ? { ...this.props.idea.chat } : {};
      const comment = {
        text: this.state.comment.trim(),
        createdBy:
          this.props.User.user.firstName[0].toUpperCase() +
          this.props.User.user.firstName.substr(1) +
          " " +
          this.props.User.user.lastName[0].toUpperCase() +
          this.props.User.user.lastName.substr(1),
        avatar: this.props.User.user.photoUrl || null,
        createdAt: new Date(),
        email: this.props.User.user.email,
      };
      if (chat.comments) {
        chat.comments.push(comment);
      } else {
        chat.comments = [comment];
      }
      idea.chat = chat;
      await this.setState({ comment: "" });
      this.scrollToBottom();
      await this.props.updateIdeaDetails(idea);
      if (this.props.Idea.error) {
        console.log(this.props.Idea.error);
      }
      // send notification
      if (this.props.idea.email !== this.props.User.user.email) {
        const notification = {
          to: this.props.idea.email,
          from: this.props.User.user.email,
          name: this.props.idea.createdBy,
          senderName:
            this.props.User.user.firstName[0].toUpperCase() +
            this.props.User.user.firstName.substr(1) +
            " " +
            this.props.User.user.lastName[0].toUpperCase() +
            this.props.User.user.lastName.substr(1),
          pitchId: this.props.idea.id,
          pitchTitle: this.props.idea.title,
          avatar: this.props.User.user.photoUrl || null,
          type: "comment",
          sendMail: true,
        };
        await sendNotification(notification);
      }
    }
  };

  handleCommentLike = async (event, commentIndex) => {
    let likeComment = false;
    this.handleCommentMenuClose(event.target.parentNode);
    const like = {
      email: this.props.User.user.email,
      createdAt: new Date(),
    };
    const idea = { ...this.props.idea };
    let updatedComment = idea.chat;
    const commentIndexArr = commentIndex.split("-");
    // find the comment which user like
    // updatedComment is the selected comment
    for (let i = 0; i < commentIndexArr.length; i++) {
      if (i % 2 !== 0) {
        updatedComment = updatedComment.comments[Number(commentIndexArr[i])];
      }
    }
    if (updatedComment.likes) {
      const index = updatedComment.likes.findIndex(
        (l) => l.email === like.email
      );
      if (index === -1) {
        updatedComment.likes.push(like);
        likeComment = true;
      } else {
        updatedComment.likes.splice(index, 1);
      }
    } else {
      updatedComment.likes = [like];
      likeComment = true;
    }
    await this.props.updateIdeaDetails(idea);
    //  send notification
    if (updatedComment.email !== this.props.User.user.email && likeComment) {
      const notification = {
        to: updatedComment.email,
        from: this.props.User.user.email,
        senderName:
          this.props.User.user.firstName[0].toUpperCase() +
          this.props.User.user.firstName.substr(1) +
          " " +
          this.props.User.user.lastName[0].toUpperCase() +
          this.props.User.user.lastName.substr(1),
        name: updatedComment.createdBy,
        pitchId: this.props.idea.id,
        avatar: this.props.User.user.photoUrl || null,
        type: "like",
        sendMail: true,
      };
      await sendNotification(notification);
    }
  };
  handleReplySubmit = async (event) => {
    event.preventDefault();
    if (this.state.commentReply && this.state.commentReply.trim()) {
      const comment = {
        text: this.state.commentReply.trim(),
        createdBy:
          this.props.User.user.firstName[0].toUpperCase() +
          this.props.User.user.firstName.substr(1) +
          " " +
          this.props.User.user.lastName[0].toUpperCase() +
          this.props.User.user.lastName.substr(1),
        avatar: this.props.User.user.photoUrl || null,
        createdAt: new Date(),
        email: this.props.User.user.email,
      };
      const idea = { ...this.props.idea };
      let updatedComment = idea.chat;
      const commentIndexArr = this.state.replyOnCommentIndex.split("-");
      for (let i = 0; i < commentIndexArr.length; i++) {
        if (i % 2 !== 0) {
          updatedComment = updatedComment.comments[Number(commentIndexArr[i])];
        }
      }
      if (updatedComment.comments) {
        updatedComment.comments.push(comment);
      } else {
        updatedComment.comments = [comment];
      }
      this.setState({ commentReply: "", replyOnCommentIndex: null });
      await this.props.updateIdeaDetails(idea);
      if (updatedComment.email !== this.props.User.user.email) {
        // send notification
        const notification = {
          to: updatedComment.email,
          from: this.props.User.user.email,
          senderName:
            this.props.User.user.firstName[0].toUpperCase() +
            this.props.User.user.firstName.substr(1) +
            " " +
            this.props.User.user.lastName[0].toUpperCase() +
            this.props.User.user.lastName.substr(1),
          name: updatedComment.createdBy,
          pitchId: this.props.idea.id,
          avatar: this.props.User.user.photoUrl || null,
          type: "reply",
          sendMail: true,
        };
        await sendNotification(notification);
      }
    } else {
      this.setState({ replyOnCommentIndex: null });
    }
  };
  deleteComment = async (event) => {
    this.handleCommentMenuClose(event.target.parentNode);
    const idea = { ...this.props.idea };
    let updatedComment = idea.chat;
    const commentIndexArr = this.state.selectedCommentIndex.split("-");
    for (let i = 0; i < commentIndexArr.length; i++) {
      if (i % 2 !== 0) {
        updatedComment = updatedComment.comments[Number(commentIndexArr[i])];
      }
    }
    updatedComment.comments.splice(
      Number(
        this.state.selectedCommentIndex[
          this.state.selectedCommentIndex.length - 1
        ]
      ),
      1
    );
    await this.props.updateIdeaDetails(idea);
  };
  scrollToBottom = () => {
    this.messageRef.current.scrollTo(
      0,
      this.childMsgRef.current && this.childMsgRef.current.offsetTop
    );
  };
  handleCommentMenuOpen = (event) => {
    this.setState({
      commentMenuAnchorEl: event.currentTarget,
      commentMenuOpen: true,
    });
  };

  handleCommentMenuClose = () => {
    this.setState({ commentMenuAnchorEl: null, commentMenuOpen: false });
  };
  editComment = (event) => {
    this.handleCommentMenuClose(event.target.parentNode);
    let updatedComment = this.props.idea.chat;
    const commentIndexArr = this.state.selectedCommentIndex.split("-");
    for (let i = 0; i < commentIndexArr.length; i++) {
      if (i % 2 !== 0) {
        updatedComment = updatedComment.comments[Number(commentIndexArr[i])];
      }
    }
    this.setState({
      editingComment: true,
      newComment: updatedComment.text,
    });
  };
  handleEditCommentSubmit = async (event) => {
    event.preventDefault();
    const idea = { ...this.props.idea };
    let updatedComment = idea.chat;
    const commentIndexArr = this.state.selectedCommentIndex.split("-");
    for (let i = 0; i < commentIndexArr.length; i++) {
      if (i % 2 !== 0) {
        updatedComment = updatedComment.comments[Number(commentIndexArr[i])];
      }
    }
    updatedComment.text = this.state.newComment;
    this.setState({ editingComment: false });
    await this.props.updateIdeaDetails(idea);
  };
  ideaComments = (comments, level = 0, commentIndex) => {
    return comments.map((comment, index) => (
      <div key={index} ref={this.childMsgRef}>
        <div className="comment-box">
          <Avatar
            src={comment.avatar}
            alt={comment.createdBy}
            className="avatar"
          />
          {this.state.editingComment &&
          this.state.selectedCommentIndex ===
            (commentIndex
              ? commentIndex + "-" + level + "-" + index
              : level + "-" + index) ? (
            <form
              noValidate
              autoComplete="off"
              onSubmit={this.handleEditCommentSubmit}
              className="edit-form"
            >
              <Grid container>
                <Grid item xs={12} className="pl-1 pr-1">
                  <TextField
                    placeholder="write your new comment"
                    id={
                      commentIndex
                        ? commentIndex + "-" + level + "-" + index
                        : level + "-" + index
                    }
                    autoFocus
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    value={this.state.newComment}
                    onChange={(event) =>
                      this.setState({
                        newComment: event.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            </form>
          ) : (
            <Badge
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              badgeContent={
                comment.likes &&
                comment.likes.length > 0 && (
                  <div className="badge-like">
                    <ThumbUpAltIcon
                      color="primary"
                      fontSize="small"
                      className="icon "
                    />
                    {comment.likes.length}
                  </div>
                )
              }
              color="default"
              component="div"
            >
              <Typography
                variant="body2"
                component="div"
                className="text"
                style={{ wordBreak: "break-word" }}
                onClick={() =>
                  this.setState({
                    selectedCommentIndex: commentIndex
                      ? commentIndex + "-" + level + "-" + index
                      : level + "-" + index,
                  })
                }
              >
                <span className="title capital">{comment.createdBy}</span>
                <span>{parse(comment.text)}</span>
                {comment.email === this.props.User.user.email && (
                  <MoreVertIcon
                    aria-label="menu"
                    aria-controls="comment-menu"
                    aria-haspopup="true"
                    className="menu-icon"
                    onClick={this.handleCommentMenuOpen}
                  />
                )}
              </Typography>
              <Menu
                id="comment-menu"
                anchorEl={this.state.commentMenuAnchorEl}
                open={this.state.commentMenuOpen}
                onClose={this.handleCommentMenuClose}
                keepMounted
                elevation={1}
              >
                <MenuItem onClick={this.editComment}>Edit</MenuItem>
                <MenuItem onClick={this.deleteComment}>Delete</MenuItem>
              </Menu>
            </Badge>
          )}
        </div>
        {!(
          this.state.selectedCommentIndex ===
            (commentIndex
              ? commentIndex + "-" + level + "-" + index
              : level + "-" + index) && this.state.editingComment
        ) && (
          <div className="comment-action">
            {this.state.replyOnCommentIndex !==
              (commentIndex
                ? commentIndex + "-" + level + "-" + index
                : level + "-" + index) && (
              <div>
                <Button
                  color="primary"
                  className="no-outline like-btn"
                  classes={{
                    textPrimary: "colorSecondary",
                  }}
                  onClick={(event) =>
                    this.handleCommentLike(
                      event,
                      commentIndex
                        ? commentIndex + "-" + level + "-" + index
                        : level + "-" + index
                    )
                  }
                >
                  {comment.likes &&
                  comment.likes.some(
                    (l) => l.email === this.props.User.user.email
                  ) ? (
                    <span style={{ fontWeight: 900 }}>Like</span>
                  ) : (
                    "Like"
                  )}
                </Button>
                {level < this.state.maxLevel && (
                  <Button
                    color="primary"
                    className="no-outline reply-btn"
                    classes={{
                      textPrimary: "colorSecondary",
                    }}
                    onClick={() =>
                      this.setState({
                        replyOnCommentIndex: commentIndex
                          ? commentIndex + "-" + level + "-" + index
                          : level + "-" + index,
                      })
                    }
                  >
                    Reply
                  </Button>
                )}
              </div>
            )}
            {this.state.replyOnCommentIndex ===
              (commentIndex
                ? commentIndex + "-" + level + "-" + index
                : level + "-" + index) && (
              <form
                noValidate
                autoComplete="off"
                onSubmit={this.handleReplySubmit}
                className="reply-form"
              >
                <Grid container>
                  <Grid item xs={2} md={1}>
                    <Avatar
                      src={this.props.User.user.photoUrl}
                      alt="sender"
                      className="avatar"
                    />
                  </Grid>
                  <Grid item xs={10} md={11} className="pl-1 pr-1">
                    <TextField
                      placeholder="Write a reply..."
                      id={
                        commentIndex
                          ? commentIndex + "-" + level + "-" + index
                          : level + "-" + index
                      }
                      autoFocus
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      value={this.state.commentReply}
                      onChange={(event) =>
                        this.setState({
                          commentReply: event.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </form>
            )}
          </div>
        )}
        {comment.comments && comment.comments.length > 0 && (
          <div style={{ marginLeft: 30 }}>
            {this.ideaComments(
              comment.comments,
              level + 1,
              commentIndex
                ? commentIndex + "-" + level + "-" + index
                : level + "-" + index
            )}
          </div>
        )}
      </div>
    ));
  };
  render() {
    return (
      <>
        <Grid container className="paper idea-chat">
          <Grid item xs={12} className="message-box" ref={this.messageRef}>
            {this.props.idea.chat &&
            this.props.idea.chat.comments &&
            this.props.idea.chat.comments.length > 0 ? (
              this.ideaComments(this.props.idea.chat.comments)
            ) : (
              <p className="m-3">Be the first to comment on this idea</p>
            )}
          </Grid>
          <Grid item xs={12} md={12} ld={12} sm={12} className="message-form">
            <form
              noValidate
              autoComplete="off"
              onSubmit={this.handleSubmit}
              className="comment-form"
            >
              <Grid container className="p-2 action">
                <Grid item xs={12}>
                  <TextField
                    placeholder="Write a comment..."
                    id="comment"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    value={this.state.comment}
                    onChange={(event) =>
                      this.setState({ comment: event.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </>
    );
  }
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
      updateIdeaDetails,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(IdeaChat);
