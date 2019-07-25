import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {

  return (
    <div>
      <Dialog
        open={props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Something Wrong?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Check the email or password!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClick} color="primary" autoFocus>
            Try Again
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}