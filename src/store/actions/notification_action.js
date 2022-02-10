import {
  FIND_NOTIFICATIONS,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
} from "../types";
import {
  firebaseNotifications,
  firebaseConfig,
  mailConfig,
} from "../../libs/config";
import { addUser, findUser } from "./user_action";
import emailJs from '@emailjs/browser';
emailJs.init(mailConfig.user_id);
// get all notifications of logged in user
export const findAllNotifications = async (email) => {
  try {
    const notifications = [];
    const querySnapshot = await firebaseNotifications
      .where("to", "==", email)
      .orderBy("createdAt", "desc")
      .get();
    await querySnapshot.forEach(function (doc) {
      const noti = doc.data();
      noti.id = doc.id;
      notifications.push(noti);
    });
    return {
      type: FIND_NOTIFICATIONS,
      payload: {
        notifications,
        error: null,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      type: FIND_NOTIFICATIONS,
      payload: {
        notifications: null,
        error: {
          title: "Notification Error ",
          message: error.message,
        },
      },
    };
  }
};

// add a new notification
export const addNotification = async (data) => {
  try {
    if (data.user) {
      let user = {
        email: data.user.email,
      };
      const doc = await findUser(data.user.email);
      if (
        doc.exists &&
        doc.data().requests &&
        doc.data().requests.length > 0 &&
        !doc
          .data()
          .requests.some((req) => req.pitchId === data.user.request.pitchId)
      ) {
        user.requests = doc.data().requests;
        user.requests.unshift(data.user.request);
      } else {
        user.requests = [data.user.request];
      }
      await addUser(user);
      if (data.sendMail) {
        await sendMail({
          to: data.to,
          name: data.user.request.name,
          pitchTitle: data.user.request.pitchTitle,
          pitchId: data.user.request.pitchId,
          useTemplate: "invite",
        });
      }
    }
    delete data.sendMail;
    delete data.user;
    data.read = false;
    data.createdAt = new Date();
    await firebaseNotifications.doc().set(data);
    const user = await findUser(data.to);
    if (user.data().notificationToken) {
      data.notificationToken = user.data().notificationToken;
      sendNotification(data);
    }
    return {
      type: ADD_NOTIFICATION,
      payload: {
        error: null,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      type: ADD_NOTIFICATION,
      payload: {
        error: {
          title: "Add Notification",
          error: "Failed to add new notification",
        },
      },
    };
  }
};
// mark a notification as read
export const updateNotificationMarkAsReak = async (id) => {
  try {
    await firebaseNotifications.doc(id).update({ read: true });
    return {
      type: UPDATE_NOTIFICATION,
      payload: {
        error: null,
      },
    };
  } catch (error) {
    return {
      type: UPDATE_NOTIFICATION,
      payload: {
        error: {
          title: "Update notification failed",
          message: error.message,
        },
      },
    };
  }
};
// mark all notification as read
export const updateNotificationMarkAllAsReak = async () => {
  try {
    await firebaseNotifications.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var notification = firebaseNotifications.doc(doc.id);
        return notification.update({
          read: true,
        });
      });
    });
    return {
      type: UPDATE_NOTIFICATION,
      payload: {
        error: null,
      },
    };
  } catch (error) {
    return {
      type: UPDATE_NOTIFICATION,
      payload: {
        error: {
          title: "Update notification failed",
          message: error.message,
        },
      },
    };
  }
};
// add and send notification
export const sendNotification = async (data) => {
  try {
    let notificationSent = true;
    data.read = false;
    data.createdAt = new Date();
    const doc = await findUser(data.to);
    const user = doc.exists ? doc.data() : null;
    if (user && user.notificationToken) {
      if (data.type === "vote") {
        data.message = `Your Idea ${data.pitchTitle} got a vote`;
        if (user.notification && !user.notification.vote) {
          notificationSent = false;
        }
      } else if (data.type === "comment") {
        data.message = `${data.senderName} has commented on your Idea ${data.pitchTitle}`;
        if (user.notification && !user.notification.comment) {
          notificationSent = false;
        }
      } else if (data.type === "like") {
        data.message = data.senderName + " liked your comment";
        if (user.notification && !user.notification.like) {
          notificationSent = false;
        }
      } else if (data.type === "reply") {
        data.message = data.senderName + " replied to your comment";
      } else if (data.type === "share") {
        data.message = `${data.senderName} has shared idea ${data.pitchTitle} with you. Have a look! ${firebaseConfig.appURL}/detailsIdea/${data.pitchId}`;
      } else if (data.type === "connect") {
        data.message = `${data.senderName} (${
          data.role[0].toUpperCase() + data.role.substr(1)
        }) wants to connect with you`;
      } else if (data.type === "invite") {
        data.message = `${data.senderName} has requested you to join team ${data.pitchTitle}`;
        if (user.notification && !user.notification.joinTeamMember) {
          notificationSent = false;
        }
      } else if (data.type === "inviteExpertOrInvestor") {
        data.message = `${data.senderName} has requested you to join team ${data.pitchTitle}`;
        if (user.notification && !user.notification.joinInvestorOrExpert) {
          notificationSent = false;
        }
      } else if (data.type === "collaborate") {
        data.message = `${data.senderName} (${
          data.role[0].toUpperCase() + data.role.substr(1)
        }) has requested you to join team ${data.pitchTitle}`;
        if (user.notification && !user.notification.joinTeamMember) {
          notificationSent = false;
        }
      } else if (data.type === "acceptConnectionRequest") {
        data.message = `${data.senderName} accepted your request to connect.`;
      } else if (data.type === "acceptIdeaRequest") {
        data.message = `${data.senderName}  has accepted your request to join team ${data.pitchTitle}`;
      }
      data.sendMail = notificationSent;
      if (notificationSent) {
        await firebaseNotifications.add(data);
      }
    }
    if (data.sendMail) {
      data.useTemplate = data.type;
      if (
        data.type === "acceptIdeaRequest" ||
        data.type === "acceptConnectionRequest" ||
        !data.name
      ) {
        data.name =
          user.firstName[0].toUpperCase() +
          user.firstName.substr(1) +
          " " +
          user.lastName[0].toUpperCase() +
          user.lastName.substr(1);
      }
      sendMail(data);
    }
  } catch (error) {
    console.log(error);
  }
};
// send mail 
export const sendMail = async (data) => {
  try {
    if (data.useTemplate === "invite") {
      data.subject = "ACT NOW! You have been invited to join SYP";
      data.message = `
      <p> Hello!  ${data.senderName} is working on an exciting Idea and has invited you to join their Ideation Team on SYP.</p>
      <p> To join SYP use the link below</p>    
      <a href="${firebaseConfig.appURL}">Click Here</a>
      <br />
      <p>SYP is a fully integrated digital platform available across devices that allows Entrepreneurs to collaborate with Experts and Investors to validate and bring high potential ideas to life.</p>
      `;
    } else if (data.useTemplate === "share") {
      data.subject = "You have a notification";
      data.message = `<p>Hi ${data.name},</p>
       ${data.senderName} has shared idea ${data.pitchTitle} with you.</p>
       Have a look!  <a href="${firebaseConfig.appURL}/detailsIdea/${data.pitchId}">Click Here</a>`;
    } else if (data.useTemplate === "approve") {
      data.subject = "SYP profile approval";
      data.message = `<p>Congrats! Your SYP profile has been formally approved. We welcome you to SYP and are delighted to have you on board. </p>
      <br />
      <p>SYP offers you:</p>
      <p>- Exciting Ideas from budding Entrepreneurs</p>
      
      <p>- A diverse pool of industry Experts & Investors</p>
      <p>- Easy to view “Quick Pitch” idea listings </p>
      <p>- Features such as voting, commenting, sharing and saving favourites</p>
      <p>- Inherent capability to collaborate on Ideas to validate and then bring them to life</p>
      <br />
      <p>Click on the below to get started </p>
      <a href="${firebaseConfig.appURL}">Click Here</a>
      <br />
      `;
    } else if (data.useTemplate === "reject") {
      data.subject = "SYP profile approval";
      data.message =
        "<p>We are sorry to inform you that at this time we cannot accept you on our platform. We wish you all the best.</p>";
    } else if (data.useTemplate === "connect") {
      data.subject = "You have a notification";
      data.message = `<p>Hi ${data.name},</p>
      <p>${data.senderName} (${
        data.role[0].toUpperCase() + data.role.substr(1)
      }) wants to connect with you.</p>`;
    } else if (data.useTemplate === "vote") {
      data.subject = "You have a notification";
      data.message = `<p>Hi ${data.name},</p> <p>Your Idea ${data.pitchTitle} got a vote.</p>`;
    } else if (data.useTemplate === "reply") {
      data.subject = "You have a notification";
      data.message = `<p>Hi ${data.name},</p> <p>${data.senderName} replied to your comment.</p>`;
    } else if (data.useTemplate === "like") {
      data.subject = "You have a notification";
      data.message = `<p>Hi ${data.name},</p> <p>${data.senderName} liked your comment.</p>`;
    } else if (data.useTemplate === "comment") {
      data.subject = "You have a notification";
      data.message = `<p>Hi ${data.name},</p> <p>${data.senderName} commented on your Idea ${data.pitchTitle}.</p>`;
    } else if (data.useTemplate === "collaborate") {
      data.subject = "You have a notification";
      data.message = `<p>Hi ${data.name},</p>  <p>${data.senderName} (${
        data.role[0].toUpperCase() + data.role.substr(1)
      }) has requested you to join team ${data.pitchTitle}`;
    } else if (data.useTemplate === "inviteExpertOrInvestor") {
      data.subject = "You have a notification";
      data.message = `<p>Hi ${data.name},</p>  <p>${data.senderName} has requested you to join team ${data.pitchTitle}`;
    } else if (data.type === "acceptConnectionRequest") {
      data.subject = "You have a notification";
      data.message = `<p>Hi ${data.name},</p>  <p>${data.senderName} accepted your request to connect.`;
    } else if (data.type === "acceptIdeaRequest") {
      data.subject = "You have a notification";
      data.message = `<p>Hi ${data.name},</p>  <p>${data.senderName} has accepted your request to join team ${data.pitchTitle}`;
    } else if (data.type === "welcome") {
      data.subject = "Welcome to SYP";
      data.message = `<p>We welcome you to SYP and are delighted to have you on board. </p>
      <br />
      <p>SYP offers you:</p>
      <p>- A diverse pool of industry Experts & Investors to help you validate your Idea and then bring it to life </p>
      <p>- An easy to create “Quick Pitch” template to list your idea </p>
      <p>- Features such as voting, commenting and sharing   </p>
      <p>- Inherent capability to communicate and collaborate </p>
      <p>Click on the below to get started </p>
      <a href="${firebaseConfig.appURL}">Click Here</a>
      <br />
      `;
    }
    data.message += "<br/><br/><p>Regards,</p><p>The SYP Team</p>";
    const response = await emailJs.send(mailConfig.service_id,mailConfig.template_id,{
      to: data.to,
      subject: data.subject,
      html: data.message
      });
      console.log(response);
  } catch (error) {
    console.log(error);
  }
};
