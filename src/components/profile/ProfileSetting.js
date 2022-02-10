import React, { PureComponent } from "react";
import {
  Typography,
  Grid,
  Button,
  Divider,
  TextField,
  MenuItem,
  InputAdornment,
  Card,
  IconButton,
  ListItemText,
  Select,
  Input,
  Checkbox,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { updateUserDetails } from "../../store/actions/user_action";
import csc from "country-state-city";
import validate from "../../libs/forms/validate";
import { industryOfInterestsDataArray } from "../../constants/mockResponse";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { findConnections } from "../../store/actions/connection_action";

/* update your profile details */
class ProfileSettings extends PureComponent {
  state = {
    photoUrl: this.props.User.user.photoUrl,
    editForm: false,
    isFormValid: true,
    file: null,
    interests: this.props.User.user.interests || [],
    formData: {
      email: {
        value: this.props.User.user.email || "",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      role: {
        value: this.props.User.user.role
          ? this.props.User.user.role[0].toUpperCase() +
            this.props.User.user.role.slice(1)
          : "",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      firstName: {
        value: this.props.User.user.firstName || "",
        validation: {
          isRequired: true,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      lastName: {
        value: this.props.User.user.lastName || "",
        validation: {
          isRequired: true,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      country: {
        value: this.props.User.user.country || "",
        validation: {
          isRequired: true,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      state: {
        value: this.props.User.user.state || "",
        validation: {
          isRequired: true,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      city: {
        value: this.props.User.user.city || "",
        validation: {
          isRequired: true,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      education: {
        value: this.props.User.user.education || "",
        validation: {
          isRequired: true,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      income: {
        value: this.props.User.user.income || "",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      phone: {
        value: this.props.User.user.phone || "",
        validation: {
          isRequired: true,
          isPhone: true,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      about: {
        value: this.props.User.user.about || "",
        validation: {
          isRequired: false,
          // minLength: 100,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      linkedInProfileUrl: {
        value: this.props.User.user.linkedInProfileUrl || "",
        validation: {
          isRequired: false,
          isUrl: true,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      otherInterest: {
        value: this.props.User.user.otherInterest || "",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      employmentStatus: {
        value: this.props.User.user.employmentStatus || "",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
      experience: {
        value: this.props.User.user.experience || "",
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
        value: this.props.User.user.companyName || "",
        validation: {
          isRequired: false,
        },
        valid: true,
        touched: false,
        validationMessage: "",
      },
    },
  };
  async componentDidMount() {
    const formData = { ...this.state.formData };
    if (this.props.User.user.role === "entrepreneur") {
      delete formData.companyName;
      delete formData.experience;
      delete formData.employmentStatus;
      delete formData.otherInterest;
    } else if (this.props.User.user.role === "investor") {
      delete formData.companyName;
      delete formData.experience;
      delete formData.employmentStatus;
      delete formData.income;
      delete formData.education;
    } else if (this.props.User.user.role === "expert") {
      delete formData.income;
    } else {
      delete formData.companyName;
      delete formData.experience;
      delete formData.employmentStatus;
      delete formData.otherInterest;
      delete formData.income;
      delete formData.education;
    }
    await this.setState({ formData });
    if (this.props.Connection.connections.length === 0) {
      await this.props.findConnections(this.props.User.user.email);
    }
  }
  handleChange = (key, value) => {
    const formData = { ...this.state.formData };
    formData[key].value = value;
    formData[key].touched = true;
    const validData = validate(key, formData);
    formData[key].valid = validData[0];
    let isFormValid = validData[0];
    formData[key].validationMessage = validData[1];
    if (
      !formData.firstName.valid ||
      !formData.lastName.valid ||
      !formData.country.valid ||
      !formData.state.valid ||
      !formData.city.valid
    ) {
      isFormValid = false;
    }
    if (
      this.props.User.user.role === "entrepreneur" ||
      this.props.User.user.role === "expert"
    ) {
      if (!formData.education.valid) isFormValid = false;
    } else if (
      this.props.User.user.role === "investor" ||
      this.props.User.user.role === "expert"
    ) {
      if (!formData.phone.valid) isFormValid = false;
    }
    if (key === "country") {
      formData.state.value = "";
      formData.state.valid = false;
      formData.city.value = "";
      formData.city.valid = false;
      isFormValid = false;
    }
    if (key === "state") {
      formData.city.value = "";
      formData.city.valid = false;
      isFormValid = false;
    }
    this.setState({ formData, isFormValid });
  };
  handleSubmit = async (event) => {
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
    this.props.showHideBackdrop(true);
    const data = { ...this.props.User.user };
    for (let key in this.state.formData) {
      if (this.state.formData[key].value) {
        data[key] = this.state.formData[key].value;
      }
    }
    data.interests = this.state.interests;
    data.file = this.state.file;
    data.role = this.props.User.user.role;
    data.connections = this.props.Connection.connections.map((c) => c.email);
    await this.props.updateUserDetails(data);
    if (this.props.error) {
      console.log(this.props.error);
    }
    this.props.showHideBackdrop(false);
    await this.setState({
      editForm: false,
    });
    this.props.showSnackbar();
    if (this.state.file) {
      setTimeout(() => window.location.reload(), 3000);
    }
  };
  resetForm = () => {
    const formData = { ...this.state.formData };
    formData.firstName.value = this.props.User.user.firstName;
    formData.firstName.valid = true;
    formData.lastName.value = this.props.User.user.lastName;
    formData.lastName.valid = true;
    formData.country.value = this.props.User.user.country;
    formData.country.valid = true;
    formData.state.value = this.props.User.user.state;
    formData.state.valid = true;
    formData.city.value = this.props.User.user.city;
    formData.city.valid = true;
    formData.phone.value = this.props.User.user.phone;
    formData.phone.valid = true;
    formData.about.value = this.props.User.user.about;
    formData.about.valid = true;
    if (formData.education) {
      formData.education.value = this.props.User.user.education;
      formData.education.valid = true;
    }
    if (formData.income) {
      formData.income.value = this.props.User.user.income;
      formData.income.valid = true;
    }
    if (formData.companyName) {
      formData.companyName.value = this.props.User.user.companyName;
      formData.companyName.valid = true;
    }
    if (formData.experience) {
      formData.experience.value = this.props.User.user.experience;
      formData.experience.valid = true;
    }
    if (formData.employmentStatus) {
      formData.employmentStatus.value = this.props.User.user.employmentStatus;
      formData.employmentStatus.valid = true;
    }
    if (formData.otherInterest) {
      formData.otherInterest.value = this.props.User.user.otherInterest;
      formData.otherInterest.valid = true;
    }
    this.setState({
      formData,
      editForm: false,
      interests: this.props.User.user.interests || [],
      photoUrl: this.props.User.user.photoUrl,
    });
  };
  changeFile = (file) => {
    if (file) {
      this.setState({ photoUrl: URL.createObjectURL(file), file });
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
  render() {
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={this.props.name !== "profile"}
        id="profile"
        aria-labelledby="profile"
        className="profile-tab"
      >
        <form
          noValidate
          autoComplete="off"
          className="profile-form"
          onSubmit={this.handleSubmit}
        >
          <Grid container justifyContent="flex-end" alignItems="center">
            <Grid item className="p-3">
              {!this.state.editForm && (
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() => this.setState({ editForm: true })}
                >
                  Edit
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="icon-button-file"
                type="file"
                disabled={!this.state.editForm}
                onChange={(event) => this.changeFile(event.target.files[0])}
              />
              <label htmlFor="icon-button-file">
                <Card className="image-card">
                  {this.state.photoUrl ? (
                    <div style={{ position: "relative" }}>
                      {this.state.editForm && (
                        <EditIcon
                          onClick={this.removeImage}
                          color="secondary"
                          style={{ position: "absolute", right: 0 }}
                        />
                      )}
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
                        style={{ background: "#424242", color: "#fff" }}
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
          <Divider className="divider" />
          <Grid container>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <label>Email</label>
            </Grid>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <TextField
                variant="standard"
                fullWidth
                id="email"
                name="email"
                required={this.state.formData.email.validation.isRequired}
                value={this.state.formData.email.value}
                disabled={true}
              />
            </Grid>
          </Grid>
          <Divider className="divider" />
          <Grid container>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <label>Role</label>
            </Grid>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <TextField
                variant="standard"
                fullWidth
                id="role"
                name="role"
                required={this.state.formData.role.validation.isRequired}
                value={this.state.formData.role.value}
                disabled={true}
              />
            </Grid>
          </Grid>
          <Divider className="divider" />
          <Grid container>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <label> First name</label>
            </Grid>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <TextField
                variant={this.state.editForm ? "outlined" : "standard"}
                required={this.state.formData.firstName.validation.isRequired}
                fullWidth
                id="first-name"
                name="first-name"
                value={this.state.formData.firstName.value}
                disabled={!this.state.editForm}
                onChange={(event) =>
                  this.handleChange("firstName", event.target.value)
                }
                helperText={this.state.formData.firstName.validationMessage}
                error={
                  this.state.formData.firstName.touched &&
                  !this.state.formData.firstName.valid
                }
              />
            </Grid>
          </Grid>
          <Divider className="divider" />
          <Grid container>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <label> Last name</label>
            </Grid>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <TextField
                variant={this.state.editForm ? "outlined" : "standard"}
                required={this.state.formData.lastName.validation.isRequired}
                fullWidth
                id="last-name"
                name="last-name"
                value={this.state.formData.lastName.value}
                disabled={!this.state.editForm}
                onChange={(event) =>
                  this.handleChange("lastName", event.target.value)
                }
                helperText={this.state.formData.lastName.validationMessage}
                error={
                  this.state.formData.lastName.touched &&
                  !this.state.formData.lastName.valid
                }
              />
            </Grid>
          </Grid>
          <Divider className="divider" />
          <Grid container>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <label> Country</label>
            </Grid>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <TextField
                variant={this.state.editForm ? "outlined" : "standard"}
                required={this.state.formData.country.validation.isRequired}
                fullWidth
                id="country"
                name="country"
                select
                value={this.state.formData.country.value}
                onChange={(event) =>
                  this.handleChange("country", event.target.value)
                }
                disabled={!this.state.editForm}
                helperText={this.state.formData.country.validationMessage}
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
            </Grid>
          </Grid>
          <Divider className="divider" />
          <Grid container>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <label> State</label>
            </Grid>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <TextField
                variant={this.state.editForm ? "outlined" : "standard"}
                required={this.state.formData.state.validation.isRequired}
                fullWidth
                id="state"
                name="state"
                select
                value={this.state.formData.state.value}
                onChange={(event) =>
                  this.handleChange("state", event.target.value)
                }
                helperText={this.state.formData.state.validationMessage}
                error={
                  this.state.formData.state.touched &&
                  !this.state.formData.state.valid
                }
                disabled={
                  !this.state.formData.country.value || !this.state.editForm
                }
              >
                {csc
                  .getStatesOfCountry(this.state.formData.country.value)
                  .map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
          </Grid>
          <Divider className="divider" />
          <Grid container>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <label> City</label>
            </Grid>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              {!this.state.editForm && isNaN(this.state.formData.city.value) ? (
                <TextField value={this.state.formData.city.value} disabled />
              ) : (
                <TextField
                  variant={this.state.editForm ? "outlined" : "standard"}
                  required={this.state.formData.city.validation.isRequired}
                  fullWidth
                  id="city"
                  name="city"
                  select={
                    csc.getCitiesOfState(
                      this.state.formData.state.value
                    ).length > 0
                      ? true
                      : false
                  }
                  value={this.state.formData.city.value}
                  onChange={(event) =>
                    this.handleChange("city", event.target.value)
                  }
                  helperText={this.state.formData.city.validationMessage}
                  error={
                    this.state.formData.city.touched &&
                    !this.state.formData.city.valid
                  }
                  disabled={
                    !this.state.formData.state.value || !this.state.editForm
                  }
                >
                  {csc
                    .getCitiesOfState(this.state.formData.state.value)
                    .filter(
                      (city) => city.id !== "10324" && city.id !== "10403"
                    )
                    .map((city) => (
                      <MenuItem value={city.id} key={city.id}>
                        {city.name}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            </Grid>
          </Grid>
          <Divider className="divider" />
          <Grid container>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <label>Contact number</label>
            </Grid>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <TextField
                variant={this.state.editForm ? "outlined" : "standard"}
                fullWidth
                required={this.state.formData.phone.validation.isRequired}
                id="phone"
                name="phone"
                value={this.state.formData.phone.value}
                disabled={!this.state.editForm}
                InputProps={
                  !isNaN(this.state.formData.country.value)
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
                helperText={this.state.formData.phone.validationMessage}
                error={
                  this.state.formData.phone.touched &&
                  !this.state.formData.phone.valid
                }
              />
            </Grid>
          </Grid>
          {(this.props.User.user.role === "expert" ||
            this.props.User.user.role === "entrepreneur") && (
            <div>
              <Divider className="divider" />
              <Grid container>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <label>Education</label>
                </Grid>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <TextField
                    variant={this.state.editForm ? "outlined" : "standard"}
                    disabled={!this.state.editForm}
                    required={this.state.formData.education.isRequired}
                    fullWidth
                    select
                    id="education"
                    name="education"
                    value={this.state.formData.education.value}
                    onChange={(event) =>
                      this.handleChange("education", event.target.value)
                    }
                    helperText={this.state.formData.education.validationMessage}
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
                    <MenuItem key="5" value="Bachelors or Undergraduate">
                      Bachelors or Undergraduate
                    </MenuItem>
                    <MenuItem key="6" value="Masters Degree">
                      Masters Degree
                    </MenuItem>
                    <MenuItem key="7" value="Doctorate or higher">
                      Doctorate or higher
                    </MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </div>
          )}
          {this.props.User.user.role === "entrepreneur" && (
            <div>
              <Divider className="divider" />
              <Grid container>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <label>Income</label>
                </Grid>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <TextField
                    variant={this.state.editForm ? "outlined" : "standard"}
                    disabled={!this.state.editForm}
                    fullWidth
                    select
                    id="income"
                    name="income"
                    value={this.state.formData.income.value}
                    onChange={(event) =>
                      this.handleChange("income", event.target.value)
                    }
                    helperText={this.state.formData.income.validationMessage}
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
                </Grid>
              </Grid>
            </div>
          )}
          {(this.props.User.user.role === "investor" ||
            this.props.User.user.role === "expert") && (
            <div>
              <Divider className="divider" />
              <Grid container>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <label> Industry Of Interests</label>
                </Grid>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <Select
                    className={this.state.editForm ? "multi-select" : ""}
                    disabled={!this.state.editForm}
                    labelId="mutiple-checkbox-label"
                    id="mutiple-checkbox"
                    multiple
                    fullWidth
                    value={this.state.interests}
                    onChange={(event) =>
                      this.setState({ interests: event.target.value })
                    }
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
                </Grid>
              </Grid>
              {this.state.interests.indexOf("Other") > -1 && (
                <div>
                  <Divider className="divider" />
                  <Grid container>
                    <Grid item xs={12} sm={12} md={6} ld={6}>
                      <label>Other Interest</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} ld={6}>
                      <TextField
                        variant={this.state.editForm ? "outlined" : "standard"}
                        disabled={!this.state.editForm}
                        fullWidth
                        required={
                          this.state.formData.otherInterest.validation
                            .isRequired
                        }
                        id="other-interest"
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
                </div>
              )}
            </div>
          )}
          {this.props.User.user.role === "expert" && (
            <div>
              <Divider className="divider" />
              <Grid container>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <label>Current Employment Status</label>
                </Grid>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <TextField
                    variant={this.state.editForm ? "outlined" : "standard"}
                    disabled={!this.state.editForm}
                    required={this.state.formData.employmentStatus.isRequired}
                    fullWidth
                    select
                    id="employment-status"
                    name="employment-status"
                    value={this.state.formData.employmentStatus.value}
                    onChange={(event) =>
                      this.handleChange("employmentStatus", event.target.value)
                    }
                    helperText={
                      this.state.formData.employmentStatus.validationMessage
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
                </Grid>
              </Grid>
              {this.state.formData.employmentStatus.value ===
                "Self Employed" && (
                <div>
                  <Divider className="divider" />
                  <Grid container>
                    <Grid item xs={12} sm={12} md={6} ld={6}>
                      <label>Company Name</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} ld={6}>
                      <TextField
                        variant={this.state.editForm ? "outlined" : "standard"}
                        disabled={!this.state.editForm}
                        fullWidth
                        required={
                          this.state.formData.companyName.validation.isRequired
                        }
                        id="company-name"
                        name="company-name"
                        value={this.state.formData.companyName.value}
                        onChange={(event) =>
                          this.handleChange("companyName", event.target.value)
                        }
                        helperText={
                          this.state.formData.companyName.validationMessage
                        }
                        error={
                          this.state.formData.companyName.touched &&
                          !this.state.formData.companyName.valid
                        }
                      />
                    </Grid>
                  </Grid>
                </div>
              )}

              <Divider className="divider" />
              <Grid container>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <label>Linkedin Profile Url</label>
                </Grid>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <TextField
                    variant={this.state.editForm ? "outlined" : "standard"}
                    disabled={!this.state.editForm}
                    fullWidth
                    required={
                      this.state.formData.linkedInProfileUrl.validation
                        .isRequired
                    }
                    id="linkedInProfileUrl"
                    name="linkedInProfileUrl"
                    value={this.state.formData.linkedInProfileUrl.value}
                    onChange={(event) =>
                      this.handleChange(
                        "linkedInProfileUrl",
                        event.target.value
                      )
                    }
                    helperText={
                      this.state.formData.linkedInProfileUrl.validationMessage
                    }
                    error={
                      this.state.formData.linkedInProfileUrl.touched &&
                      !this.state.formData.linkedInProfileUrl.valid
                    }
                  />
                </Grid>
              </Grid>
              <Divider className="divider" />
              <Grid container>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <label>Past Experience</label>
                </Grid>
                <Grid item xs={12} sm={12} md={6} ld={6}>
                  <TextField
                    variant={this.state.editForm ? "outlined" : "standard"}
                    disabled={!this.state.editForm}
                    fullWidth
                    required={
                      this.state.formData.experience.validation.isRequired
                    }
                    id="experience"
                    name="experience"
                    onKeyPress={this.numberOnlyValidation}
                    value={this.state.formData.experience.value}
                    onChange={(event) =>
                      this.handleChange("experience", event.target.value)
                    }
                    helperText={
                      this.state.formData.experience.validationMessage
                    }
                    error={
                      this.state.formData.experience.touched &&
                      !this.state.formData.experience.valid
                    }
                  />
                </Grid>
              </Grid>
            </div>
          )}
          <Divider className="divider" />
          <Grid container>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <label>About me </label>
            </Grid>
            <Grid item xs={12} sm={12} md={6} ld={6}>
              <TextField
                variant={this.state.editForm ? "outlined" : "standard"}
                required={this.state.formData.about.validation.isRequired}
                fullWidth
                id="about"
                name="about"
                multiline
                value={this.state.formData.about.value}
                disabled={!this.state.editForm}
                onChange={(event) =>
                  this.handleChange("about", event.target.value)
                }
                helperText={this.state.formData.about.validationMessage}
                error={
                  this.state.formData.about.touched &&
                  !this.state.formData.about.valid
                }
              />
            </Grid>
          </Grid>
          {this.state.editForm && (
            <div>
              <Divider className="divider" />
              <Grid container justifyContent="flex-end" spacing={3} className="p-3">
                <Grid item>
                  <Button onClick={this.resetForm}>Cancel</Button>
                </Grid>
                <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={!this.state.isFormValid}
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}
        </form>
      </Typography>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
    Connection: state.Connection,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateUserDetails,
      findConnections,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
