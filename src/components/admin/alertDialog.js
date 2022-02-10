import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

/* this is a confirmation dialog before delete*/
export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(props.show);

  const handleClose = (confirm) => {
    setOpen(false);
    props.handleClose(confirm);
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className="text-center">
        Please Confirm!
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleClose(false)}
          style={{ textTransform: "none" }}
          autoFocus
          className="no-outline"
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleClose(true)}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
