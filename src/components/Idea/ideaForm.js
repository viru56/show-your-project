import React, { PureComponent } from "react";
import Page from "../page";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Chip,
  Paper,
  Snackbar,
  CircularProgress,
  Tooltip,
  Backdrop,
  Modal,
  Fade,
  MenuItem,
  InputLabel,
  ListItemText,
  Select,
  Input,
  Checkbox,
  FormControl,
  FormControlLabel,
  Switch,
  Avatar,
  IconButton,
} from "@material-ui/core";
import CollectionsIcon from "@material-ui/icons/Collections";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { addIdea, findIdeaDetails } from "../../store/actions/pitch_action";
import { findAllUsers, updateUser } from "../../store/actions/user_action";
import validate from "../../libs/forms/validate";
import HelpIcon from "@material-ui/icons/Help";
import { firebaseStorageRef } from "../../libs/config";
import NumberFormat from "react-number-format";
import AddPhoto from "../../assets/images/add.png";
import PageSpinner from "../PageSpinner";
import { industryOfInterestsDataArray } from "../../constants/mockResponse";

/* entrepreneur can create a new pitch or edit their pitch */
class PitchForm extends PureComponent {
  state = {
    loading: true,
    isAdminAccess: true,
    changeForm: false,
    investorReadyPitch: false,
    showBackdrop: false,
    uploadBtnTouched: false,
    model: {
      open: false,
      url:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      type: "palyer",
    },
    ideaBgImages: [],
    snackbar: {
      open: false,
      title: "",
      message: "",
      level: "",
    },
    interests: [],
    isFormValid: false,
    pitchFiles: [],
    pitchImages: [],
    problemToSolveImages: [],
    solutionToOfferImages: [],
    solutionDeliveryImages: [],
    quickPitchFiles: [],
    investorPitchFiles: {},
    publish: false,
    team: [],
    deletedTeamMeber: [],
    entrepreneurs: [],
    experts: [],
    investors: [],
    pendingRequests: [],
    formData: {
      title: {
        value: "",
        validation: {
          isRequired: true,
          maxLength: 500,
          minLength: 2,
          isName: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      description: {
        value: "",
        validation: {
          isRequired: true,
          maxLength: 3000,
          minLength: 2,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      otherInterest: {
        value: "",
        validation: {
          isRequired: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      websiteUrl: {
        value: "",
        validation: {
          isRequired: false,
          isUrl: true,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      problemToSolve: {
        value: "",
        validation: {
          isRequired: true,
          maxLength: 3000,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      solutionToOffer: {
        value: "",
        validation: {
          isRequired: true,
          maxLength: 3000,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      solutionDelivery: {
        value: "",
        validation: {
          isRequired: true,
          maxLength: 3000,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      stage: {
        value: "",
        validation: {
          isRequired: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      founderTeam: {
        value: false,
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      totalFunding: {
        value: "",
        validation: {
          isRequired: false,
          // isMin: 0
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      requiredFunding: {
        value: "",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
    },
    investorPitchForm: [
      {
        priority: 1,
        title: "Describe the market size and penetration strategy",
        id: "strategy",
        label: "Strategy",
        placeholder: "Type here",
        value: "",
        validation: {
          isRequired: true,
          maxLength: 3000,
        },
        multiline: true,
        valid: false,
        touched: false,
        validationMessage: "",
      },
      {
        priority: 2,
        title: "Describe your competition",
        id: "competition",
        label: "Competition",
        placeholder: "Type here",
        value: "",
        validation: {
          isRequired: true,
          maxLength: 3000,
        },
        multiline: true,
        valid: false,
        touched: false,
        validationMessage: "",
      },
      {
        priority: 3,
        title: "SWOT Analysis",
        id: "swotAnalysis",
        label: "Tell us more",
        placeholder: "",
        value: "",
        validation: {
          isRequired: true,
          maxLength: 3000,
        },
        multiline: true,
        valid: false,
        touched: false,
        validationMessage: "",
      },
      {
        priority: 4,
        title: "Why is this a  good time to launch your idea",
        id: "ideaDescrition",
        label: "Tell us more",
        placeholder: "",
        value: "",
        validation: {
          isRequired: true,
          maxLength: 3000,
        },
        multiline: true,
        valid: false,
        touched: false,
        validationMessage: "",
      },
      {
        priority: 5,
        title: "The implementation model",
        label: "Model",
        placeholder: "Tell us more",
        id: "implementationModel",
        value: "",
        validation: {
          isRequired: true,
          maxLength: 3000,
        },
        multiline: true,
        valid: false,
        touched: false,
        validationMessage: "",
      },
      {
        priority: 7,
        title: "Source and use of funds",
        label: "Tell us more",
        placeholder: "",
        id: "funds",
        value: "",
        validation: {
          isRequired: false,
          maxLength: 3000,
        },
        multiline: true,
        valid: false,
        touched: false,
        validationMessage: "",
      },
      {
        priority: 8,
        title: "Financial model/Projections and key ratios",
        label: "Tell us more",
        placeholder: "",
        id: "financialModel",
        value: "",
        validation: {
          isRequired: true,
          maxLength: 3000,
        },
        multiline: true,
        valid: false,
        touched: false,
        validationMessage: "",
      },
    ],
    email: {
      value: "",
      validation: {
        isRequired: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
    },
  };
  async componentDidMount() {
    if (this.props.match.params.id) {
      await this.props.findIdeaDetails(this.props.match.params.id);
      if (this.props.Idea.idea.email !== this.props.User.user.email) {
        const user = [
          ...this.props.Idea.idea.team,
          ...this.props.Idea.idea.entrepreneurs,
          ...this.props.Idea.idea.experts,
          ...this.props.Idea.idea.investors,
        ].find((user) => user.email === this.props.User.user.email);
        if (user && user.access !== "read") {
          if (user.access === "write") {
            this.setState({ isAdminAccess: false });
          }
        } else {
          alert("You do not have permissions");
          return this.props.history.push("/");
        }
      }

      this.setIdeaDetails();
    } else {
      this.setState({ loading: false });
    }
    var listRef = firebaseStorageRef.child("/ideaImages/");
    var res = await listRef.listAll();
    var ideaBgImages = [];
    await res.items.forEach(async function (itemRef) {
      // All the items under listRef.
      ideaBgImages.push({
        name: itemRef.name,
        url: await firebaseStorageRef
          .child(itemRef.location.path)
          .getDownloadURL(),
        type: "image/jpg",
      });
    });
    await this.setState({ ideaBgImages });
    if (!this.props.User.users) {
      await this.props.findAllUsers(this.props.User.user.email);
    }
    if (this.props.match.params.id) {
      const pendingRequests = [];
      this.props.User.users.forEach((user) => {
        if (user.requests) {
          user.requests.forEach((request) => {
            if (request.pitchId === this.props.match.params.id) {
              pendingRequests.push({
                name: user.firstName + " " + user.lastName,
                email: user.email,
                role: user.role,
                access: request.access,
                pending: true,
              });
            }
          });
        }
      });
      if (pendingRequests.length > 0) {
        const formData = { ...this.state.formData };
        formData.founderTeam.value = true;
        await this.setState({ pendingRequests, formData });
        this.handleChange();
      }
    }
  }
  setIdeaDetails = async () => {
    let isFormValid = true;
    if (this.props.Idea.idea) {
      const idea = this.props.Idea.idea;
      const formData = { ...this.state.formData };
      formData.title.value = idea.title;
      formData.title.valid = true;
      if (idea.description) {
        formData.description.value = idea.description;
        formData.description.valid = true;
      } else {
        formData.description.valid = false;
        isFormValid = false;
      }
      if (idea.stage) {
        formData.stage.value = idea.stage;
        formData.stage.valid = true;
      } else {
        formData.stage.valid = false;
        isFormValid = false;
      }
      formData.websiteUrl.value = idea.websiteUrl ? idea.websiteUrl : "";
      if (idea.totalFunding) formData.totalFunding.value = idea.totalFunding;
      if (idea.requiredFunding)
        formData.requiredFunding.value = idea.requiredFunding;
      if (idea.problemToSolve) {
        formData.problemToSolve.value = idea.problemToSolve;
        formData.problemToSolve.valid = true;
      } else {
        formData.problemToSolve.valid = false;
        isFormValid = false;
      }
      if (idea.solutionToOffer) {
        formData.solutionToOffer.value = idea.solutionToOffer;
        formData.solutionToOffer.valid = true;
      } else {
        formData.solutionToOffer.valid = false;
        isFormValid = false;
      }
      if (idea.solutionDelivery) {
        formData.solutionDelivery.value = idea.solutionDelivery;
        formData.solutionDelivery.valid = true;
      } else {
        formData.solutionDelivery.valid = false;
        isFormValid = false;
      }
      if (idea.category && idea.category.includes("Other")) {
        formData.otherInterest.value = idea.otherInterest || "";
        formData.otherInterest.valid = true;
      }
      let changeForm =
        idea.investorReadyPitch && idea.files.pitchFiles.length > 0
          ? false
          : true;
      const investorPitchForm = [...this.state.investorPitchForm];

      if (changeForm) {
        let isFormChanged = false;
        for (const field of investorPitchForm) {
          if (idea[field.id]) {
            field.value = idea[field.id];
            field.valid = true;
          } else {
            field.valid = false;
          }
          if (field.value) isFormChanged = true;
        }
        changeForm = isFormChanged;
      }
      formData.founderTeam.value = idea.founderTeam;
      if (
        idea.experts.length > 0 ||
        idea.entrepreneurs.length > 0 ||
        idea.investors.length > 0
      ) {
        formData.founderTeam.value = true;
      } else {
        formData.founderTeam.value = false;
      }

      await this.setState({
        formData,
        investorPitchForm,
        entrepreneurs: idea.entrepreneurs,
        experts: idea.experts,
        investors: idea.investors,
        pitchImages: idea.images.pitchImages,
        interests: idea.category,
        problemToSolveImages: [
          ...idea.images.problemToSolve,
          ...idea.videos.problemToSolve,
        ],
        solutionToOfferImages: [
          ...idea.images.solutionToOffer,
          ...idea.videos.solutionToOffer,
        ],
        solutionDeliveryImages: [
          ...idea.images.solutionDelivery,
          ...idea.videos.solutionDelivery,
        ],
        investorReadyPitch: idea.investorReadyPitch,
        pitchFiles: idea.files.pitchFiles,
        quickPitchFiles: idea.files.quickPitchFiles || [],
        investorPitchFiles: idea.files.investorPitchFiles,
        changeForm: changeForm,
        isFormValid,
        uploadBtnTouched: true,
        publish: idea.publish,
        loading: false,
      });
    } else {
      alert("Something went worng, please try again");
      this.props.history.push("/");
    }
  };
  handleFileUpload = (key, event) => {
    if (key === "pitchImages") {
      if (event.target.files[0].type.indexOf("image") === -1) {
        alert(
          event.target.files[0].name + " not an image,Please upload only image"
        );
        return;
      }
      this.setState({ pitchImages: [event.target.files[0]] });
    } else if (key === "quickPitchFiles") {
      this.setState({ quickPitchFiles: [event.target.files[0]] });
    } else if (key === "pitchFiles") {
      this.setState({ pitchFiles: [event.target.files[0]] });
    } else if (key === "investorPitchFiles") {
      const investorPitchFiles = { ...this.state.investorPitchFiles };
      const filesArr = investorPitchFiles[event.target.name] || [];
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].type.indexOf("image") === -1) {
          alert(
            event.target.files[i].name +
              " not an image,Please upload only image"
          );
        } else {
          if (
            filesArr.findIndex(
              (file) => file.name === event.target.files[i].name
            ) === -1
          ) {
            filesArr.push(event.target.files[i]);
          }
        }
      }
      investorPitchFiles[event.target.name] = filesArr;
      this.setState({ investorPitchFiles });
    } else {
      const filesArr = [...this.state[key]];
      for (let i = 0; i < event.target.files.length; i++) {
        if (filesArr.indexOf(event.target.files[i].name) === -1) {
          filesArr.push(event.target.files[i]);
        }
      }
      this.setState({ [key]: filesArr });
    }
    setTimeout(this.handleChange);
    event.target.value = null;
  };
  handleDelete = (deleteFrom, index) => {
    if (deleteFrom === "problem") {
      const problemToSolveImages = [...this.state.problemToSolveImages];
      problemToSolveImages.splice(index, 1);
      this.setState({ problemToSolveImages });
    } else if (deleteFrom === "solution") {
      const solutionToOfferImages = [...this.state.solutionToOfferImages];
      solutionToOfferImages.splice(index, 1);
      this.setState({ solutionToOfferImages });
    } else if (deleteFrom === "delivery") {
      const solutionDeliveryImages = [...this.state.solutionDeliveryImages];
      solutionDeliveryImages.splice(index, 1);
      this.setState({ solutionDeliveryImages });
    } else if (deleteFrom === "pitch") {
      const pitchImages = [...this.state.pitchImages];
      pitchImages.splice(index, 1);
      this.setState({ pitchImages });
    } else if (deleteFrom === "quickPitchFile") {
      const quickPitchFiles = [...this.state.quickPitchFiles];
      quickPitchFiles.splice(index, 1);
      this.setState({ quickPitchFiles });
    } else {
      const pitchFiles = [...this.state.pitchFiles];
      pitchFiles.splice(index, 1);
      this.setState({ pitchFiles });
    }
    setTimeout(this.handleChange);
  };
  handleChange = (key, value) => {
    const formData = { ...this.state.formData };
    let isFormValid = true;
    if (key) {
      formData[key].value = value;
      formData[key].touched = true;
      const validData = validate(key, formData);
      formData[key].valid = validData[0];
      formData[key].validationMessage = validData[1];
      if (value === "" && !formData[key].validation.isRequired) {
        formData[key].touched = false;
        formData[key].valid = true;
        formData[key].validationMessage = "";
      }
    }
    if (
      !formData.title.valid ||
      !formData.description.valid ||
      !formData.websiteUrl.valid ||
      !formData.problemToSolve.valid ||
      !formData.solutionToOffer.valid ||
      !formData.solutionDelivery.valid ||
      this.state.pitchImages.length === 0 ||
      (this.state.interests.includes("Other") &&
        !formData.otherInterest.valid) ||
      (formData.founderTeam.value &&
        this.state.team.length === 0 &&
        this.state.entrepreneurs.length === 0 &&
        this.state.investors.length === 0 &&
        this.state.experts.length === 0 &&
        this.state.pendingRequests.length === 0)
    ) {
      isFormValid = false;
    }
    this.setState({ formData, isFormValid });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    if (!this.state.isFormValid) {
      const formData = { ...this.state.formData };
      let uploadBtnTouched = false;
      formData.title.touched = true;
      formData.description.touched = true;
      formData.stage.touched = true;
      formData.problemToSolve.touched = true;
      formData.solutionToOffer.touched = true;
      formData.solutionDelivery.touched = true;
      if(this.state.interests.includes('Other')){
        formData.otherInterest.touched = true;
      }
      if (this.state.pitchImages.length === 0) {
        uploadBtnTouched = true;
      }
      const email = { ...this.state.email };
      if (
        formData.founderTeam.value &&
        this.state.team.length === 0 &&
        this.state.entrepreneurs.length === 0 &&
        this.state.investors.length === 0 &&
        this.state.experts.length === 0 &&
        this.state.pendingRequests.length === 0
      ) {
        email.touched = true;
      }
      this.setState({ formData, uploadBtnTouched, email });
      return;
    }
    if (this.state.investorReadyPitch) {
      if (this.state.changeForm) {
        let isFormValid = true;
        const investorPitchForm = [...this.state.investorPitchForm];

        for (let field of investorPitchForm) {
          if (!field.valid) {
            field.touched = true;
            isFormValid = false;
          }
        }
        if (!isFormValid) {
          await this.setState({ investorPitchForm });
          return;
        }
      } else if (this.state.pitchFiles.length === 0) {
        alert("Please upload your own pitch");
        return;
      }
    }
    await this.setState({ publish: true });
    this.saveData();
  };
  saveForLater = async () => {
    if (!this.state.formData.title.valid) {
      const formData = { ...this.state.formData };
      formData.title.touched = true;
      this.setState({ formData });
      return;
    }
    await this.setState({ publish: false });
    this.saveData();
  };
  addTeamMember = async () => {
    const team = [...this.state.team];

    const email = { ...this.state.email };
    team.push(email.value);
    email.value = "";
    email.valid = false;
    email.validation.isRequired = true;
    email.touched = false;
    await this.setState({ team, email });
    this.handleChange();
  };

  removeTeamMember = async (key, index) => {
    const team = [...this.state[key]];
    const deletedTeamMeber = [...this.state.deletedTeamMeber];
    deletedTeamMeber.push(team[index]);
    team.splice(index, 1);
    await this.setState({ [key]: team, deletedTeamMeber });
    this.handleChange();
  };
  handleTeamFormChange = (value) => {
    const email = { ...this.state.email };
    email.value = value;
    email.touched = true;
    const validData = validate("email", { email });
    email.valid = validData[0];
    email.validationMessage = validData[1];
    if (value === "" && email.validation.isRequired) {
      email.touched = false;
      email.valid = false;
      email.validationMessage = "";
    }
    if (
      this.state.team.includes(value) ||
      value === this.props.User.user.email
    ) {
      email.valid = false;
      email.validationMessage = "Email already exists";
    }
    this.setState({ email });
  };
  handleInvestorPitchFormChange = (value, index) => {
    const investorPitchForm = [...this.state.investorPitchForm];
    const form = investorPitchForm[index];
    form.value = value;
    form.touched = true;
    if (form.value.trim()) form.valid = true;
    else form.valid = false;

    this.setState({ investorPitchForm });
  };
  saveData = async () => {
    try {
      this.setState({ showBackdrop: true });
      const data = {
        problemToSolveImages: this.state.problemToSolveImages,
        solutionToOfferImages: this.state.solutionToOfferImages,
        solutionDeliveryImages: this.state.solutionDeliveryImages,
        pitchImages: this.state.pitchImages,
        pitchFiles: this.state.pitchFiles,
        quickPitchFiles: this.state.quickPitchFiles,
        investorPitchFiles: this.state.investorPitchFiles,
        publish: this.state.publish,
        email: this.props.User.user.email,
        investorReadyPitch: this.state.investorReadyPitch,
        createdBy:
          this.props.User.user.firstName[0].toUpperCase() +
          this.props.User.user.firstName.substr(1) +
          " " +
          this.props.User.user.lastName[0].toUpperCase() +
          this.props.User.user.lastName.substr(1),
        createdAt: new Date(),
        updatedAt: new Date(),
        category: this.state.interests,
      };
      if (this.state.changeForm) {
        data.pitchFiles = [];
      }
      for (let key in this.state.formData) {
        if (
          this.state.formData[key].value !== undefined ||
          (!this.state.formData[key].touched &&
            this.state.formData[key].value !== "")
        ) {
          data[key] = this.state.formData[key].value;
        }
      }
      if (this.state.changeForm) {
        for (let field of this.state.investorPitchForm) {
          data[field.id] = field.value.trim() || "";
        }
      }
      data.entrepreneurs = this.state.entrepreneurs;
      data.investors = this.state.investors;
      data.experts = this.state.experts;
      data.team = this.state.team;
      if (
        data.entrepreneurs.length === 0 &&
        data.investors.length === 0 &&
        data.experts.length === 0 &&
        data.team.length === 0
      ) {
        data.founderTeam = false;
      }
      if (this.props.match.params.id) {
        data.email = this.props.Idea.idea.email;
        if (this.props.Idea.idea.email === this.props.User.user.email) {
          data.createdBy =
            this.props.User.user.firstName[0].toUpperCase() +
            this.props.User.user.firstName.substr(1) +
            " " +
            this.props.User.user.lastName[0].toUpperCase() +
            this.props.User.user.lastName.substr(1);
        } else {
          data.createdBy = this.props.Idea.idea.createdBy;
        }
        data.createdAt = this.props.Idea.idea.createdAt;
        data.id = this.props.match.params.id;
        if (this.state.deletedTeamMeber.length > 0) {
          for (let dtm of this.state.deletedTeamMeber) {
            const user = this.props.User.users.find(
              (user) => user.email === dtm.email
            );
            if (user) {
              if (dtm.pending) {
                user.requests.splice(
                  user.requests.findIndex(
                    (r) => r.pitchId === this.props.match.params.id
                  ),
                  1
                );
              } else {
                user.myPitch.splice(user.myPitch.indexOf(data.id), 1);
              }
              await updateUser(user);
            }
          }
        }
      }
      data.user = this.props.User.user;
      await this.props.addIdea(data);
      this.setState({ showBackdrop: false });
      if (this.props.Idea.info) {
        const snackbar = {
          open: true,
          message: this.props.Idea.info.message,
          title: this.props.Idea.info.title,
          level: "info",
        };
        if (this.state.publish) {
          await this.setState({ snackbar });
          setTimeout(() => this.props.history.push("/"), 1000);
        } else {
          snackbar.title = "Update Status";
          snackbar.message = "Changes saved successfully";
          this.setState({ snackbar });
          if (this.props.Idea.info.pitchId) {
            setTimeout(
              () =>
                this.props.history.push(
                  "/edit-pitch/" + this.props.Idea.info.pitchId
                ),
              1000
            );
          }
        }
      } else {
        const snackbar = {
          open: true,
          message: this.props.Idea.error.message,
          title: this.props.Idea.error.title,
          level: "info",
        };
        this.setState({ snackbar });
      }
    } catch (error) {
      console.log(error);
    }
  };
  changeInterest = (event) => {
    const formData = { ...this.state.formData };
    let isFormValid = this.state.isFormValid;
    if (event.target.value.includes("Other")) {
      formData.otherInterest.valid = !!formData.otherInterest.value;
      formData.otherInterest.validation.isRequired = true;
      isFormValid = isFormValid && formData.otherInterest.valid;
    } else {
      formData.otherInterest.valid = true;
      formData.otherInterest.validation.isRequired = false;
      formData.otherInterest.touched = true;
      formData.otherInterest.value = "";
    }
    this.setState({ interests: event.target.value, formData,isFormValid });
    setTimeout(this.handleChange);
  };
  closeModel = (image) => {
    this.setState({ model: { open: false }, pitchImages: [image] });
    setTimeout(this.handleChange);
  };
  showInvestorPitchForm = (value) => {
    this.setState({ investorReadyPitch: value });
  };
  addModel = () => {
    return (
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className="player-model"
        open={this.state.model.open}
        onClose={() => this.setState({ model: { open: false, url: null } })}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.state.model.open}>
          <div className="backdrop">
            {this.state.model.type === "images" ? (
              <div className="images">
                <Grid container spacing={1}>
                  {this.state.ideaBgImages.map((image, index) => (
                    <Grid item xs={6} sm={6} md={3} ld={3} key={index}>
                      <img
                        src={image.url}
                        alt={image.name}
                        onClick={() => this.closeModel(image)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            ) : (
              <video controls className="video">
                <source src={this.state.model.url} type="video/mp4" />
              </video>
            )}
          </div>
        </Fade>
      </Modal>
    );
  };
  addSnackBar = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={this.state.snackbar.open}
        autoHideDuration={2000}
        onClose={() =>
          this.setState({ snackbar: { ...this.state.snackbar, open: false } })
        }
        message={
          <div>
            <b>{this.state.snackbar.title}</b> <br />
            {this.state.snackbar.message}
          </div>
        }
        classes={{
          root: `snackbar-${this.state.snackbar.level}`,
        }}
      />
    );
  };
  addBackdrop = () => {
    return (
      <Backdrop
        open={this.state.showBackdrop}
        style={{ zIndex: 99999, color: "#fff" }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };
  numberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        prefix="$"
      />
    );
  }
  numberOnlyValidation(event) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }
  render() {
    if (this.state.loading) {
      return <PageSpinner />;
    }
    return (
      <Page className="pitch">
        <Container fixed>
          <Grid container className="m-3 pr-3 pl-3" justifyContent="space-between">
            <Grid item>
              <Typography color="textPrimary">Quick Pitch</Typography>
            </Grid>
            <Grid item>
              <Typography color="textPrimary">
                What is a Quick Pitch? &nbsp;
                <Tooltip
                  title="Help"
                  onClick={() => this.props.history.push("/help/quick-pitch")}
                >
                  <HelpIcon color="primary" className="cursor-pointer" />
                </Tooltip>
              
              </Typography>
            </Grid>
          </Grid>
          <hr />
          <form className="form" noValidate onSubmit={this.handleSubmit}>
            <Grid container>
              <Grid item md={1} ld={1} />
              <Grid item xs={12} sm={12} ld={2} md={2}>
                Your Idea
              </Grid>
              <Grid item xs={12} sm={12} ld={9} md={9}>
                <Grid container>
                  <Grid item xs={12} sm={12} ld={8} md={8}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required={this.state.formData.title.validation.isRequired}
                      fullWidth
                      id="title"
                      label="Idea name"
                      name="title"
                      multiline
                      value={this.state.formData.title.value}
                      onChange={(event) =>
                        this.handleChange("title", event.target.value)
                      }
                      helperText={this.state.formData.title.validationMessage}
                      error={
                        this.state.formData.title.touched &&
                        !this.state.formData.title.valid
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12} className="mb-2">
                    <div>
                      <label
                        style={
                          this.state.pitchImages.length === 0 &&
                          this.state.uploadBtnTouched
                            ? { color: "#f44336" }
                            : { color: "#212529" }
                        }
                      >
                        Upload an Image representing your Idea
                      </label>
                    </div>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="images-button-file"
                      type="file"
                      onChange={(event) =>
                        this.handleFileUpload("pitchImages", event)
                      }
                    />
                    <label htmlFor="images-button-file">
                      <Button
                        variant="outlined"
                        onClick={() =>
                          this.setState({ uploadBtnTouched: true })
                        }
                        color="default"
                        component="div"
                        startIcon={<CloudUploadIcon color="secondary" />}
                      >
                        Upload
                      </Button>
                    </label>
                    <span className="pl-3 pr-3">OR</span>
                    <Button
                      color="primary"
                      variant="outlined"
                      startIcon={<CollectionsIcon />}
                      onClick={() =>
                        this.setState({
                          model: { open: true, type: "images" },
                          uploadBtnTouched: true,
                        })
                      }
                    >
                      Select from gallery
                    </Button>
                   
                  </Grid>
                </Grid>
                {this.state.pitchImages.length > 0 && (
                  <Grid container>
                    <Grid item xs={12} md={8}>
                      <Paper className="file-list">
                        {this.state.pitchImages.map((file, index) => (
                          <Chip
                            className="file-name"
                            key={index}
                            avatar={
                              <Avatar
                                className="chip-image"
                                alt="title"
                                src={
                                  file.url
                                    ? file.url
                                    : URL.createObjectURL(file)
                                }
                              />
                            }
                            variant="outlined"
                          
                            onDelete={() => this.handleDelete("pitch", index)}
                          />
                        ))}
                      </Paper>
                    </Grid>
                  </Grid>
                )}

                <Grid container className="mt-2">
                  <Grid item xs={12} sm={12} ld={8} md={8}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required={
                        this.state.formData.description.validation.isRequired
                      }
                      fullWidth
                      multiline
                      id="description"
                      label="Brief description"
                      name="description"
                      value={this.state.formData.description.value}
                      onChange={(event) =>
                        this.handleChange("description", event.target.value)
                      }
                      helperText={
                        this.state.formData.description.validationMessage
                      }
                      error={
                        this.state.formData.description.touched &&
                        !this.state.formData.description.valid
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container className="mt-3">
                  <Grid item xs={12} sm={12} ld={8} md={8}>
                    <FormControl
                      style={{ width: "100%" }}
                      variant="outlined"
                      className="multi-select"
                    >
                      <InputLabel id="mutiple-checkbox-label">
                        Industry your idea belongs to
                      </InputLabel>
                      <Select
                        labelId="mutiple-checkbox-label"
                        id="mutiple-checkbox"
                        multiple
                        fullWidth
                        value={this.state.interests}
                        onChange={this.changeInterest}
                        input={<Input />}
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {industryOfInterestsDataArray.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox
                              color="primary"
                              checked={this.state.interests.indexOf(name) > -1}
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                {this.state.interests.includes("Other") && (
                  <Grid container className="mt-3">
                    <Grid item xs={12} sm={12} ld={8} md={8}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        required={
                          this.state.formData.otherInterest.validation
                            .isRequired
                        }
                        id="other-interest"
                        label="Other category"
                        name="other-interest"
                        value={this.state.formData.otherInterest.value}
                        onChange={(event) =>
                          this.handleChange("otherInterest", event.target.value)
                        }
                        helperText={
                          this.state.formData.otherInterest.validationMessage
                        }
                        error={
                          this.state.formData.otherInterest.touched &&
                          !this.state.formData.otherInterest.valid
                        }
                      />
                    </Grid>
                  </Grid>
                )}
                <Grid container className="mt-3">
                  <Grid item xs={12} sm={12} ld={8} md={8}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required={this.state.formData.stage.validation.isRequired}
                      fullWidth
                      select
                      id="stage"
                      label="Stage your idea is in "
                      name="ideaPrototype"
                      value={this.state.formData.stage.value}
                      onChange={(event) =>
                        this.handleChange("stage", event.target.value)
                      }
                      helperText={this.state.formData.stage.validationMessage}
                      error={
                        this.state.formData.stage.touched &&
                        !this.state.formData.stage.valid
                      }
                    >
                      <MenuItem key="1" value="Concept">
                        Concept
                      </MenuItem>
                      <MenuItem key="2" value="Prototype">
                        Prototype
                      </MenuItem>
                      <MenuItem key="3" value="Launched">
                        Launched
                      </MenuItem>
                      <MenuItem key="4" value="Revenue generating">
                        Revenue generating
                      </MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container className="mt-3">
                  <Grid item xs={12} sm={12} ld={8} md={8}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required={
                        this.state.formData.websiteUrl.validation.isRequired
                      }
                      id="websiteUrl"
                      label="Website URL (Optional)"
                      name="websiteUrl"
                      value={this.state.formData.websiteUrl.value}
                      onChange={(event) =>
                        this.handleChange("websiteUrl", event.target.value)
                      }
                      helperText={
                        this.state.formData.websiteUrl.validationMessage
                      }
                      error={
                        this.state.formData.websiteUrl.touched &&
                        !this.state.formData.websiteUrl.valid
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <hr />
            {this.state.isAdminAccess && (
              <>
                <Grid container className="mt3">
                  <Grid item md={1} ld={1} />
                  <Grid item xs={12} sm={12} ld={2} md={2}>
                    Your Team
                  </Grid>
                  <Grid item xs={12} sm={12} ld={9} md={9}>
                    <Grid container>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              className="ml-0"
                              checked={this.state.formData.founderTeam.value}
                              onChange={async (event) => {
                                const value = event.target.checked;
                                if (!value) {
                                  await this.setState({
                                    team: [],
                                    entrepreneurs: [],
                                    experts: [],
                                    investors: [],
                                    deletedTeamMeber: [
                                      ...this.state.entrepreneurs.map(
                                        (u) => u.email
                                      ),
                                      ...this.state.investors.map(
                                        (u) => u.email
                                      ),
                                      ...this.state.experts.map((u) => u.email),
                                    ],
                                  });
                                }
                                this.handleChange("founderTeam", value);
                              }}
                              value={this.state.formData.founderTeam.value}
                              color="primary"
                            />
                          }
                          labelPlacement="start"
                          label="There are other founders"
                        />
                      </Grid>
                    </Grid>
                    {this.state.formData.founderTeam.value && (
                      <div>
                        <Grid container spacing={1}>
                          <Grid item xs={9} sm={9} ld={8} md={8}>
                            <TextField
                              variant="outlined"
                              required={this.state.email.validation.isRequired}
                              fullWidth
                              id="email"
                              label="Provide e-mail to invite to SYP "
                              name="email"
                              value={this.state.email.value}
                              onChange={(event) =>
                                this.handleTeamFormChange(event.target.value)
                              }
                              helperText={this.state.email.validationMessage}
                              error={
                                this.state.email.touched &&
                                !this.state.email.valid
                              }
                            />
                          </Grid>
                          <Grid item xs={3} sm={3} ld={8} md={8}>
                            <Button
                              variant="contained"
                              size="large"
                              color="primary"
                              component="div"
                              className="mt-1"
                              onClick={() => this.addTeamMember()}
                              disabled={!this.state.email.valid}
                            >
                              Add
                            </Button>
                          </Grid>
                        </Grid>

                        {(this.state.entrepreneurs.length > 0 ||
                          this.state.experts.length > 0 ||
                          this.state.investors.length > 0 ||
                          this.state.team.length > 0 ||
                          this.state.pendingRequests.length > 0) && (
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                              <Paper className="file-list">
                                {this.state.team.map((member, index) => (
                                  <Chip
                                    className="file-name"
                                    key={index}
                                    label={member}
                                    variant="outlined"
                                    onDelete={() =>
                                      this.removeTeamMember("team", index)
                                    }
                                  />
                                ))}
                                {this.state.entrepreneurs.map(
                                  (member, index) => (
                                    <Chip
                                      className="file-name"
                                      key={index}
                                      label={member.email}
                                      variant="outlined"
                                      onDelete={() =>
                                        this.removeTeamMember(
                                          "entrepreneurs",
                                          index
                                        )
                                      }
                                    />
                                  )
                                )}
                                {this.state.experts.map((member, index) => (
                                  <Chip
                                    className="file-name"
                                    key={index}
                                    label={member.email}
                                    variant="outlined"
                                    onDelete={() =>
                                      this.removeTeamMember("experts", index)
                                    }
                                  />
                                ))}
                                {this.state.investors.map((member, index) => (
                                  <Chip
                                    className="file-name"
                                    key={index}
                                    label={member.email}
                                    variant="outlined"
                                    onDelete={() =>
                                      this.removeTeamMember("investors", index)
                                    }
                                  />
                                ))}
                                {this.state.pendingRequests.map(
                                  (member, index) => (
                                    <Chip
                                      className="file-name"
                                      style={{ borderColor: "orange" }}
                                      key={index}
                                      label={member.email}
                                      variant="outlined"
                                      onDelete={() =>
                                        this.removeTeamMember(
                                          "pendingRequests",
                                          index
                                        )
                                      }
                                    />
                                  )
                                )}
                              </Paper>
                            </Grid>
                          </Grid>
                        )}
                      </div>
                    )}
                  </Grid>
                </Grid>
                <hr />
              </>
            )}
            <Grid container className="mt3">
              <Grid item md={1} ld={1} />
              <Grid item xs={12} sm={12} ld={2} md={2}>
                Value Proposition
              </Grid>
              <Grid item xs={12} sm={12} ld={9} md={9}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      className="mt-0"
                      required={
                        this.state.formData.problemToSolve.validation.isRequired
                      }
                      fullWidth
                      multiline
                      id="problemToSolve"
                      label="Problem/Challenge you are trying to solve"
                      name="problemToSolve"
                      value={this.state.formData.problemToSolve.value}
                      onChange={(event) =>
                        this.handleChange("problemToSolve", event.target.value)
                      }
                      helperText={
                        this.state.formData.problemToSolve.validationMessage
                      }
                      error={
                        this.state.formData.problemToSolve.touched &&
                        !this.state.formData.problemToSolve.valid
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      variant="outlined"
                      className="mt-0"
                      margin="normal"
                      required={
                        this.state.formData.solutionToOffer.validation
                          .isRequired
                      }
                      fullWidth
                      multiline
                      id="solutionToOffer"
                      label="Solution you are offering"
                      name="solutionToOffer"
                      value={this.state.formData.solutionToOffer.value}
                      onChange={(event) =>
                        this.handleChange("solutionToOffer", event.target.value)
                      }
                      helperText={
                        this.state.formData.solutionToOffer.validationMessage
                      }
                      error={
                        this.state.formData.solutionToOffer.touched &&
                        !this.state.formData.solutionToOffer.valid
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      className="mt-0"
                      required={
                        this.state.formData.solutionDelivery.validation
                          .isRequired
                      }
                      fullWidth
                      multiline
                      id="solutionDelivery"
                      label="The team"
                      name="solutionDelivery"
                      value={this.state.formData.solutionDelivery.value}
                      onChange={(event) =>
                        this.handleChange(
                          "solutionDelivery",
                          event.target.value
                        )
                      }
                      helperText={
                        this.state.formData.solutionDelivery.validationMessage
                      }
                      error={
                        this.state.formData.solutionDelivery.touched &&
                        !this.state.formData.solutionDelivery.valid
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <input
                      accept="*"
                      style={{ display: "none" }}
                      id="delivery-button-file"
                      type="file"
                      onChange={(event) =>
                        this.handleFileUpload("quickPitchFiles", event)
                      }
                    />
                    <label htmlFor="delivery-button-file">
                      <Button
                        variant="outlined"
                        color="default"
                        component="div"
                        style={{ textTransform: "inherit" }}
                        startIcon={<CloudUploadIcon color="secondary" />}
                      >
                        I would like to upload my own file/video
                      </Button>
                    </label>
                  </Grid>
                </Grid>
                {this.state.quickPitchFiles.length > 0 ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Paper className="file-list">
                        {this.state.quickPitchFiles.map((file, index) => (
                          <Chip
                            className="file-name"
                            key={index}
                            label={file.name.substr(0, 50)}
                            variant="outlined"
                            onDelete={() =>
                              this.handleDelete("quickPitchFile", index)
                            }
                          />
                        ))}
                      </Paper>
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
            <hr />
            <Grid container className="mt3">
              <Grid item ld={1} md={1} />
              <Grid item xs={12} sm={12} ld={2} md={2}>
                Total Funding (USD)
              </Grid>
              <Grid item xs={12} sm={12} ld={9} md={9}>
                <Grid container>
                  <Grid item xs={12} md={8}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      className="mt-0"
                      required={
                        this.state.formData.requiredFunding.validation
                          .isRequired
                      }
                      fullWidth
                      select
                      id="requiredFunding"
                      label="Funding I am looking for"
                      name="requiredFunding"
                      value={this.state.formData.requiredFunding.value}
                      onChange={(event) =>
                        this.handleChange("requiredFunding", event.target.value)
                      }
                      helperText={
                        this.state.formData.requiredFunding.validationMessage
                      }
                      error={
                        this.state.formData.requiredFunding.touched &&
                        !this.state.formData.requiredFunding.valid
                      }
                    >
                      <MenuItem key="1" value="Less then $25,000">
                        less then $25,000
                      </MenuItem>
                      <MenuItem key="2" value="$25,000 - $50,000">
                        $25,000 - $50,000
                      </MenuItem>
                      <MenuItem key="3" value="$50,000 - $75,000">
                        $50,000 - $75,000
                      </MenuItem>
                      <MenuItem key="4" value="$75,000 - $100,000">
                        $75,000 - $100,000
                      </MenuItem>
                      <MenuItem key="5" value="$100,000 - $500,000">
                        $100,000 - $500,000
                      </MenuItem>
                      <MenuItem key="6" value="more than $500,000">
                        more than $500,000
                      </MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12} md={8}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      className="mt-0"
                      required={
                        this.state.formData.totalFunding.validation.isRequired
                      }
                      id="totalFunding"
                      label="Amount of funding already in place"
                      name="totalFunding"
                      fullWidth
                      value={this.state.formData.totalFunding.value}
                      InputProps={{
                        inputComponent: this.numberFormatCustom,
                      
                      }}
                      onKeyPress={this.numberOnlyValidation}
                    
                      onChange={(event) => {
                        this.handleChange("totalFunding", event.target.value);
                      }}
                      helperText={
                        this.state.formData.totalFunding.validationMessage
                      }
                      error={
                        this.state.formData.totalFunding.touched &&
                        !this.state.formData.totalFunding.valid
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {!this.state.investorReadyPitch ? (
              <div>
                <Grid container justifyContent="flex-end" spacing={3}>
                  <Grid item></Grid>
                  <Grid item>
                    {!this.state.publish && (
                      <Button
                        variant="outlined"
                        color="default"
                        size="large"
                        className="mr-3"
                        style={{ textTransform: "inherit" }}
                        onClick={this.saveForLater}
                      >
                        Save changes
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      size="large"
                    >
                      {this.state.publish
                        ? "Publish changes"
                        : "Publish quick pitch"}
                    </Button>
                  </Grid>
                </Grid>
              </div>
            ) : null}
            <hr />
            <Grid container className="mt-3">
              <Grid item xs={12} sm={12} ld={4} md={4}>
                I am ready to complete the investor pitch
              </Grid>
              <Grid item ld={8} md={8} xs={12} sm={12}>
                <Grid
                  component="label"
                  container
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>No</Grid>
                  <Grid item>
                    <Switch
                      checked={this.state.investorReadyPitch}
                      onChange={(event) =>
                        this.showInvestorPitchForm(event.target.checked)
                      }
                      value={this.state.investorReadyPitch}
                      color="primary"
                    />
                  </Grid>
                  <Grid item>Yes</Grid>
                </Grid>
              </Grid>
            </Grid>
            <hr />
            {this.state.investorReadyPitch ? (
              <Grid>
                <Grid
                  container
                  className="m-3 pr-3 pl-3"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography color="textPrimary">
                      My Investor Pitch
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography color="textPrimary">
                      What is an Investor Pitch? &nbsp;
                      <Tooltip
                        title="Help"
                        onClick={() => this.props.history.push("/help/investor-pitch")}
                      >
                        <HelpIcon color="primary" className="cursor-pointer" />
                      </Tooltip>
                      &nbsp;
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid container>
                    <Grid item ld={3} md={3} />
                    <Grid item ld={5} md={5} xs={12} sm={12}>
                      <p>
                        You are now ready to complete the Investor Pitch. You
                        can choose to <b>Upload your own Pitch</b> or use the
                        <b> SYP template </b>.
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item ld={3} md={3} />
                  <Grid item ld={9} md={9} sm={12} xs={12}>
                    <Grid
                      component="label"
                      container
                      alignItems="center"
                      spacing={1}
                    >
                      <Grid item>Upload Pitch</Grid>
                      <Grid item>
                        <Switch
                          classes={{
                            switchBase: "switchBase-custom",
                            track: "switchTrack-custom",
                          }}
                          checked={this.state.changeForm}
                          onChange={(event) =>
                            this.setState({ changeForm: event.target.checked })
                          }
                          value="changeForm"
                          color="primary"
                        />
                      </Grid>
                      <Grid item>SYP Template</Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <hr />
                {!this.state.changeForm ? (
                  <Grid container>
                    <Grid item ld={3} md={3} />
                    <Grid item ld={9} md={9} sm={12} xs={12}>
                      <Grid container>
                        <Grid item xs={12} sm={12} ld={4} md={4}>
                          <input
                            style={{ display: "none" }}
                            id="pitch-button-file"
                            type="file"
                            accept="application/pdf"
                            onChange={(event) =>
                              this.handleFileUpload("pitchFiles", event)
                            }
                          />
                          <label htmlFor="pitch-button-file">
                            <Button
                              variant="outlined"
                              size="large"
                              color="default"
                              component="div"
                              startIcon={<CloudUploadIcon color="secondary" />}
                            >
                              Upload my own pitch
                            </Button>
                          </label>
                        </Grid>
                        <Grid item xs={12} sm={12} ld={8} md={8}>
                          {this.state.pitchFiles &&
                          this.state.pitchFiles.length > 0 ? (
                            <div className="mt-2">
                              <Chip
                                className="file-name"
                                key={1}
                                label={this.state.pitchFiles[0].name.substr(
                                  0,
                                  50
                                )}
                                variant="outlined"
                                onDelete={() => this.handleDelete("pitchFiles")}
                              />
                            </div>
                          ) : null}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container>
                    <Grid item ld={1} md={1} />
                    <Grid item xs={12} sm={12} ld={2} md={2}>
                      <label> More Details</label>
                      <br />
                      <Typography variant="caption" component="span">
                        Optional: For each section, you can upload a supporting
                        image.
                      </Typography>{" "}
                      <br /> <br />
                      <Typography variant="caption" component="span">
                        Note: All fields are mandatory. To skip a field type
                        "n/a".
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} ld={9} md={9}>
                      {this.state.investorPitchForm.map((fieldData, index) => (
                        <Grid container key={index}>
                          <Grid item xs={12} sm={10} ld={8} md={8}>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              className="mb-3 mt-0"
                              required={fieldData.isRequired}
                              fullWidth
                              placeholder={fieldData.placeholder}
                              multiline={fieldData.multiline}
                              rows={fieldData.multiline ? fieldData.rows : 1}
                              id={fieldData.id}
                              label={fieldData.title}
                              name={fieldData.id}
                              value={fieldData.value}
                              onChange={(event) =>
                                this.handleInvestorPitchFormChange(
                                  event.target.value,
                                  index
                                )
                              }
                              helperText={fieldData.validationMessage}
                              error={fieldData.touched && !fieldData.valid}
                            />
                          </Grid>
                          <Grid item xs={12} sm={2} ld={4} md={4}>
                            <input
                              accept="image/*"
                              name={fieldData.id}
                              style={{ display: "none" }}
                              id={"images-button-file-" + index}
                              type="file"
                              multiple
                              onChange={(event) =>
                                this.handleFileUpload(
                                  "investorPitchFiles",
                                  event
                                )
                              }
                            />
                            <label htmlFor={"images-button-file-" + index}>
                              {index === 0 ? (
                                <div className="d-flex">
                                  <IconButton color="inherit" component="span">
                                    {/* <CloudUploadIcon color="secondary" /> */}
                                    <img
                                      alt="upload"
                                      src={AddPhoto}
                                      width="32px"
                                    />
                                  </IconButton>
                                  <Typography
                                    variant="caption"
                                    component="span"
                                  >
                                    Optional: Upload an image to support a
                                    section
                                  </Typography>
                                </div>
                              ) : (
                                <IconButton color="inherit" component="span">
                                  <Tooltip title="Optional: Upload an image to support a section">
                                    {/* <CloudUploadIcon color="secondary" /> */}
                                    <img
                                      alt="upload"
                                      src={AddPhoto}
                                      width="32px"
                                    />
                                  </Tooltip>
                                </IconButton>
                              )}
                            </label>
                          </Grid>
                          {this.state.investorPitchFiles[fieldData.id] &&
                            this.state.investorPitchFiles[fieldData.id].length >
                              0 && (
                              <Grid item xs={12} md={8}>
                                <Paper className="file-list mb-3">
                                  {this.state.investorPitchFiles[
                                    fieldData.id
                                  ].map((file, index) => (
                                    <Chip
                                      className="file-name"
                                      key={index}
                                      avatar={
                                        <Avatar
                                          className="chip-image"
                                          alt="title"
                                          src={
                                            file.url
                                              ? file.url
                                              : URL.createObjectURL(file)
                                          }
                                        />
                                      }
                                      variant="outlined"
                                      onDelete={() => {
                                        const investorPitchFiles = {
                                          ...this.state.investorPitchFiles,
                                        };
                                        investorPitchFiles[fieldData.id].splice(
                                          index,
                                          1
                                        );
                                        this.setState({ investorPitchFiles });
                                      }}
                                    />
                                  ))}
                                </Paper>
                              </Grid>
                            )}
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}
                <hr />
                <Grid container className="mb-3" justifyContent="flex-end" spacing={3}>
                  <Grid item>
                    {!this.state.publish && (
                      <Button
                        size="large"
                        variant="outlined"
                        color="default"
                        className="mr-3"
                        style={{ textTransform: "inherit" }}
                        onClick={this.saveForLater}
                      >
                        Save changes
                      </Button>
                    )}
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      type="submit"
                    >
                      {this.state.publish
                        ? "Publish changes"
                        : " Publish Investor Pitch"}
                    </Button>
                  </Grid>
                </Grid>
                <hr />
              </Grid>
            ) : null}
          </form>
        </Container>
        {this.addBackdrop()}
        {this.addSnackBar()}
        {this.addModel()}
      </Page>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    User: state.User,
    Idea: state.Idea,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      addIdea,
      findIdeaDetails,
      findAllUsers,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PitchForm));
