import React, { Component } from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import defaultImage from "../../assets/images/quick-pitch.png";
import { connect } from "react-redux";
import { sendMessage } from "../../store/actions/chat_action";
//import { updateUnreadMessages } from "../../store/actions/connection_action";
import { firebaseChat } from "../../libs/config";
import Loading from "../../libs/loading";
import Badge from "@material-ui/core/Badge";

const MONTH = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];


/* user connection chat window */
class ChatDialog extends Component {
  constructor(props) {
    super(props);
    this.messagesRef = React.createRef();
    this.chatObserver = null;
    this.state = {
      loading: true,
      showChatBody: true,
      newMessage: "",
      messages: [],
      dateInfo: "",
      unrerad: 0,
    };
  }
  async componentDidMount() {
    try {
      // const messages = await getAllMessages(this.threadName);
      //  await this.setState({ messages, loading: false });
      //  this.scrollToBottom();
      const messages = [];
      this.chatObserver = firebaseChat
        .doc(this.threadName)
        .collection("messages")
        .orderBy("createdAt")
        .onSnapshot(async (querySnapshot) => {
          await this.setState({ loading: false });
          await querySnapshot.docChanges().forEach((newMessage) => {
            if (newMessage.type === "added") {
              const message = newMessage.doc.data();
              message.id = newMessage.doc.id;
              messages.push(message);
            }
          });
          await this.setState({
            messages,
            unrerad: this.state.showChatBody ? 0 : this.state.unrerad + 1,
          });
          this.scrollToBottom();
          // if (message.sender !== this.props.User.user.email) {
          //   updateUnreadMessages({
          //     email: this.props.User.user.email,
          //     connectionEmail: message.sender,
          //   });
          // }
        });
    } catch (error) {
      console.log(error);
    }
  }
  componentWillUnmount() {
    if (this.chatObserver) this.chatObserver();
  }
  get threadName() {
    return this.props.User.user.email < this.props.connection.email
      ? this.props.User.user.email + "#" + this.props.connection.email
      : this.props.connection.email + "#" + this.props.User.user.email;
  }
  getTime = (firerbaseDate) => {
    const date = firerbaseDate.toDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };
  getDateInfo = (index) => {
    const date = this.state.messages[index].createdAt.toDate();
    const now = new Date();
    let dateInfo = `${
      MONTH[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
    if (date.getFullYear() === now.getFullYear()) {
      dateInfo = `${MONTH[date.getMonth()]} ${date.getDate()}`;
      if (date.getDate() === now.getDate()) {
        dateInfo = "TODAY";
      }
      if (date.getDate() === now.getDate() - 1) {
        dateInfo = "YESTERDAY";
      }
    }
    if (index > 0) {
      const prevDate = this.state.messages[index - 1].createdAt.toDate();
      let prevDateInfo = `${
        MONTH[prevDate.getMonth()]
      } ${prevDate.getDate()}, ${prevDate.getFullYear()}`;
      if (prevDate.getFullYear() === now.getFullYear()) {
        prevDateInfo = `${MONTH[prevDate.getMonth()]} ${prevDate.getDate()}`;
        if (prevDate.getDate() === now.getDate()) {
          prevDateInfo = "TODAY";
        }
        if (prevDate.getDate() === now.getDate() - 1) {
          prevDateInfo = "YESTERDAY";
        }
      }
      if (prevDateInfo === dateInfo) {
        dateInfo = "";
      }
    }
    return dateInfo;
  };
  toggle = () => {
    if (!this.state.showChatBody) {
      this.scrollToBottom();
    }
    this.setState({
      showChatBody: !this.state.showChatBody,
      unrerad: 0,
    });
  };
  handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (!this.state.newMessage.trim()) {
        return;
      }
      const message = {
        photoUrl: this.props.User.user.photoUrl || null,
        name:
          this.props.User.user.firstName + " " + this.props.User.user.lastName,
        sender: this.props.User.user.email,
        createdAt: new Date(),
        content: this.state.newMessage.trim(),
      };
      this.setState({ newMessage: "" });
      await sendMessage(this.threadName, message);
    } catch (error) {
      console.log(error);
    }
  };
  scrollToBottom = () => {
    setTimeout(() => {
      this.messagesRef.current && this.messagesRef.current.scrollIntoView();
    }, 100);
  };
  render() {
    return (
      <div className="chat-dialog">
        <div className="header" onClick={this.toggle}>
          <div className="name">
            <Badge
              badgeContent={this.state.unrerad}
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
              {this.state.showChatBody
                ? this.props.connection.name.substr(0, 35)
                : this.props.connection.name.substr(0, 20)}
            </Badge>
          </div>
          <IconButton
            aria-label="cancel"
            className="cancel-button"
            onClick={() =>
              this.props.closeChatDialog(this.props.connection.id)
            }
          >
            <CancelIcon
              color="secondary"
              classes={{
                colorSecondary: "cancel-icon",
              }}
            />
          </IconButton>
        </div>
        {this.state.showChatBody && (
          <div className="chat-box">
            <div className="messages">
              {this.state.loading && (
                <div className="text-center m-4">
                  <Loading />
                </div>
              )}
              {this.state.messages.map((message, index) => (
                <div key={index} className="message" ref={this.messagesRef}>
                  {this.getDateInfo(index) && (
                    <p className="or">
                      <span>{this.getDateInfo(index)}</span>
                    </p>
                  )}
                  <div className="message-info">
                    <Avatar
                      src={message.photoUrl || defaultImage}
                      className="photo"
                    />
                    <div className="name"> {message.name}</div>
                    <div className="time">
                      {" "}
                      {this.getTime(message.createdAt)}{" "}
                    </div>
                  </div>
                  <p className="message-content">{message.content}</p>
                </div>
              ))}
            </div>
            <form
              noValidate
              autoComplete="off"
              onSubmit={this.handleSubmit}
              className="message-form"
            >
              <input
                placeholder="Write your message..."
                id="message-input"
                className="message-input"
                autoFocus
                value={this.state.newMessage}
                onChange={(event) =>
                  this.setState({ newMessage: event.target.value })
                }
              />
            </form>
          </div>
        )}
      </div>
    );
  }
}

const mapPropstoState = (state) => ({ User: state.User });

export default connect(mapPropstoState)(ChatDialog);
