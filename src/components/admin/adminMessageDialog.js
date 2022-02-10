import React, { PureComponent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  TextField
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
/* ask for the admin comments before approve/reject profile */
export default class AdminMessageDialog extends PureComponent {
  state = {
    remarks: ""
  };
  handleClose = () => {
    this.props.onClose();
  };
  handleSubmit = () => {
    this.props.onClose(this.state.remarks);
  };

  render() {
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="dialog-title"
        open={this.props.open}
        className="team-dialog"
        fullWidth={true}
      >
        <DialogTitle id="dialog-title" className="dialog-title">
          Remarks
          <IconButton
            aria-label="close"
            className="dialogCloseButton"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Grid container className="mb-3">
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                placeholder="write your remarks here"
                id="remarks"
                name="remarks"
                required={true}
                value={this.state.remarks}
                onChange={event =>
                  this.setState({ remarks: event.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="m-3">
          <Button
            variant="contained"
            onClick={this.handleSubmit}
            color="primary"
            disabled={this.state.remarks.trim().length === 0}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
