import { FIND_CONNECTIONS, UPDATE_CONNECTION, ADD_CONNECTION } from "../types";
import { firebaseUsers } from "../../libs/config";

// send request to a user to connect
export const addConnection = async (data) => {
  try {
    const email = data.to;
    delete data.to;
    await firebaseUsers
      .doc(email)
      .collection("connection")
      .doc(data.email)
      .set(data, { merge: true });
    return {
      type: ADD_CONNECTION,
      payload: {
        error: null,
      },
    };
  } catch (error) {
    return {
      type: ADD_CONNECTION,
      payload: {
        error,
      },
    };
  }
};

// find all connections of login user
export const findConnections = async (email) => {
  try {
    if (email) {
      const connections = [];
      const querySnapshot = await firebaseUsers
        .doc(email)
        .collection("connection")
        .get();
      await querySnapshot.forEach(function (doc) {
        const connection = doc.data();
        connection.id = doc.id;
        connections.push(connection);
      });

      return {
        type: FIND_CONNECTIONS,
        payload: {
          connections,
          error: null,
        },
      };
    } else {
      return {
        type: FIND_CONNECTIONS,
        payload: {
          connections: null,
          error: null,
        },
      };
    }
  } catch (error) {
    return {
      type: FIND_CONNECTIONS,
      payload: {
        error,
      },
    };
  }
};
// add or reject request of a connection
export const updateConnection = async (data) => {
  try {
    if (data.type === "reject") {
      await firebaseUsers
        .doc(data.email)
        .collection("connection")
        .doc(data.connectionEmail)
        .delete();
    } else {
      await firebaseUsers
        .doc(data.connection.email)
        .collection("connection")
        .doc(data.connectionEmail)
        .set({ isConnected: true }, { merge: true });
      await firebaseUsers
        .doc(data.connectionEmail)
        .collection("connection")
        .doc(data.connection.email)
        .set(data.connection, { merge: true });
    }
    return {
      type: UPDATE_CONNECTION,
      payload: {
        error: null,
        type: data.type,
        connectionEmail: data.connectionEmail,
      },
    };
  } catch (error) {
    return {
      type: UPDATE_CONNECTION,
      payload: {
        error,
      },
    };
  }
};

// find user details and their connections details
export const findUserWithConnection = async (data) => {
  try {
    let user = null;
    const doc = await firebaseUsers.where("uid", "==", data.email).get();
    if (doc.docs[0] && doc.docs[0].exists) {
      user = doc.docs[0].data();
      user = doc.docs[0].data();
      const connection = await firebaseUsers
        .doc(user.email)
        .collection("connection")
        .doc(data.connectionEmail)
        .get();
      if (connection.exists) {
        user.connection = connection.data();
      }
    }
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};
// update unread messages count
export const updateUnreadMessages = async (data) => {
  try {
    await firebaseUsers
      .doc(data.email)
      .collection("connection")
      .doc(data.connectionEmail)
      .update({ unread: 0 });
  } catch (err) {
    console.log(err);
    return err;
  }
};

// delete a connection
export const removeConnection = async (data) => {
  try {
    await firebaseUsers
      .doc(data.email)
      .collection("connection")
      .doc(data.connectionEmail)
      .delete();
    await firebaseUsers
      .doc(data.connectionEmail)
      .collection("connection")
      .doc(data.email)
      .delete();
  } catch (error) {
    return error;
  }
};