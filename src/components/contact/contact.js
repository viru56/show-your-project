import React from "react";
import AuthBg from "../../assets/images/contact img.png";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import {
  Grid,
  TextField,
  Typography,
  FormControl,
  Snackbar,
  Button,
} from "@material-ui/core/";
import Page from "../page";
import Container from "@material-ui/core/Container";
//import emailjs from "emailjs-com";
import { firebaseMessage } from "../../libs/config.js";
import { contactUs } from "../../store/actions/user_action";

/* you can send a message to owner of this website. if you have any query */
class Contact extends React.Component {
  state = {
    name: "",
    email: "",
    subject: "",
    message: "",
    snakbar: false,
    snackbar: {
      snackBarmessage: "Our team will get back to you very soon.",
      title: "Your message has been submitted successfully.",
      level: "success",
    },
  };
  componentDidMount() {
    if (!this.props.User.user) {
      this.props.history.push("/login");
    } else {
      this.setState({
        name:
          this.props.User.user.firstName + " " + this.props.User.user.lastName,
        email: this.props.User.user.email,
      });
    }
  }
  formSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = this.state;
    if (subject.trim() && message.trim()) {
      this.addData(name, email, subject, message);
      await contactUs(this.state);
      this.formReset();
    } else {
      const snackbar = {
        snackBarmessage: "Please try after some time",
        title: "Currently, we are facing some issue.",
        level: "error",
      };
      await this.setState({ snackbar });
    }
    setTimeout(()=>{
      if (this.props.location.pathname === "/notVerifiedContact") {
        this.props.history.push("/login");
      } else {
        this.props.history.push("/");
      }
    },2000);
  };
  formReset = () => {
    this.setState({
      subject: " ",
      message: " ",
    });
  };
  addData = (name, email, subject, message) => {
    const items = { name, email, subject, message };

    if (items) {
      firebaseMessage.add(items);
      this.setState({ snakbar: true });
    } else {
      this.setState({ snakbar: true });
    }
  };

  handleClick = () => {
    this.setState({ snakbar: false });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snakbar: false });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Page className="contact">
        <Container>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.snakbar}
            autoHideDuration={6000}
            onClose={this.handleClose}
            classes={{
              root: `snackbar-${this.state.snackbar.level}`,
            }}
            message={
              <div>
                {this.state.snackbar.title}
                <br />
                {this.state.snackbar.snackBarmessage}
              </div>
            }
          ></Snackbar>
          <Grid container spacing={4} className="main-div">
            <Grid item xs={12} sm={6} md={6}>
              <img src={AuthBg} className="contact-image" alt="contact" />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    {/* Contact Start<span className="ryt">Ryt</span> */}
                    Contact Us
                  </Typography>
                  <Typography variant={"subtitle1"}>
                    Our team is here to help you.
                  </Typography>
                  <br />
                  <Typography className="pt-2">
                    Your Questions, Comments or Feedback are always appreciated
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant={"subtitle1"} className="capital">
                    <br />
                    <b> Name:</b> {this.state.name}
                  </Typography>

                  <Typography variant={"subtitle1"}>
                    <b className="capital"> E-mail:</b> {this.state.email}
                  </Typography>

                  <form onSubmit={this.formSubmit}>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        id="outlined-search"
                        label="Subject"
                        variant="outlined"
                        onChange={this.handleChange}
                        name="subject"
                        required
                        value={this.state.subject}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <TextField
                        id="filled-multiline-static"
                        label="Message"
                        multiline
                        rows="3"
                        name="message"
                        required
                        value={this.state.message}
                        variant="outlined"
                        onChange={this.handleChange}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      variant="contained"
                      className="btn-color mt-2"
                    >
                      Submit
                    </Button>
                  </form>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};

export default connect(mapStateToProps)(withRouter(Contact));
