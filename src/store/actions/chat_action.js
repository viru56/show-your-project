import { firebaseChat, firebaseUsers, firebase } from "../../libs/config";

// send message to a particular user
export const sendMessage = async (id, message) => {
  try {
    await firebaseChat.doc(id).collection("messages").add(message);
    const users = id.split("#");
    if (users[0] === message.sender) {
      await Promise.all([
        firebaseUsers
          .doc(users[0])
          .collection("connection")
          .doc(users[1])
          .update({ lastMessage: message, unread: 0 }),
        firebaseUsers
          .doc(users[1])
          .collection("connection")
          .doc(users[0])
          .update({
            lastMessage: message,
            unread: firebase.firestore.FieldValue.increment(1),
          }),
      ]);
    } else {
      await Promise.all([
        firebaseUsers
          .doc(users[0])
          .collection("connection")
          .doc(users[1])
          .update({
            lastMessage: message,
            unread: firebase.firestore.FieldValue.increment(1),
          }),
        firebaseUsers
          .doc(users[1])
          .collection("connection")
          .doc(users[0])
          .update({ lastMessage: message, unread: 0 }),
      ]);
    }
  } catch (error) {
    console.log(error);
  }
};

// get all the conversation between two users

export const getAllMessages = async (id) => {
  try {
    const messages = [];
    const querySnapshot = await firebaseChat
      .doc(id)
      .collection("messages")
      .orderBy("createdAt")
      .get();
    await querySnapshot.forEach((doc) => {
      const message = doc.data();
      message.id = doc.id;
      messages.push(message);
    });
    return messages;
  } catch (error) {
    console.log(error);
  }
};
