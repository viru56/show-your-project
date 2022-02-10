import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  findConnections,
  updateUnreadMessages,
} from "../../store/actions/connection_action";
import ConnectionDialog from "./connectionDialog";
import ChatDialog from "./chatDialog";
import IdeaChatDialog from "./ideaChatDialog";
import Grid from "@material-ui/core/Grid";
import { firebaseUsers, firebaseIdeas, firebase } from "../../libs/config";
import { updateIdeaUnreadMessages } from "../../store/actions/idea_chat_action";
import {withRouter} from 'react-router-dom';


/* chat dialog for users */
class Chat extends Component {
  constructor(props) {
    super(props);
    this.chatObserver = null;
    this.ideaChatObserver = null;
    this.state = {
      openChatPanel: [],
      connections: [],
      allUnreadMessages: 0,
      groups: [],
      myPitch: props.User.user?.myPitch || [],
      requests: props.User.user?.requests || [],
    };
  }
  getUnreadMessageId = (email) => {
    return `unread_${email.replace(/\./g, ",")}`;
  };
  async componentDidMount() {
    try {
      await this.getAllUserIdeaGroup();
      this.chatObserver = firebaseUsers
        .doc(this.props.User.user.email)
        .collection("connection")
        .onSnapshot(async (querySnapshot) => {
          await querySnapshot.docChanges().forEach(async (snapshot) => {
            const connections = [...this.state.connections];
            if (snapshot.type === "modified") {
              let isNewConnection = true;
              for (let connection of connections) {
                if (connection.email === snapshot.doc.id) {
                  isNewConnection = false;
                  if (
                    this.state.openChatPanel.some(
                      (user) => user.email === snapshot.doc.id
                    )
                  ) {
                    connection.unread = 0;
                    updateUnreadMessages({
                      email: this.props.User.user.email,
                      connectionEmail: snapshot.doc.id,
                    });
                  } else {
                    connection.unread = snapshot.doc.data().unread;
                  }
                  connection.lastMessage = snapshot.doc.data().lastMessage;
                }
              }
              await this.setState({ connections });
              this.countUnreadMessages();
              if (isNewConnection) {
                this.updateConnections();
              }
            } else if (snapshot.type === "removed") {
              this.updateConnections();
              this.closeChatDialog(snapshot.doc.id);
            } else if (
              snapshot.type === "added" &&
              connections.findIndex((con) => con.email === snapshot.doc.id) ===
                -1
            ) {
              this.updateConnections();
            }
          });
        });
      this.ideaChatObserver = firebaseIdeas.onSnapshot(
        async (querySnapshot) => {
          await querySnapshot.docChanges().forEach(async (snapshot) => {
            if (snapshot.type === "modified") {
              const connections = [...this.state.connections];
              for (let connection of connections) {
                if (connection.id === snapshot.doc.id) {
                  connection.lastMessage = snapshot.doc.data().lastMessage;
                  if (
                    this.state.openChatPanel.some(
                      (panel) => panel.id === snapshot.doc.id
                    )
                  ) {
                    connection.unread = 0;
                    updateIdeaUnreadMessages(
                      snapshot.doc.id,
                      this.getUnreadMessageId(this.props.User.user.email)
                    );
                  } else {
                    connection.unread =
                      snapshot.doc.data()[
                        this.getUnreadMessageId(this.props.User.user.email)
                      ] || 0;
                  }
                }else{
                 this.getAllUserIdeaGroup();
                }
              }
              await this.setState({ connections });
              this.countUnreadMessages();
            }
          });
        }
      );
      this.userObserver = firebaseUsers
        .doc(this.props.User.user.email)
        .onSnapshot(async (doc) => {
         if(doc.exists){
           if (
             (doc.data().myPitch &&
               doc.data().myPitch.length !== this.state.myPitch.length) ||
             (doc.data().requests &&
               doc.data().requests.length !== this.state.requests.length)
           ) {
             await this.setState({
               myPitch: doc.data().myPitch,
               requests: doc.data().requests,
             });
             setTimeout(this.getAllUserIdeaGroup, 3000);
           }
         }else{
          this.props.history.push('/login');
         }
        });
    } catch (error) {
      console.log(error);
    }
  }
  getAllUserIdeaGroup = async () => {
    try {
      const query = [
        firebaseIdeas.where("email", "==", this.props.User.user.email).get(),
      ];
      if (this.state.myPitch && this.state.myPitch.length > 0) {
        query.push(
          firebaseIdeas
            .where(
              firebase.firestore.FieldPath.documentId(),
              "in",
              this.state.myPitch
            )
            .get()
        );
      }
      const qs = await Promise.all(query);
      let ideasQuerySnapshot =
        qs[1] && qs[1].docs ? [...qs[0].docs, ...qs[1].docs] : [...qs[0].docs];
      const groups = [];
      ideasQuerySnapshot.forEach((idea) => {
        if (idea.data().publish) {
          const teamMemberEmails = [];
          if (idea.data().email !== this.props.User.user.email) {
            teamMemberEmails.push(this.getUnreadMessageId(idea.data().email));
          }
          [
            ...idea.data().entrepreneurs,
            ...idea.data().investors,
            ...idea.data().experts,
            ...idea.data().team,
          ].forEach((user) => {
            if (this.props.User.user.email !== user.email) {
              teamMemberEmails.push(this.getUnreadMessageId(user.email));
            }
          });
          if (groups.findIndex((g) => g.id === idea.id) === -1) {
            groups.push({
              id: idea.id,
              name: idea.data().title,
              avatar: idea.data().images.pitchImages[0].url,
              lastMessage: idea.data().lastMessage,
              teamMemberEmails,
              unread:
                idea.data()[
                  this.getUnreadMessageId(this.props.User.user.email)
                ] || 0,
            });
          }
        }
      });
      await this.setState({ groups });
      await this.updateConnections();
      this.countUnreadMessages();
    } catch (error) {
      console.log(error);
    }
  };
  updateConnections = async () => {
    await this.props.findConnections(this.props.User.user.email);
    await this.setState({
      connections: [
        ...this.props.Connection.connections.filter((con) => con.isConnected),
        ...this.state.groups,
      ],
    });
  };
  componentWillUnmount() {
    if (this.chatObserver) this.chatObserver();
    if (this.ideaChatObserver) this.ideaChatObserver();
    if (this.userObserver) this.userObserver();
  }
  openChatDialog = (id, type) => {
    if (!this.state.openChatPanel.some((panel) => panel.id === id)) {
      const panel = this.state.connections.find((c) => c.id === id);
      const openChatPanel = [...this.state.openChatPanel];
      openChatPanel.unshift(panel);
      if (openChatPanel.length > 2) {
        openChatPanel.pop();
      }
      this.setState({ openChatPanel });
    }
    if (type === "single") {
      updateUnreadMessages({
        email: this.props.User.user.email,
        connectionEmail: id,
      });
    } else {
      updateIdeaUnreadMessages(
        id,
        this.getUnreadMessageId(this.props.User.user.email)
      );
    }
  };
  closeChatDialog = (id) => {
    const openChatPanel = [...this.state.openChatPanel];
    const index = openChatPanel.findIndex((c) => c.id === id);
    openChatPanel.splice(index, 1);
    this.setState({ openChatPanel });
  };
  countUnreadMessages() {
    let count = 0;
    this.state.connections.forEach((user) => {
      if (user.unread) {
        count += user.unread;
      }
    });
    this.setState({ allUnreadMessages: count });
  }
  render() {
    return (
      <aside className="chat">
        <ConnectionDialog
          allUnreadMessages={this.state.allUnreadMessages}
          groups={this.state.groups}
          connections={this.state.connections}
          openChatDialog={this.openChatDialog}
        />
        <Grid
          container
          direction="row"
          alignItems="flex-end"
          spacing={1}
          className="mr-2"
        >
          {this.state.openChatPanel.length > 0 &&
            this.state.openChatPanel.map((panel) => (
              <Grid key={panel.id} item>
                {panel.email ? (
                  <ChatDialog
                    connection={panel}
                    closeChatDialog={this.closeChatDialog}
                  />
                ) : (
                  <IdeaChatDialog
                    connection={panel}
                    closeChatDialog={this.closeChatDialog}
                  />
                )}
              </Grid>
            ))}
        </Grid>
      </aside>
    );
  }
}
const mapStatetoProps = (state) => {
  return {
    User: state.User,
    Connection: state.Connection,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      findConnections,
    },
    dispatch
  );
};

export default connect(mapStatetoProps, mapDispatchToProps)(withRouter(Chat));
