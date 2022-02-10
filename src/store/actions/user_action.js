import {
  firebaseUsers,
  firebase,
  firebaseStorageRef,
  firebaseConfig,
  firebaseFunctions,
} from "../../libs/config";
import {
  SIGN_IN,
  SIGN_UP,
  SEND_RESET_PASSWORD_MAIL,
  SIGN_IN_WITH_GOOGLE,
  SIGN_IN_WITH_FACEBOOK,
  FIND_USER,
  UPDATE_USER,
  FIND_USERS,
  UPDATE_PASSWORD,
  SIGN_IN_WITH_TWITTER,
  SIGN_IN_WITH_LINKEDIN,
  DELETE_USER,
} from "../types";
import { findIdeasByEmail, updateIdea } from "./pitch_action";
import axios from "axios";
// login user
export const signIn = async (data) => {
  try {
    const result = await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
    const doc = await findUser(data.email);
    if (doc.exists) {
      const user = doc.data();
      if (!user.role) {
        user.isNewUser = true;
        return {
          type: SIGN_IN,
          payload: {
            user,
            error: null,
          },
        };
      }
      if (!user.isVerified || user.reject) {
        return {
          type: SIGN_IN,
          payload: {
            error: {
              title: "Account Inactive",
              message:
                "Our Team is verifing your details.Please wait or contact our support team at show_your_project@gmail.com",
            },
            user,
          },
        };
      }
      if (!result.user.emailVerified ) {
        return {
          type: SIGN_IN,
          payload: {
            error: {
              title: "Email Verification Pending",
              message:
                "Your email address is not verified, please check your mail to verify.",
            },
            user: doc.data(),
          },
        };
      }
      // update last loggedIn as now
      updateUser({
        email: data.email,
        lastLoggedIn: new Date(),
      });
      return {
        type: SIGN_IN,
        payload: {
          user,
          error: null,
        },
      };
    } else {
      return {
        type: SIGN_IN,
        payload: {
          error: {
            title: "Invalid Email/Password",
            message:
              " There is no user record corresponding to this identifier. The user may have been deleted.",
          },
        },
      };
    }
  } catch (error) {
    return {
      type: SIGN_IN,
      payload: {
        error: {
          title: "Invalid Email/Password",
          message: error.message,
        },
      },
    };
  }
};
// find all users depends on current login user role
export const findAllUsers = async (email, isAdmin = false) => {
  try {
    const users = [];
    let querySnapshot = null;
    if (isAdmin) {
      querySnapshot = await firebaseUsers.get();
    } else {
      querySnapshot = await firebaseUsers
        .where("isVerified", "==", true)
        .where("profile", "==", "public")
        .get();
    }
    querySnapshot.forEach(function (doc) {
      if (doc.id !== email) {
        if (doc.data().role && doc.data().role !== "admin") {
          const user = doc.data();
          user.id = doc.id;
          users.push(user);
        }
      }
    });

    return {
      type: FIND_USERS,
      payload: {
        users,
        error: null,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      type: FIND_USERS,
      payload: {
        error: {
          title: "Find Users not Found",
          message: error.message,
        },
      },
    };
  }
};

// create a new user
export const signUp = async (data) => {
  try {
    const result = await firebase

      .auth()
      .createUserWithEmailAndPassword(data.email, data.password);
    const user = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email?.toLowerCase(),
      uid: result.user.uid,
      emailVerified: result.user.emailVerified,
    };
    result.user.updateProfile({
      displayName: getDisplayName(data.firstName, data.lastName),
    });
    await addUser(user);
    user.isNewUser = true;
    user.refreshToken = result.user.refreshToken;
    return {
      type: SIGN_UP,
      payload: { user, error: null },
    };
  } catch (error) {
    console.log(error);
    return {
      type: SIGN_UP,
      payload: {
        error: {
          title: "SignUp Error",
          message: error.message,
        },
        user: null,
      },
    };
  }
};
// forgot password mail
export const sendResetPasswordMail = async (data) => {
  try {
    await firebase.auth().sendPasswordResetEmail(data.email, {
      url: `${firebaseConfig.appURL}`,
    });
    return {
      type: SEND_RESET_PASSWORD_MAIL,
      payload: {
        info: {
          title: "Reset Password",
          message:
            "An email has been sent. Plese check the email to reset your password",
        },
        error: null,
      },
    };
  } catch (error) {
    return {
      type: SEND_RESET_PASSWORD_MAIL,
      payload: {
        error: {
          title: "Reset Password",
          message: error.message,
        },
      },
    };
  }
};
// login with google social 
export const signInWithGoogle = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    if (result) {
      const profile = result.additionalUserInfo.profile;
      const doc = await findUser(profile.email);
      let user = {
        email: profile.email?.toLowerCase(),
        firstName: profile.given_name,
        lastName: profile.family_name,
        uid: result.user.uid,
        photoUrl: profile.picture,
        emailVerified: true,
      };
      if (doc.exists) {
        user = doc.data();
        if (!user.photoUrl) {
          user.photoUrl = profile.picture;
          await updateUser(user);
        }
        if (!user.role) {
          user.isNewUser = true;
        } else if (!user.isVerified || user.reject) {
          return {
            type: SIGN_IN_WITH_GOOGLE,
            payload: {
              error: {
                title: "Account Inactive",
                message:
                  "Our Team is verifing your details.Please wait or contact our support team at show_your_project@gmail.com",
              },
              user,
            },
          };
        } else {
          // update last loggedIn as now
          updateUser({
            email: user.email,
            lastLoggedIn: new Date(),
            uid: result.user.uid,
          });
        }
      } else {
        await addUser(user);
        result.user.updateProfile({
          displayName: getDisplayName(user.firstName, user.lastName),
        });
        user.isNewUser = true;
        user.refreshToken = result.user.refreshToken;
      }
      return {
        type: SIGN_IN_WITH_GOOGLE,
        payload: { user, error: null },
      };
    } else {
      console.log("google login no result found");
    }
  } catch (error) {
    console.log(error);
    return {
      type: SIGN_IN_WITH_GOOGLE,
      payload: {
        error: {
          title: "Sign In failed",
          message: error.message,
        },
      },
    };
  }
};
// login with facebook social 
export const signInWithFacebook = async () => {
  try {
    const provider = new firebase.auth.FacebookAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    if (result) {
      const profile = result.additionalUserInfo.profile;
      const doc = await findUser(profile.email);
      let user = {
        email: profile.email?.toLowerCase(),
        lastName: profile.last_name,
        firstName: profile.first_name,
        photoUrl: profile.picture.data.url,
        uid: result.user.uid,
        emailVerified: true,
      };
      if (doc.exists) {
        user = doc.data();
        if (!user.photoUrl) {
          user.photoUrl = profile.picture.data.url;
          await updateUser(user);
        }
        if (!user.role) {
          user.isNewUser = true;
          user.refreshToken = result.user.refreshToken;
        } else if (!user.isVerified || user.reject) {
          return {
            type: SIGN_IN_WITH_FACEBOOK,
            payload: {
              error: {
                title: "Account Inactive",
                message:
                  "Our Team is verifing your details.Please wait or contact our support team at show_your_project@gmail.com",
              },
              user,
            },
          };
        } else {
          // update last loggedIn as now
          updateUser({
            email: user.email,
            lastLoggedIn: new Date(),
            uid: result.user.uid,
          });
        }
      } else {
        await addUser(user);
        user.isNewUser = true;
        result.user.updateProfile({
          displayName: getDisplayName(user.firstName, user.lastName),
        });
      }
      return {
        type: SIGN_IN_WITH_FACEBOOK,
        payload: { user, error: null },
      };
    } else {
      console.log("facebook login no result found");
    }
  } catch (error) {
    console.log(error);
    return {
      type: SIGN_IN_WITH_FACEBOOK,
      payload: {
        error: {
          title: "Sign In failed",
          message: error.message,
        },
      },
    };
  }
};
// login with twitter social 
export const signInWithTwitter = async () => {
  try {
    const provider = new firebase.auth.TwitterAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    console.log("result" + result);
    if (result) {
      const profile = result.additionalUserInfo.profile;
      const doc = await findUser(profile.email);
      let user = {
        email: profile.email,
        lastName: profile.last_name,
        firstName: profile.first_name,
        photoUrl: profile.picture.data.url,
        uid: result.user.uid,
      };

      if (doc.exists) {
        user = doc.data();
        if (!user.photoUrl) {
          user.photoUrl = profile.picture.data.url;
          await updateUser(user);
        }
        if (!user.role) {
          user.isNewUser = true;
          user.refreshToken = result.user.refreshToken;
        } else if (!user.isVerified || user.reject) {
          return {
            type: SIGN_IN_WITH_TWITTER,
            payload: {
              error: {
                title: "Account Inactive",
                message:
                  "Our Team is verifing your details.Please wait or contact our support team at show_your_project@gmail.com",
              },
              user,
            },
          };
        } else {
          // update last loggedIn as now
          updateUser({
            email: user.email,
            lastLoggedIn: new Date(),
          });
        }
      } else {
        await addUser(user);
        user.isNewUser = true;
      }
      return {
        type: SIGN_IN_WITH_TWITTER,
        payload: { user, error: null },
      };
    } else {
      console.log("twitter login no result found");
    }
  } catch (error) {
    console.log(error);
    return {
      type: SIGN_IN_WITH_TWITTER,
      payload: {
        error: {
          title: "Sign In failed",
          message: error.message,
        },
      },
    };
  }
};

// login with linked social 
export const signInWithLinkedIn = async (accessToken) => {
  try {
    const request = {
      method: "POST",
      url: firebaseConfig.linkedInLoginUrl,
      data: {
        code: accessToken,
        redirectUrl: firebaseConfig.linkedInRedirectURL,
      },
      headers: {
        "Content-Type": `application/json`,
      },
    };
    const response = await axios(request);
    const result = await firebase
      .auth()
      .signInWithCustomToken(response.data.token);
    const doc = await findUser(response.data.email);
    let user = {
      email: response.data.email?.toLowerCase(),
      lastName: response.data.lastName,
      firstName: response.data.firstName,
      photoUrl: response.data.photoUrl,
      uid: response.data.id,
      emailVerified: true,
    };
    if (doc.exists) {
      user = doc.data();
      if (!user.photoUrl) {
        user.photoUrl = response.data.photoUrl;
        await updateUser(user);
      }
      if (!user.role) {
        user.isNewUser = true;
        user.refreshToken = result.user.refreshToken;
      } else if (!user.isVerified || user.reject) {
        return {
          type: SIGN_IN_WITH_LINKEDIN,
          payload: {
            error: {
              title: "Account Inactive",
              message:
                "Our Team is verifing your details.Please wait or contact our support team at show_your_project@gmail.com",
            },
            user,
          },
        };
      } else {
        // update last loggedIn as now
        updateUser({
          email: user.email,
          lastLoggedIn: new Date(),
        });
      }
    } else {
      await addUser(user);
      user.isNewUser = true;
      result.user.updateProfile({
        displayName: getDisplayName(user.firstName, user.lastName),
      });
    }
    return {
      type: SIGN_IN_WITH_LINKEDIN,
      payload: { user, error: null },
    };
  } catch (error) {
    return {
      type: SIGN_IN_WITH_LINKEDIN,
      payload: {
        error: {
          title: "Sign In failed",
          message:
            "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
        },
      },
    };
  }
};

// find all details of logged in user
export const findUserDetails = async (email) => {
  try {
    if (email) {
      const doc = await findUser(email);
      if (doc.exists) {
        const user = doc.data();
        user.id = doc.id;
        return {
          type: FIND_USER,
          payload: { user, error: null },
        };
      } else {
        return {
          type: FIND_USER,
          payload: {
            error: {
              title: "Error",
              message: "no user found",
            },
          },
        };
      }
    } else {
      return {
        type: FIND_USER,
        payload: {
          user: null,
          error: {
            title: "Error",
            message: "Email not found",
          },
        },
      };
    }
  } catch (error) {
    return {
      type: FIND_USER,
      payload: {
        error: {
          title: "Error",
          message: error.message,
        },
      },
    };
  }
};
// update user details
export const updateUserDetails = async (data) => {
  try {
    if (data.isNewUser) {
      data.createdAt = new Date();
      delete data.isNewUser;
      delete data.refreshToken;
    }
    if (data.file) {
      data.photoUrl = await uploadFile(data.email, data.file);
    }
    delete data.file;
    const connections = data.connections;
    delete data.connections;
    await updateUser(data);
    if (connections && connections.length > 0) {
      for (let email of connections) {
        try {
          await firebaseUsers
            .doc(email)
            .collection("connection")
            .doc(data.email)
            .update({
              name:
                data.firstName[0].toUpperCase() +
                data.firstName.substr(1) +
                " " +
                data.lastName[0].toUpperCase() +
                data.lastName.substr(1),
              avatar: data.photoUrl,
            });
        } catch (error) {
          console.log(error);
        }
      }
    }
    if (data.role === "entrepreneur") {
      try {
        const querySnapshot = await findIdeasByEmail(data.email);
        await querySnapshot.forEach(async (doc) => {
          try {
            await updateIdea({
              id: doc.id,
              createdBy:
                data.firstName[0].toUpperCase() +
                data.firstName.substr(1) +
                " " +
                data.lastName[0].toUpperCase() +
                data.lastName.substr(1),
            });
          } catch (error) {
            console.log(error);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (!data.isVerified) {
      return {
        type: UPDATE_USER,
        payload: {
          info: {
            title: "Account Activation",
            message:
              "Your account is created. Please wait our team will verify your details till than you can not access your account",
          },
          error: null,
          user: data,
        },
      };
    }
    return {
      type: UPDATE_USER,
      payload: {
        user: data,
        error: null,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      type: UPDATE_USER,
      payload: {
        error: {
          title: "Update User",
          message: error,
        },
        user: null,
      },
    };
  }
};

// update user password if user change password in account settings
export const updatePassword = async (newPassword) => {
  try {
    await firebase.auth().currentUser.updatePassword(newPassword);
    return {
      type: UPDATE_PASSWORD,
      payload: {
        error: null,
      },
    };
  } catch (error) {
    return {
      type: UPDATE_PASSWORD,
      payload: {
        error: {
          title: "Update password",
          message: error.message,
        },
      },
    };
  }
};
const addUser = (user) => {
  if (user.firstName && user.lastName) {
    user.searchNameArray = getSearchNameArray(user.firstName, user.lastName);
  }
  return firebaseUsers.doc(user.email).set(user, { merge: true });
};

const updateUser = (user) => {
  if (user.firstName && user.lastName) {
    user.searchNameArray = getSearchNameArray(user.firstName, user.lastName);
  }
  return firebaseUsers.doc(user.email).update(user);
};

const findUser = (email) => {
  return firebaseUsers.doc(email.toLowerCase()).get();
};
// delete a user access for admin only
export const deleteUser = async (user) => {
  try {
    const deleteUserFunction = firebaseFunctions.httpsCallable(
      firebaseConfig.deleteUserFunctionName
    );
    await deleteUserFunction({ uid: user.uid, email: user.email });
    return {
      type: DELETE_USER,
      payload: {
        error: null,
        email: user.email,
        info: {
          title: "Delete user",
          message: "User is deleted",
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      type: DELETE_USER,
      payload: {
        error: {
          title: "Delete user",
          message: error.message,
        },
      },
    };
  }
};
// users report for admin
export const getUsersReport = async () => {
  const usersReport = [
    {
      title: "Total Registered Users",
      overall: 0,
      entrepreneurs: 0,
      experts: 0,
      investors: 0,
    },
    {
      title: "New accounts registered in a month last 30 days",
      overall: 0,
      entrepreneurs: 0,
      experts: 0,
      investors: 0,
    },
    {
      title: "Daily Log-in",
      overall: 0,
      entrepreneurs: 0,
      experts: 0,
      investors: 0,
    },
  ];
  const querySnapshot = await firebaseUsers.get();
  await querySnapshot.forEach(function (doc) {
    const user = doc.data();
    if (user.role) {
      usersReport[0].overall++;
      if (user.role === "entrepreneur") {
        usersReport[0].entrepreneurs++;
      } else if (user.role === "expert") {
        usersReport[0].experts++;
      } else if (user.role === "investor") {
        usersReport[0].investors++;
      }
    }
    if (user.createdAt) {
      const registeredDate = user.createdAt.toDate();
      let priorDate = new Date();
      priorDate = priorDate.setDate(priorDate.getDate() - 30);
      if (registeredDate > priorDate) {
        usersReport[1].overall++;
        if (user.role === "entrepreneur") {
          usersReport[1].entrepreneurs++;
        } else if (user.role === "expert") {
          usersReport[1].experts++;
        } else if (user.role === "investor") {
          usersReport[1].investors++;
        }
      }
    }
    if (user.lastLoggedIn) {
      const lastLoggedIn = user.lastLoggedIn.toDate();
      let priorDate = new Date();
      priorDate = priorDate.setDate(priorDate.getDate() - 1);
      if (lastLoggedIn > priorDate) {
        usersReport[2].overall++;
        if (user.role === "entrepreneur") {
          usersReport[2].entrepreneurs++;
        } else if (user.role === "expert") {
          usersReport[2].experts++;
        } else if (user.role === "investor") {
          usersReport[2].investors++;
        }
      }
    }
  });
  return usersReport;
};
export const signOut = async () => {
  try {
    firebase.auth().signOut();
  } catch (error) {
    console.log(error);
  }
};
const uploadFile = (email, file) => {
  return new Promise((resolve, reject) => {
    const uploadTask = firebaseStorageRef
      .child(`${email}/${file.name}`)
      .put(file, {
        contentType: file.type,
      });
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
          default:
            console.log("done");
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            console.log("User doesn't have permission to access the object");
            break;
          case "storage/canceled":
            console.log("User doesn't have permission to access the object");
            break;
          case "storage/unknown":
            console.log("Unknown error occurred, inspect error.serverResponse");
            break;
          default:
            console.log(error);
        }
        reject(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          resolve(downloadURL);
        });
      }
    );
  });
};
// send a email verification mail to user
export const sendEmailVerification = async () => {
  const user = firebase.auth().currentUser;
  if (user) {
    try {
      await user.sendEmailVerification({
        url: `${firebaseConfig.appURL}`,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("user is not loggedIn");
  }
};

// send a mail to owner with user's query
export const contactUs = async (data) => {
  try {
    data.to = firebaseConfig.sendContactUsMailTo;
    const sendMail = firebaseFunctions.httpsCallable(
      firebaseConfig.sendMailFunctionName
    );
    await sendMail(data);
    return true;
  } catch (error) {
    console.log(error);
    return {
      type: "Contact Us",
      error: "Not able to send",
    };
  }
};
// search a user by name
export const searchUsers = async (searchText) => {
  try {
    const users = [];
    if (searchText) {
      searchText = searchText.split(" ").join("").toLowerCase();
      const querySnapshot = await firebaseUsers
        .where("searchNameArray", "array-contains", searchText)
        .where("profile", "==", "public")
        .where("emailVerified", "==", true)
        .where("isVerified", "==", true)
        .get();
      await querySnapshot.forEach(function (doc) {
        const user = {
          id: doc.id,
          url: "/profile/" + doc.data().uid,
          name: doc.data().firstName + " " + doc.data().lastName,
          photoUrl: doc.data().photoUrl,
        };
        users.push(user);
      });
      return users;
    } else {
      return users;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export { addUser, updateUser, findUser };

// create an array of user name for search
const getSearchNameArray = (firstName, lastName) => {
  const searchNameArray = new Set();
  if (firstName && firstName.length > 0) {
    let str = "";
    for (let char of firstName) {
      if (char.trim()) {
        str += char;
        searchNameArray.add(str.toLowerCase());
      }
    }
  }
  if (lastName && lastName.length > 0) {
    let str = "";
    for (let char of lastName) {
      if (char.trim()) {
        str += char;
        searchNameArray.add(str.toLowerCase());
      }
    }
  }
  searchNameArray.add(firstName.toLowerCase() + lastName.toLowerCase());
  searchNameArray.add(lastName.toLowerCase() + firstName.toLowerCase());
  return [...searchNameArray];
};

const getDisplayName = (firstName, lastName) => {
  return (
    firstName[0].toUpperCase() +
    firstName.substr(1) +
    " " +
    lastName[0].toUpperCase() +
    lastName.substr(1)
  );
};
