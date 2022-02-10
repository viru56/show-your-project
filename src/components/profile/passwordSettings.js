import React, { useState } from "react";
import { Typography, Grid, TextField, Button } from "@material-ui/core";
import validate from "../../libs/forms/validate";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { updatePassword, signIn } from "../../store/actions/user_action";
import { bindActionCreators } from "redux";

/* change your password */
function PasswordSettings(props) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: {
      value: "",
      validation: {
        isRequired: true,
        minLength: 6,
        maxLength: 24,
      },
      valid: false,
      touched: false,
      validationMessage: "",
    },

    password: {
      value: "",
      validation: {
        isRequired: true,
        isPassword: true,
      },
      valid: false,
      touched: false,
      validationMessage: "",
    },
    confirmPassword: {
      value: "",
      validation: {
        confirmPass: "password",
      },
      valid: false,
      touched: false,
      validationMessage: "",
    },
  });
  const handleChange = (key, value) => {
    const newFormData = { ...formData };
    newFormData[key].value = value;
    newFormData[key].touched = true;
    const validData = validate(key, newFormData);
    newFormData[key].valid = validData[0];
    newFormData[key].validationMessage = validData[1];
    setFormData(newFormData);
    if (formData.password.valid && formData.confirmPassword.valid) {
      setIsFormValid(true);
    }
  };
  const changepassword = () => {
    var tmp = "";
    try {
      props.signIn({
        email: props.User.user.email,
        password: formData.currentPassword.value,
      });
    } catch (error) {
      console.log(error);
      tmp = error.message;
    }
    if (tmp === "") {
      props.showHideBackdrop(true);
      props.updatePassword(formData.password.value).then((res) => {
        props.showHideBackdrop(false);
        const newFormData = { ...formData };
        newFormData.password.value = "";
        newFormData.password.valid = false;
        newFormData.password.touched = false;
        newFormData.confirmPassword.value = "";
        newFormData.confirmPassword.valid = false;
        newFormData.confirmPassword.touched = false;
        setFormData(newFormData);
        setIsFormValid(false);
        if (res.payload.error) {
          props.showSnackbar(
            res.payload.error.title,
            res.payload.error.message,
            "error"
          );
        } else {
          props.showSnackbar("Update password", "your password is changed");
        }
      });
    }
  };
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={props.name !== "password"}
      id="password"
      aria-labelledby="password"
      className="password-tab"
    >
      <Grid container className="p-3">
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            required={true}
            fullWidth
            name="current-password"
            label="Current Password"
            type="password"
            id="current-password"
            value={formData.currentPassword.value}
            onChange={(event) =>
              handleChange("currentPassword", event.target.value)
            }
            helperText={formData.currentPassword.validationMessage}
            error={
              formData.currentPassword.touched &&
              !formData.currentPassword.valid
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            required={true}
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="new-password"
            autoComplete="new-password"
            value={formData.password.value}
            onChange={(event) => handleChange("password", event.target.value)}
            helperText={formData.password.validationMessage}
            error={formData.password.touched && !formData.password.valid}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm-password"
            label="Confirm Password "
            type="password"
            id="confirm-password"
            value={formData.confirmPassword.value}
            onChange={(event) =>
              handleChange("confirmPassword", event.target.value)
            }
            helperText={formData.confirmPassword.validationMessage}
            error={
              formData.confirmPassword.touched &&
              !formData.confirmPassword.valid
            }
          />
        </Grid>
        <Grid item xs={12} className="text-right">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={changepassword}
            disabled={!isFormValid}
          >
            Change Password
          </Button>
        </Grid>
      </Grid>
    </Typography>
  );
}

const mapStateToProps = (state) => {
  return {
    User: state.User,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updatePassword,
      signIn,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PasswordSettings));
