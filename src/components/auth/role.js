import React, { PureComponent } from "react";
import Logo from "../logo";
import validate from "../../libs/forms/validate";
import {
  updateUserDetails,
  sendEmailVerification,
} from "../../store/actions/user_action";
import { withRouter, Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Grid,
  Snackbar,
  Backdrop,
  CircularProgress,
  Card,
  CardActions,
  CardContent,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  IconButton,
  Checkbox,
  Typography,
  MenuItem,
  InputLabel,
  ListItemText,
  Select,
  Input,
  InputAdornment,
  Box,
} from "@material-ui/core";
import { industryOfInterestsDataArray } from "../../constants/mockResponse";
import entrepreneurImageUrl from "../../assets/images/entrepreneur.svg";
import investorImageUrl from "../../assets/images/investor.svg";
import expertImageUrl from "../../assets/images/expert.svg";
import subscriptionImageUrl from "../../assets/images/undraw_subscriptions_1xdv.svg";
import login from "../../assets/images/login.svg";
import { COLOR } from "../../constants/Colors";
import csc from "country-state-city";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import smile from "../../assets/images/smile.png";
import { sendMail } from "../../store/actions/notification_action";


/* choose a role and add details specific to that role */
class Role extends PureComponent {
  state = {
    termsAndCondition: false,
    showBackdrop: false,
    role: "entrepreneur",
    file: null,
    photoUrl: "",
    isFormValid: false,
    showRole: true,
    showSubscription: true,
    imageUrl: login,
    snackbar: {
      open: false,
      title: "",
      message: "",
    },
    interests: [],
    formData: {
      firstName: {
        value: this.props.User.user ? this.props.User.user.firstName : "",
        validation: {
          isRequired: true,
          maxLength: 150,
          isName: true,
        },
        valid:
          this.props.User.user && this.props.User.user.firstName ? true : false,
        touched: false,
        validationMessage: "",
      },
      lastName: {
        value: this.props.User.user ? this.props.User.user.lastName : "",
        validation: {
          isRequired: true,
          maxLength: 150,
          isName: true,
        },
        valid:
          this.props.User.user && this.props.User.user.lastName ? true : false,
        touched: false,
        validationMessage: "",
      },
      country: {
        value: "",
        validation: {
          isRequired: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      state: {
        value: "",
        validation: {
          isRequired: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      city: {
        value: "",
        validation: {
          isRequired: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      education: {
        value: "",
        validation: {
          isRequired: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      income: {
        value: "",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      phone: {
        value: "",
        validation: {
          isRequired: true,
          isPhone: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      otherInterest: {
        value: "",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      employmentStatus: {
        value: "",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      experience: {
        value: "",
        validation: {
          isRequired: false,
          isMin: 0,
          isMax: 100,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      companyName: {
        value: "",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      about: {
        value: "",
        validation: {
          isRequired: true,
          // minLength: 100,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      linkedInProfileUrl: {
        value: "",
        validation: {
          isRequired: false,
          isUrl: true,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
    },
    menuProps: {
      PaperProps: {
        style: {
          maxHeight: 250,
          width: 400,
        },
      },
    },
  };
  componentDidMount() {
    if (!this.props.User.user) {
      this.props.history.push("/login"); // to add
    } else {
      this.setState({
        photoUrl: this.props.User.user.photoUrl
          ? this.props.User.user.photoUrl
          : "",
      });
    }
  }
  startFreeTrial = () => {
    let imageUrl = "";
    if (this.state.role === "entrepreneur") {
      imageUrl = entrepreneurImageUrl;
    } else if (this.state.role === "expert") {
      imageUrl = expertImageUrl;
    } else {
      imageUrl = investorImageUrl;
    }
    this.setState({
      showSubscription: false,
      imageUrl,
    });
  };
  /* show user form based on role */
  next = () => {
    const formData = { ...this.state.formData };
    let imageUrl = subscriptionImageUrl;
    if (this.state.role === "entrepreneur") {
      formData.income.valid = false;
      formData.income.touched = false;
      formData.income.validation.isRequired = false;
      formData.income.value = "";
      formData.phone.valid = true;
      formData.phone.validation.isRequired = false;
      formData.phone.value = "";
    } else if (this.state.role === "expert") {
      imageUrl = expertImageUrl;
      formData.phone.touched = false;
      formData.phone.valid = false;
      formData.phone.validation.isRequired = true;
      formData.phone.value = "";
    } else {
      formData.phone.touched = false;
      formData.phone.valid = false;
      formData.phone.validation.isRequired = true;
      formData.phone.value = "";
    }
    this.setState({
      showRole: false,
      termsAndCondition: false,
      isFormValid: false,
      imageUrl,
      formData,
    });
  };
  handleClose = () => {
    const snackbar = { ...this.state.snackbar };
    snackbar.open = false;
    this.setState({ snackbar });
  };
  handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (
        this.state.interests.includes("Other") &&
        !this.state.formData.otherInterest.value.trim()
      ) {
        const formData = { ...this.state.formData };
        formData.otherInterest.touched = true;
        formData.otherInterest.valid = false;
        formData.otherInterest.validationMessage = "This field is required";
        this.setState({ formData });
        return;
      }
      this.setState({ showBackdrop: true });
      const data = { ...this.props.User.user, role: this.state.role };
      for (let key in this.state.formData) {
        if (this.state.formData[key].value) {
          data[key] = this.state.formData[key].value.trim();
        }
      }
      if (data.role === "entrepreneur") data.isVerified = true;
      else data.isVerified = false;
      data.file = this.state.file;
      if (this.state.interests.length > 0) {
        data.interests = this.state.interests;
      }
      data.profile = "public";
      await this.props.updateUserDetails(data);
      this.setState({ showBackdrop: false });
      if (this.props.User.error) {
        const snackbar = {
          open: true,
          message: this.props.User.error.message,
          title: this.props.User.error.title,
          level: "error",
        };
        this.setState({ snackbar });
        return;
      }
      if (!this.props.User.user.emailVerified) {
        await sendEmailVerification();
      }
      if (data.role === "entrepreneur") {
        sendMail({ to: this.props.User.user.email, type: "welcome" });
        if (this.props.User.user.emailVerified) {
          this.props.history.push("/");
        } else {
          this.props.history.push("/emailVerification");
        }
      } else {
        this.props.history.push("/notVerified");
      }
    } catch (error) {
      console.log(error);
    }
  };
  numberOnlyValidation(event) {
    var regex = new RegExp(/^[0-9]+$/);
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }
  handleChange = (key, value) => {
    const formData = { ...this.state.formData };
    let isFormValid = true;
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
    if (
      !formData.city.valid ||
      !formData.country.valid ||
      !formData.state.valid ||
      !formData.phone.valid ||
      !formData.about.valid
    ) {
      isFormValid = false;
    }
    if (this.state.role === "entrepreneur") {
      if (!formData.education.valid || !formData.income.valid) {
        isFormValid = false;
      }
    } else if (this.state.role === "investor" && !formData.phone.valid) {
      isFormValid = false;
    } else if (
      this.state.role === "expert" &&
      (!formData.phone.valid || !formData.education.valid)
    ) {
      isFormValid = false;
    }
    if (key === "country") {
      formData.state.value = "";
      formData.city.value = "";
    }

    this.setState({ formData, isFormValid });
  };
  changeFile = (file) => {
    this.setState({ photoUrl: URL.createObjectURL(file), file });
  };
  removeImage = (e) => {
    e.preventDefault();
    this.setState({ file: null, photoUrl: "" });
  };
  changeInterest = (event) => {
    this.setState({ interests: event.target.value });
  };

  render() {
    return (
      <Grid container component="main" className="auth">
        <CssBaseline />
        <Grid item md={6} className="hidden-sm hidden-xs show-form">
          <div style={{ padding: "60px", marginLeft: "100px" }}>
            <Logo />
            {!this.state.showSubscription && (
              <div style={{ marginTop: "60px" }}>
                <Typography variant="h5" gutterBottom>
                  <span style={{ color: "#9B9696" }}>WELCOME TO Show Your Project</span>
                  {/*<span style={{ color: COLOR.green }}>RYT</span>*/}
                </Typography>
                <Typography variant="subtitle2" style={{ color: COLOR.green }}>
                  Let’s work together to bring Ideas to Life!
                </Typography>
              </div>
            )}
            <div>
              <img src={this.state.imageUrl} className="image" alt="login" />
            </div>
          </div>
        </Grid>

        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          style={this.state.showRole ? null : { background: "#fff" }}
        >
          <div className="paper">
            {this.state.showRole ? (
              <Card className="role-card">
                <CardContent className="text-center">
                  <FormControl component="fieldset">
                    <FormLabel component="legend" className="legend">
                      Select a role
                    </FormLabel>
                    <RadioGroup
                      aria-label="Role"
                      name="role"
                      value={this.state.role}
                      onChange={(event) =>
                        this.setState({
                          role: event.target.value,
                          showSubscription:
                            event.target.value === "expert" ? false : true,
                        })
                      }
                    >
                      <FormControlLabel
                        value="entrepreneur"
                        control={<Radio color="primary" />}
                        label="Entrepreneur"
                      />
                      <FormControlLabel
                        value="expert"
                        control={<Radio color="primary" />}
                        label="Expert"
                      />
                      <FormControlLabel
                        value="investor"
                        control={<Radio color="primary" />}
                        label="Investor"
                      />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
                <CardActions style={{ justifyContent: "center" }}>
                  <Button
                    className="mb-3"
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={this.next}
                  >
                    Next
                  </Button>
                </CardActions>
              </Card>
            ) : (
              <div>
                {this.state.showSubscription ? (
                  <div className="subscription">
                    <Grid
                      container
                      direction="column"
                      spacing={2}
                      alignItems="center"
                    >
                      <Grid item>
                        <Typography style={{ color: "#1B71FB" }} variant="h4">
                          The first 3 months are on us &nbsp;
                          <img src={smile} alt="smile" width="32" />
                        </Typography>
                      </Grid>
                      {/* <Grid item>
                          <Typography variant="h6">
                            Billing starts from the 4th month The first 3 months
                            are on us
                        </Typography>
                        </Grid> */}
                      <Grid item>
                        <Button
                          variant="contained"
                          className="login-button"
                          onClick={this.startFreeTrial}
                        >
                          Start Free Trial
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      justifyContent="center"
                      spacing={3}
                      className="text-center mt-3"
                    >
                      <Grid item>
                        <Card className="card">
                          <CardContent className="card-content">
                            <Box
                              fontWeight="fontWeightBold"
                              fontSize="1rem"
                              className="mb-3"
                            >
                              1 month
                            </Box>
                            <Box fontWeight="fontWeightBold" fontSize="1.8rem">
                              $50
                            </Box>
                          </CardContent>
                          <CardActions>
                            {/* <Button
                                size="small"
                                className="action-btn"
                                variant="outlined"
                                onClick={() => {
                                  this.startFreeTrial();
                                }}
                              >
                                SELECT
                            </Button> */}
                          </CardActions>
                        </Card>
                      </Grid>
                      <Grid item>
                        <Card className="card">
                          <CardContent className="card-content">
                            <Box
                              fontWeight="fontWeightBold"
                              fontSize="1rem"
                              className="mb-3"
                            >
                              3 months
                            </Box>
                            <Box fontWeight="fontWeightBold" fontSize="1.8rem">
                              $120
                            </Box>
                            <Box
                              fontWeight="fontWeightBold"
                              fontSize="0.7rem"
                              className="green"
                            >
                              Save $30
                            </Box>
                          </CardContent>
                          <CardActions>
                            {/* <Button
                                size="small"
                                className="action-btn"
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                  this.startFreeTrial();
                                }}
                              >
                                SELECT
                            </Button> */}
                          </CardActions>
                        </Card>
                      </Grid>
                      <Grid item>
                        <Card className="card">
                          <CardContent className="card-content">
                            <Box
                              fontWeight="fontWeightBold"
                              fontSize="1rem"
                              className="mb-3"
                            >
                              6 months
                            </Box>
                            <Box fontWeight="fontWeightBold" fontSize="1.8rem">
                              $180
                            </Box>
                            <Box
                              fontWeight="fontWeightBold"
                              fontSize="0.7rem"
                              className="green"
                            >
                              Save $120
                            </Box>
                            <Box
                              component="span"
                              fontSize="0.7rem"
                              className="popular"
                            >
                              Popular Choice
                            </Box>
                          </CardContent>
                          <CardActions>
                            {/* <Button
                                size="small"
                                className="action-btn"
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                  this.startFreeTrial();
                                }}
                              >
                                SELECT
                            </Button> */}
                          </CardActions>
                        </Card>
                      </Grid>
                    </Grid>
                  </div>
                ) : (
                  <form
                    className="form registrationForm"
                    noValidate
                    onSubmit={this.handleSubmit}
                  >
                    {this.props.User.user && (
                      <Box
                        className="text-center capital"
                        fontSize="1rem"
                        fontWeight="fontWeightBold"
                      >
                        {this.props.User.user.firstName}&nbsp;
                        {this.props.User.user.lastName}
                      </Box>
                    )}
                    <p className="text-center">
                      Your chosen role is&nbsp;
                      <b
                        onClick={() =>
                          this.setState({ showRole: true, imageUrl: login })
                        }
                      >
                        <Typography
                          component="span"
                          color="primary"
                          variant="body2"
                          className="capital cursor-pointer"
                        >
                          {this.state.role}
                        </Typography>
                      </b>
                    </p>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={6} ld={6}>
                        {this.props.User.user &&
                          !(
                            this.props.User.user.firstName ||
                            this.props.User.user.lastName
                          ) && (
                            <>
                              <TextField
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                id="last-name"
                                label="Last Name "
                                name="last-name"
                                autoComplete="off"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <AccountCircleOutlinedIcon />
                                    </InputAdornment>
                                  ),
                                }}
                                value={this.state.formData.lastName.value}
                                onChange={(event) =>
                                  this.handleChange(
                                    "lastName",
                                    event.target.value
                                  )
                                }
                                helperText={
                                  this.state.formData.lastName.validationMessage
                                }
                                error={
                                  this.state.formData.lastName.touched &&
                                  !this.state.formData.lastName.valid
                                }
                              />
                              <TextField
                                variant="filled"
                                margin="normal"
                                required
                                fullWidth
                                id="first-name"
                                label="First Name "
                                name="first-name"
                                autoComplete="off"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <AccountCircleOutlinedIcon />
                                    </InputAdornment>
                                  ),
                                }}
                                value={this.state.formData.firstName.value}
                                onChange={(event) =>
                                  this.handleChange(
                                    "firstName",
                                    event.target.value
                                  )
                                }
                                helperText={
                                  this.state.formData.firstName
                                    .validationMessage
                                }
                                error={
                                  this.state.formData.firstName.touched &&
                                  !this.state.formData.firstName.valid
                                }
                              />
                            </>
                          )}
                        <TextField
                          variant="outlined"
                          margin="normal"
                          className="text-left"
                          required={
                            this.state.formData.country.validation.isRequired
                          }
                          fullWidth
                          id="country"
                          label="Country "
                          name="country"
                          select
                          value={this.state.formData.country.value}
                          onChange={(event) =>
                            this.handleChange("country", event.target.value)
                          }
                          helperText={
                            this.state.formData.country.validationMessage
                          }
                          error={
                            this.state.formData.country.touched &&
                            !this.state.formData.country.valid
                          }
                        >
                          {csc.getAllCountries().map((country) => (
                            <MenuItem key={country.id} value={country.id}>
                              {country.name}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          className="text-left"
                          required={
                            this.state.formData.state.validation.isRequired
                          }
                          fullWidth
                          id="state"
                          label="State/Region/Province"
                          name="state"
                          select
                          value={this.state.formData.state.value}
                          onChange={(event) =>
                            this.handleChange("state", event.target.value)
                          }
                          helperText={
                            this.state.formData.state.validationMessage
                          }
                          error={
                            this.state.formData.state.touched &&
                            !this.state.formData.state.valid
                          }
                          disabled={!this.state.formData.country.value}
                        >
                          {csc
                            .getStatesOfCountry(
                              this.state.formData.country.value
                            )
                            .map((state) => (
                              <MenuItem key={state.id} value={state.id}>
                                {state.name}
                              </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          className="text-left"
                          required={
                            this.state.formData.city.validation.isRequired
                          }
                          fullWidth
                          id="city"
                          label="City "
                          name="city"
                          select={
                            csc.getCitiesOfState(
                              this.state.formData.state.value
                            ).length > 0
                              ? true
                              : false
                          }
                          autoComplete="city"
                          value={this.state.formData.city.value}
                          onChange={(event) =>
                            this.handleChange("city", event.target.value)
                          }
                          helperText={
                            this.state.formData.city.validationMessage
                          }
                          error={
                            this.state.formData.city.touched &&
                            !this.state.formData.city.valid
                          }
                          disabled={!this.state.formData.state.value}
                        >
                          {csc
                            .getCitiesOfState(this.state.formData.state.value)
                            .filter(
                              (city) =>
                                city.id !== "10324" && city.id !== "10403"
                            )
                            .map((city) => (
                              <MenuItem value={city.id} key={city.id}>
                                {city.name}
                              </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          required={
                            this.state.formData.phone.validation.isRequired
                          }
                          id="phone"
                          label={
                            this.state.role === "entrepreneur"
                              ? "Contact Number (Optional)"
                              : "Contact Number"
                          }
                          type="number"
                          name="phone"
                          autoComplete="off"
                          value={this.state.formData.phone.value}
                          InputProps={
                            this.state.formData.country.value
                              ? {
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      {
                                        csc.getCountryById(
                                          this.state.formData.country.value
                                        ).phonecode
                                      }
                                    </InputAdornment>
                                  ),
                                }
                              : null
                          }
                          onChange={(event) =>
                            this.handleChange("phone", event.target.value)
                          }
                          helperText={
                            this.state.formData.phone.validationMessage
                          }
                          error={
                            this.state.formData.phone.touched &&
                            !this.state.formData.phone.valid
                          }
                        />
                        {this.state.role !== "investor" ? (
                          <TextField
                            variant="outlined"
                            margin="normal"
                            required={
                              this.state.formData.education.validation
                                .isRequired
                            }
                            fullWidth
                            select
                            id="education"
                            label="Education "
                            name="education"
                            autoComplete="education"
                            value={this.state.formData.education.value}
                            onChange={(event) =>
                              this.handleChange("education", event.target.value)
                            }
                            helperText={
                              this.state.formData.education.validationMessage
                            }
                            error={
                              this.state.formData.education.touched &&
                              !this.state.formData.education.valid
                            }
                          >
                            <MenuItem key="1" value="No Formal Education">
                              No Formal Education
                            </MenuItem>
                            <MenuItem key="2" value="Primary">
                              Primary
                            </MenuItem>
                            <MenuItem key="3" value="Secondary or High School">
                              Secondary or High School
                            </MenuItem>
                            <MenuItem key="4" value="Vocational or Diploma">
                              Vocational or Diploma
                            </MenuItem>
                            <MenuItem
                              key="5"
                              value="Bachelors or Undergraduate"
                            >
                              Bachelors or Undergraduate
                            </MenuItem>
                            <MenuItem key="6" value="Masters Degree">
                              Masters Degree
                            </MenuItem>
                            <MenuItem key="7" value="Doctorate or higher">
                              Doctorate or higher
                            </MenuItem>
                          </TextField>
                        ) : null}
                        {this.state.role === "entrepreneur" ? (
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required={
                              this.state.formData.income.validation.isRequired
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  USD
                                </InputAdornment>
                              ),
                            }}
                            select
                            id="income"
                            label="Income"
                            name="income"
                            value={this.state.formData.income.value}
                            onChange={(event) =>
                              this.handleChange("income", event.target.value)
                            }
                            helperText={
                              this.state.formData.income.validationMessage
                            }
                            error={
                              this.state.formData.income.touched &&
                              !this.state.formData.income.valid
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
                            <MenuItem key="7" value="None">
                              prefer not to say
                            </MenuItem>
                          </TextField>
                        ) : null}
                        {this.state.role !== "entrepreneur" ? (
                          <div>
                            <FormControl
                              style={{ width: "100%" }}
                              variant="outlined"
                              className="multi-select"
                            >
                              <InputLabel id="demo-mutiple-checkbox-label">
                                Industry Of Interests
                              </InputLabel>
                              <Select
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox"
                                multiple
                                fullWidth
                                value={this.state.interests}
                                onChange={this.changeInterest}
                                input={<Input />}
                                renderValue={(selected) => selected.join(", ")}
                                MenuProps={this.state.menuProps}
                              >
                                {industryOfInterestsDataArray &&
                                  industryOfInterestsDataArray.length > 0 &&
                                  industryOfInterestsDataArray.map((name) => (
                                    <MenuItem key={name} value={name}>
                                      <Checkbox
                                        color="primary"
                                        checked={
                                          this.state.interests.indexOf(name) >
                                          -1
                                        }
                                      />
                                      <ListItemText primary={name} />
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                            {this.state.interests.indexOf("Other") > -1 && (
                              <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required={
                                  this.state.formData.otherInterest.validation
                                    .isRequired
                                }
                                id="other-interest"
                                label="Other Interests"
                                name="other-interest"
                                value={
                                  this.state.formData.otherInterest.value || ""
                                }
                                onChange={(event) =>
                                  this.handleChange(
                                    "otherInterest",
                                    event.target.value
                                  )
                                }
                                helperText={
                                  this.state.formData.otherInterest
                                    .validationMessage
                                }
                                error={
                                  this.state.formData.otherInterest.touched &&
                                  !this.state.formData.otherInterest.valid
                                }
                              />
                            )}
                          </div>
                        ) : null}

                        {this.state.role === "expert" ? (
                          <div>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              select
                              required={
                                this.state.formData.employmentStatus.validation
                                  .isRequired
                              }
                              id="employment-status"
                              label="Current Employment Status"
                              name="employment-status"
                              value={
                                this.state.formData.employmentStatus.value || ""
                              }
                              onChange={(event) =>
                                this.handleChange(
                                  "employmentStatus",
                                  event.target.value
                                )
                              }
                              helperText={
                                this.state.formData.employmentStatus
                                  .validationMessage
                              }
                              error={
                                this.state.formData.employmentStatus.touched &&
                                !this.state.formData.employmentStatus.valid
                              }
                            >
                              <MenuItem key="1" value="Self Employed">
                                Self Employed
                              </MenuItem>
                              <MenuItem key="2" value="Retired">
                                Retired
                              </MenuItem>
                              <MenuItem key="3" value="Student">
                                Student
                              </MenuItem>
                              <MenuItem key="4" value="Working full time">
                                Working full time
                              </MenuItem>
                              <MenuItem key="5" value="Working part time">
                                Working part time
                              </MenuItem>
                            </TextField>
                            {this.state.formData.employmentStatus.value ===
                            "Self Employed" ? (
                              <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required={
                                  this.state.formData.companyName.validation
                                    .isRequired
                                }
                                id="compan-name"
                                label="Company Name"
                                name="company-name"
                                value={
                                  this.state.formData.companyName.value || ""
                                }
                                onChange={(event) =>
                                  this.handleChange(
                                    "companyName",
                                    event.target.value
                                  )
                                }
                                helperText={
                                  this.state.formData.employmentStatus
                                    .validationMessage
                                }
                                error={
                                  this.state.formData.employmentStatus
                                    .touched &&
                                  !this.state.formData.employmentStatus.valid
                                }
                              />
                            ) : null}
                            <TextField
                              variant="outlined"
                              margin="normal"
                              type="number"
                              fullWidth
                              required={
                                this.state.formData.experience.validation
                                  .isRequired
                              }
                              autoComplete="false"
                              id="experience"
                              label="Past Experience"
                              name="experience"
                              value={this.state.formData.experience.value || ""}
                              onKeyPress={this.numberOnlyValidation}
                              onChange={(event) => {
                                this.handleChange(
                                  "experience",
                                  event.target.value
                                );
                              }}
                              helperText={
                                this.state.formData.experience.validationMessage
                              }
                              error={
                                this.state.formData.experience.touched &&
                                !this.state.formData.experience.valid
                              }
                            />
                          </div>
                        ) : null}
                        <div>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required={
                              this.state.formData.about.validation.isRequired
                            }
                            multiline
                            id="about"
                            label="About Me"
                            name="about"
                            value={this.state.formData.about.value || ""}
                            onChange={(event) =>
                              this.handleChange("about", event.target.value)
                            }
                            helperText={
                              this.state.formData.about.validationMessage
                            }
                            error={
                              this.state.formData.about.touched &&
                              !this.state.formData.about.valid
                            }
                          />
                        </div>
                        {this.state.role === "expert" && (
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required={
                              this.state.formData.linkedInProfileUrl.validation
                                .isRequired
                            }
                            id="linkedInProfileUrl"
                            label="Linkedin profile url (Optional)"
                            name="linkedInProfileUrl"
                            value={
                              this.state.formData.linkedInProfileUrl.value || ""
                            }
                            onChange={(event) =>
                              this.handleChange(
                                "linkedInProfileUrl",
                                event.target.value
                              )
                            }
                            helperText={
                              this.state.formData.linkedInProfileUrl
                                .validationMessage
                            }
                            error={
                              this.state.formData.linkedInProfileUrl.touched &&
                              !this.state.formData.linkedInProfileUrl.valid
                            }
                          />
                        )}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        ld={6}
                        className="text-center"
                      >
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="icon-button-file"
                          type="file"
                          onChange={(event) =>
                            this.changeFile(event.target.files[0])
                          }
                        />
                        <label htmlFor="icon-button-file">
                          <Card className="image-card">
                            {this.state.photoUrl ? (
                              <div style={{ position: "relative" }}>
                                <CancelIcon
                                  onClick={this.removeImage}
                                  color="secondary"
                                  style={{ position: "absolute", right: 0 }}
                                />
                                <img
                                  src={this.state.photoUrl}
                                  alt="user"
                                  width="200"
                                  height="170"
                                />
                              </div>
                            ) : (
                              <div style={{ marginTop: "25%" }}>
                                <IconButton
                                  component="p"
                                  style={{
                                    background: "#424242",
                                    color: "#fff",
                                  }}
                                >
                                  <AddIcon />
                                </IconButton>
                                <p> Upload your photo</p>
                              </div>
                            )}
                          </Card>
                        </label>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControlLabel
                          style={{ marginBottom: 0, marginRight: "5px" }}
                          control={
                            <Checkbox
                              onChange={(event) =>
                                this.setState({
                                  termsAndCondition: event.target.checked,
                                })
                              }
                              value={this.state.termsAndCondition}
                              color="primary"
                            />
                          }
                          label="I have read and accept"
                        />
                        <Link
                          href="/term-condition"
                          to="/term-condition"
                          variant="body2"
                          target="_blank"
                          style={{ fontSize: "1rem" }}
                        >
                          terms and conditions
                        </Link>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          className="login-button"
                          type="submit"
                          size="large"
                          variant="contained"
                          color="primary"
                          disabled={
                            !(
                              this.state.isFormValid &&
                              this.state.termsAndCondition
                            )
                          }
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </div>
            )}
          </div>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={this.state.snackbar.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={
            <div>
              <b>{this.state.snackbar.title}</b> <br />
              {this.state.snackbar.message}
            </div>
          }
          classes={{ root: `snackbar-${this.state.snackbar.level}` }}
        />
        <Backdrop
          open={this.state.showBackdrop}
          style={{ zIndex: 99999, color: "#fff" }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateUserDetails,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Role));
