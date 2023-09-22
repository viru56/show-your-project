import React from "react";
import { TextField, MenuItem } from "@material-ui/core";
const FormFields = ({ id, formData, change }) => {
  const renderTemplate = () => {
    let formTemplate = null;
    switch (formData.element) {
      case "input":
        formTemplate = (
          <TextField
            variant={formData[id].variant || "outlined"}
            margin={formData[id].margin || "normal"}
            type={formData[id].type || "text"}
            multiline={formData[id].multiline || false}
            fullWidth={formData[id].fullWidth || true}
            autoFocus={formData[id].autoFocus || false}
            required={formData[id].validation.isRequired}
            disabled={formData[id].disabled || false}
            placeholder={formData[id].placeholder || ""}
            id={[id]}
            label={formData[id].label || ""}
            name={[id]}
            value={formData[id].value}
            onChange={event => change({ id, value: event.target.value })}
            helperText={formData[id].validationMessage}
            error={formData[id].touched && !formData[id].valid}
          />
        );
        break;
      case "textArea":
        formTemplate = (
          <TextField
            variant={formData[id].variant || "outlined"}
            margin={formData[id].margin || "normal"}
            type={formData[id].type || "text"}
            multiline={true}
            rows={formData[id].rows || 4}
            fullWidth={formData[id].fullWidth || true}
            autoFocus={formData[id].autoFocus || false}
            required={formData[id].validation.isRequired}
            disabled={formData[id].disabled || false}
            id={[id]}
            label={formData[id].label}
            name={[id]}
            value={formData[id].value}
            onChange={event => change({ id, value: event.target.value })}
            helperText={formData[id].validationMessage}
            error={formData[id].touched && !formData[id].valid}
          />
        );
        break;
      case "select":
        formTemplate = (
          <TextField
            variant={formData[id].variant || "outlined"}
            margin={formData[id].margin || "normal"}
            select={true}
            fullWidth={formData[id].fullWidth || true}
            autoFocus={formData[id].autoFocus || false}
            required={formData[id].validation.isRequired}
            disabled={formData[id].disabled || false}
            id={[id]}
            label={formData[id].label}
            name={[id]}
            value={formData[id].value}
            onChange={event => change({ id, value: event.target.value })}
            helperText={formData[id].validationMessage}
            error={formData[id].touched && !formData[id].valid}
          >
            {formData[id].options.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {item.text}
              </MenuItem>
            ))}
          </TextField>
        );
        break;
      default:
        formTemplate = null;
    }
    return formTemplate;
  };
  return <div>{renderTemplate()}</div>;
};

export default FormFields;
