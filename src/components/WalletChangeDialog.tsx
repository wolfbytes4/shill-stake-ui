import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog"; 
import CircularProgress from "@mui/material/CircularProgress";
 
export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: () => void;
}

export default function WalletChangeDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;

  const handleClose = (ev, reason) => {
    if(reason === 'close-button'){
      onClose();
    }
  };

  return (
     <Dialog onClose={handleClose} open={open} id="wallet-change-dialog" maxWidth="sm">
      <DialogTitle className="dialog-title">Account Change Detected</DialogTitle>
      
      <div className="content">   
        <CircularProgress className="change-spinner" />
      </div> 

      <Button className="close-button" onClick={(e)=>handleClose(e, 'close-button')}>Confirm Wallet Change</Button>
    </Dialog>
  );
}
