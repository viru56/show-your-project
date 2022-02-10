import { firebase, firebaseIdeas } from "../../libs/config";

// get all the idea team messages
export const getAllIdeaMessages = async (id) => {
  try {
    const messages = [];
    const querySnapshot = await firebaseIdeas
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

//save new message you sent in a idea team
export const sendIdeaMessage = async (id, message, teamMemberEmails) => {
  try {
    const query = { lastMessage: message };
    await teamMemberEmails.forEach((tm) => {
      query[tm] = firebase.firestore.FieldValue.increment(1);
    });
    await firebaseIdeas.doc(id).collection("messages").add(message);
    await firebaseIdeas.doc(id).update(query);
  } catch (error) {
    console.log(error);
  }
};

// update unread count
export const updateIdeaUnreadMessages = async (id, email) => {
  try {
    await firebaseIdeas.doc(id).update({ [email]: 0 });
  } catch (err) {
    console.log(err);
    return err;
  }
};