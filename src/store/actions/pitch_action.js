import {
  firebase,
  firebaseStorageRef,
  firebaseIdeas,
  firebaseUsers,
  firebaseConfig,
} from "../../libs/config";
import {
  ADD_IDEA,
  FIND_IDEAS,
  FIND_IDEA,
  UPDATE_IDEA,
  DELETE_IDEA,
} from "../types";
import { sendNotification } from "./notification_action";
import axios from "axios";
import { findUser,addUser } from "./user_action";

// add new idea or update an idea
export const addIdea = async (data) => {
  try {
    const id = data.id || firebaseIdeas.doc().id;
    const newIdea = data.id ? false : true;
    delete data.id;
    data.images = {
      pitchImages: [],
      problemToSolve: [],
      solutionToOffer: [],
      solutionDelivery: [],
    };
    data.videos = {
      problemToSolve: [],
      solutionToOffer: [],
      solutionDelivery: [],
    };
    data.files = {
      pitchFiles: [],
      quickPitchFiles: [],
      investorPitchFiles: {},
    };
    if (data.pitchFiles && data.pitchFiles.length > 0) {
      if (data.pitchFiles[0].url) {
        data.files.pitchFiles = data.pitchFiles;
      } else {
        data.files.pitchFiles.push({
          name: data.pitchFiles[0].name,
          type: data.pitchFiles[0].type,
          url: await uploadPitchFile(`${data.email}/${id}`, data.pitchFiles[0]),
        });
      }
    }
    if (data.quickPitchFiles && data.quickPitchFiles.length > 0) {
      if (data.quickPitchFiles[0].url) {
        data.files.quickPitchFiles = data.quickPitchFiles;
      } else {
        data.files.quickPitchFiles.push({
          name: data.quickPitchFiles[0].name,
          type: data.quickPitchFiles[0].type,
          url: await uploadPitchFile(
            `${data.email}/${id}/quick-pitch-files`,
            data.quickPitchFiles[0]
          ),
        });
      }
    }
    if (data.investorPitchFiles) {
      for (const key in data.investorPitchFiles) {
        if (data.investorPitchFiles[key].length > 0) {
          data.files.investorPitchFiles[key] = [];
          for (let file of data.investorPitchFiles[key]) {
            if (file.url) {
              data.files.investorPitchFiles[key].push(file);
            } else {
              data.files.investorPitchFiles[key].push({
                name: file.name,
                type: file.type,
                url: await uploadPitchFile(
                  `${data.email}/${id}/investor-pitch-files/${key}`,
                  file
                ),
              });
            }
          }
        }
      }
    }

    if (data.pitchImages && data.pitchImages.length > 0) {
      if (data.pitchImages[0].url) {
        data.images.pitchImages = data.pitchImages;
      } else {
        data.images.pitchImages.push({
          name: data.pitchImages[0].name,
          type: data.pitchImages[0].type,
          url: await uploadPitchFile(
            `${data.email}/${id}/pitch-images`,
            data.pitchImages[0]
          ),
        });
      }
    }
    if (data.problemToSolveImages && data.problemToSolveImages.length > 0) {
      for (const file of data.problemToSolveImages) {
        if (file.type.indexOf("image") === 0) {
          if (file.url) {
            data.images.problemToSolve.push(file);
          } else {
            data.images.problemToSolve.push({
              name: file.name,
              type: file.type,
              url: await uploadPitchFile(
                `${data.email}/${id}/problem-to-solve-images`,
                file
              ),
            });
          }
        } else {
          if (file.url) {
            data.videos.problemToSolve.push(file);
          } else {
            data.videos.problemToSolve.push({
              name: file.name,
              type: file.type,
              url: await uploadPitchFile(
                `${data.email}/${id}/problem-to-solve-videos`,
                file
              ),
            });
          }
        }
      }
    }
    if (data.solutionToOfferImages && data.solutionToOfferImages.length > 0) {
      for (const file of data.solutionToOfferImages) {
        if (file.type.indexOf("image") === 0) {
          if (file.url) {
            data.images.solutionToOffer.push(file);
          } else {
            data.images.solutionToOffer.push({
              name: file.name,
              type: file.type,
              url: await uploadPitchFile(
                `${data.email}/${id}/solution-to-offer-images`,
                file
              ),
            });
          }
        } else {
          if (file.url) {
            data.videos.solutionToOffer.push(file);
          } else {
            data.videos.solutionToOffer.push({
              name: file.name,
              type: file.type,
              url: await uploadPitchFile(
                `${data.email}/${id}/solution-to-offer-videos`,
                file
              ),
            });
          }
        }
      }
    }
    if (data.solutionDeliveryImages && data.solutionDeliveryImages.length > 0) {
      for (const file of data.solutionDeliveryImages) {
        if (file.type.indexOf("image") === 0) {
          if (file.url) {
            data.images.solutionDelivery.push(file);
          } else {
            data.images.solutionDelivery.push({
              name: file.name,
              type: file.type,
              url: await uploadPitchFile(
                `${data.email}/${id}/solution-delivery-images`,
                file
              ),
            });
          }
        } else {
          if (file.url) {
            data.videos.solutionDelivery.push(file);
          } else {
            data.videos.solutionDelivery.push({
              name: file.name,
              type: file.type,
              url: await uploadPitchFile(
                `${data.email}/${id}/solution-delivery-videos`,
                file
              ),
            });
          }
        }
      }
    }
    if (data.ideaFile) {
      const url = await uploadPitchFile(`${data.email}/${id}`, data.ideaFile);
      data.ideaFile = {
        name: data.ideaFile.name,
        type: data.ideaFile.type,
        url,
      };
    }
    const team = data.team;
    const creator = data.user;
    delete data.user;
    data.team = [];
    delete data.pitchImages;
    delete data.problemToSolveImages;
    delete data.solutionToOfferImages;
    delete data.solutionDeliveryImages;
    delete data.pitchFiles;
    delete data.quickPitchFiles;
    delete data.investorPitchFiles;
    data.searchIdeaNameArray = getSearchIdeaNameArray(data.title);
    await firebaseIdeas.doc(id).set(data, { merge: true });
    // send mail & notification to founder team member
    if (team.length > 0 && data.publish) {
      for (let email of team) {
        const doc = await findUser(email);
        let user = {
          email,
          firstName: "new",
          lastName: "user",
        };
        if (doc.exists) {
          user = doc.data();
        }
        let isNewRequest = true;
        const request = {
          pitchId: id,
          pitchTitle: data.title,
          name: data.createdBy,
          email: email,
          uid: creator.uid,
          avatar: creator.photoUrl || null,
          role: creator.role,
          access: "read",
        };
        let requests = [];
        if (user.requests && user.requests.length > 0) {
          requests = user.requests;
          if (
            requests.findIndex((req) => req.pitchId === request.pitchId) === -1
          ) {
            requests.unshift(request);
          } else {
            isNewRequest = false;
          }
        } else {
          requests.push(request);
        }
        if (isNewRequest) {
          await addUser({ email, requests });
          const notification = {
            to: email,
            from: data.email,
            senderName: data.createdBy,
            name:
              user.firstName[0].toUpperCase() +
              user.firstName.substr(1) +
              " " +
              user.lastName[0].toUpperCase() +
              user.lastName.substr(1),
            pitchId: id,
            pitchTitle: data.title,
            avatar: creator.photoUrl || null,
            type: "invite",
            sendMail: true,
          };
          await sendNotification(notification);
        }
      }
    }
    return {
      type: ADD_IDEA,
      payload: {
        info: {
          title: newIdea ? "New Idea" : "Update Idea",
          message: "Your idea is updated successfully",
          pitchId: newIdea ? id : null,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      type: ADD_IDEA,
      payload: {
        error: {
          title: "New Idea",
          message: "Failed to publish idea",
        },
        info: null,
      },
    };
  }
};
// find all ideas for an entrepreneur
export const findEnterpreneurIdeas = async (email) => {
  let ideas = [];
  try {
    const querySnapshot = await findIdeasByEmail(email);
    await querySnapshot.forEach(function (doc) {
      const idea = doc.data();
      idea.id = doc.id;
      ideas.push(idea);
    });
    return {
      type: FIND_IDEAS,
      payload: {
        error: null,
        ideas,
      },
    };
  } catch (error) {
    return {
      type: FIND_IDEAS,
      payload: {
        error: {
          title: "Error in getting ideas",
          message: error.message,
        },
        ideas: null,
      },
    };
  }
};
// find all ideas
export const findAllIdeas = async () => {
  let ideas = [];
  try {
    const querySnapshot = await firebaseIdeas
      .orderBy("updatedAt", "desc")
      .get();
    await querySnapshot.forEach(function (doc) {
      const idea = doc.data();
      idea.id = doc.id;
      ideas.push(idea);
    });
    return {
      type: FIND_IDEAS,
      payload: {
        error: null,
        ideas,
      },
    };
  } catch (error) {
    return {
      type: FIND_IDEAS,
      payload: {
        error: {
          title: "Error in getting ideas",
          message: error.message,
        },
        ideas: null,
      },
    };
  }
};
// find an idea
export const findIdeaDetails = async (id) => {
  try {
    const doc = await getIdeaById(id);
    const idea = doc.data();
    idea.id = doc.id;
    return {
      type: FIND_IDEA,
      payload: {
        error: null,
        idea,
      },
    };
  } catch (error) {
    return {
      type: FIND_IDEA,
      payload: {
        error: {
          title: "Error in getting idea details",
          message: error.message,
        },
        idea: null,
      },
    };
  }
};
// add a team member in idea and also add pitch id in user's myPitch
export const updateIdeaDetails = async (pitch) => {
  try {
    if (pitch.user) {
      const doc = await firebaseUsers.doc(pitch.user.email).get();
      const data = doc.data();
      data.myPitch
        ? data.myPitch.push(pitch.user.pitchId)
        : (data.myPitch = [pitch.user.pitchId]);
      await firebaseUsers.doc(data.email).update(data);
      delete pitch.user;
    }
    await updateIdea(pitch);
    return {
      type: UPDATE_IDEA,
      payload: {
        error: null,
      },
    };
  } catch (error) {
    return {
      type: UPDATE_IDEA,
      payload: {
        error: {
          title: "Error in updating idea details",
          message: error.message,
        },
      },
    };
  }
};

// download the idea as pdf
export const downLoadPDF = async (idea) => {
  try {
    const idToken = await firebase.auth().currentUser.getIdToken();
    const request = {
      method: "POST",
      url: firebaseConfig.downloadPDF,
      data: idea,
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios(request);
    let anchor = document.createElement("a");
    anchor.download = idea.title + ".pdf";
    let blob = new Blob([response.data], { type: "application/pdf" });
    anchor.href = window.URL.createObjectURL(blob);
    anchor.dataset.downloadurl = [
      "application/pdf",
      anchor.download,
      anchor.href,
    ].join(":");
    anchor.click();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
// save idea file in gcp
const uploadPitchFile = (email, file) => {
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
// this is for admin to get idea details
export const getIdeasReport = async () => {
  const ideasReport = [
    {
      title: "Total Ideas",
      overall: 0,
    },
    {
      title: "Total Number of Likes and Dislikes",
      overall: 0,
    },
    {
      title: "Total Completed Quick Pitches",
      overall: 0,
    },
    {
      title: "Total Investment Ready Ideas",
      overall: 0,
    },
    {
      title: "Total Ideas Funded",
      overall: 0,
    },
    {
      title: "Number of Entrepreneurs with one Idea",
      overall: 0,
    },
    {
      title: "Number of Entrepreneurs with more than one Idea",
      overall: 0,
    },
  ];
  const querySnapshot = await firebaseIdeas.get();
  const entrepreneurIdeaCount = {};
  await querySnapshot.forEach((doc) => {
    const idea = doc.data();
    ideasReport[0].overall++;
    // count like dislikes
    if (idea.chat) {
      ideasReport[1].overall += idea.chat.likes ? idea.chat.likes.length : 0;
      ideasReport[1].overall += idea.chat.dislikes
        ? idea.chat.dislikes.length
        : 0;
    }
    // count investor Ready pitch/ quick pitch
    idea.investorReadyPitch
      ? ideasReport[3].overall++
      : ideasReport[2].overall++;
    if (idea.totalFunding) ideasReport[4].overall++;
    if (entrepreneurIdeaCount[idea.email]) {
      entrepreneurIdeaCount[idea.email]++;
    } else {
      entrepreneurIdeaCount[idea.email] = 1;
    }
  });
  for (let count in entrepreneurIdeaCount) {
    if (entrepreneurIdeaCount[count] === 1) {
      ideasReport[5].overall++;
    } else {
      ideasReport[6].overall += entrepreneurIdeaCount[count];
    }
  }
  return ideasReport;
};
// delete an idea
export const deleteIdea = async (pitchId) => {
  try {
    if (!pitchId) {
      return {
        type: DELETE_IDEA,
        payload: {
          error: {
            title: "Delete idea",
            message: "idea not found",
          },
        },
      };
    }
    await firebaseIdeas.doc(pitchId).delete();
    return {
      type: DELETE_IDEA,
      payload: {
        error: null,
        pitchId,
        info: {
          title: "Delete idea",
          message: "Idea is deleted",
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      type: DELETE_IDEA,
      payload: {
        error: {
          title: "Delete idea",
          message: error.message,
        },
      },
    };
  }
};
export const findIdeasByEmail = (email) => {
  return firebaseIdeas.where("email", "==", email).get();
};

const getIdeaById = (id) => {
  return firebaseIdeas.doc(id).get();
};

export const updateIdea = (pitch) => {
  if (pitch.title) {
    pitch.searchIdeaNameArray = getSearchIdeaNameArray(pitch.title);
  }
  return firebaseIdeas.doc(pitch.id).update(pitch);
};

// search an idea by name
export const searchIdeas = async (searchText) => {
  try {
    const ideas = [];
    if (searchText) {
      searchText = searchText.split(" ").join("").toLowerCase();
      const querySnapshot = await firebaseIdeas
        .where("searchIdeaNameArray", "array-contains", searchText)
        .where("publish", "==", true)
        .get();
      await querySnapshot.forEach(function (doc) {
        const idea = {
          id: doc.id,
          url: "/detailsIdea/" + doc.id,
          name: doc.data().title,
          photoUrl:
            doc.data().images.pitchImages &&
            doc.data().images.pitchImages.length > 0
              ? doc.data().images.pitchImages[0].url
              : null,
        };
        ideas.push(idea);
      });
      return ideas;
    } else {
      return ideas;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

// get name map array when you add an idea for searching
const getSearchIdeaNameArray = (name) => {
  const searchIdeaNameArray = new Set(name.split(" "));
  let str = "";
  if (name && name.length > 0) {
    for (let char of name) {
      if (char.trim()) {
        str += char;
        searchIdeaNameArray.add(str.toLowerCase());
      }
    }
  }

  return [...searchIdeaNameArray];
};
