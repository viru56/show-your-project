// eslint-disable-next-line
const EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGX = /^(\+|\d)[0-9]{7,11}$/;
const URL_REGX = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
const CHAR_REGX = /.*[a-zA-Z].*/;
// eslint-disable-next-line
const PASSWORD_REGX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{7,24}$/
const Validate = (id, formData) => {
  let valid = true;
  let message = "";
  const validation = formData[id].validation;
  const value = formData[id].value;
  for (let rule in validation) {
    switch (rule) {
      case "isRequired":
        if (valid && validation[rule]) {
          valid = value && value.trim() !== "";
          message = !valid ? "This field is required" : "";
        }
        break;
      case "isEmail":
        if (valid) {
          valid = EMAIL_REGX.test(String(value).toLowerCase());
          message = !valid ? "Email ID is not valid" : "";
        }
        break;
      case "isUrl":
        if (valid) {
          valid = URL_REGX.test(String(value).toLowerCase());
          message = !valid ? "URL is not valid" : "";
        }
        break;
      case "isPhone":
        if (valid) {
          valid = PHONE_REGX.test(value);
          message = !valid ? "Phone is not valid" : "";
        }
        break;
      case "isName":
        if (valid) {
          valid = CHAR_REGX.test(value);
          message = !valid ? id+" not valid" : "";
        }
        break;
      case "minLength":
        if (valid) {
          valid = value.trim().length >= validation[rule];
          message = !valid
            ? `Should be greater than ${validation[rule]} characters`
            : "";
        }
        break;
      case "isMin":
        if (valid) {
          valid = value >= validation[rule];
          message = !valid ? `Should be equal or greater than ${validation[rule]} ` : "";
        }
        break;
        case "isMax":
        if (valid) {
          valid = value < validation[rule];
          message = !valid ? `Should be less than ${validation[rule]} ` : "";
        }
        break;
      case "maxLength":
        if (valid) {
          valid = value.trim().length <= validation[rule];
          message = !valid
            ? `Should be less than ${validation[rule]} characters`
            : "";
        }
        break;
      case "confirmPass":
        if (valid) {
          valid = value === formData[validation.confirmPass].value;
          message = !valid ? "Password did not match" : "";
        }
        break;
      case "isPassword":
        if(valid){
          valid = true === PASSWORD_REGX.test(value);
          message = !valid ? "Password must contain at least 7 characters, at least one number and at least one uppercase letter" : "";
        }
        break;
      default:
        valid = true;
        message = "";
    }
  }
  return [valid, message];
};

export default Validate;
