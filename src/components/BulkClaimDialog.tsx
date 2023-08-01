import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Checkbox from "@mui/material/Checkbox";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (selected) => any;
  contracts: any;
}

export default function BulkClaimDialog(props: SimpleDialogProps) {
  const { onClose, open, contracts } = props;
  const [contractsToSelect, setContractsToSelect] = useState([]);
  const [allOption, setAllOption] = useState(false);

  useEffect(() => {
    if (contracts) {
      init();
    }
  }, [contracts]);

  const init = () => {
    setContractsToSelect([...contracts]);
  };
  const handleClose = (ev, reason) => {
    if (reason === "close-button") {
      const selected = contractsToSelect.filter(
        (contract) => contract.isSelected
      );
      onClose(selected);
      resetSelected();
    } else if (reason === "cancel") {
      onClose(null);
      resetSelected();
    }
  };

  const selectContract = (index) => {
    const updatedContracts = [...contractsToSelect];
    if (!updatedContracts[index].isSelected === true) {
      let numSelected = 0;
      updatedContracts.forEach((contract) => {
        if (contract.isSelected) {
          numSelected++;
        }
      });
      if (numSelected === 5) {
        return;
      }
    }
    updatedContracts[index].isSelected = !updatedContracts[index].isSelected;
    setContractsToSelect(updatedContracts);
  };

  const resetSelected = () => {
    const updatedContracts = [...contractsToSelect];
    updatedContracts.forEach((contract) => {
      contract.isSelected = false;
    });
    setContractsToSelect(updatedContracts);
    setAllOption(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      id="bulk-claim-dialog"
      maxWidth="sm"
    >
      <DialogTitle className="dialog-title">
        Select Projects to Claim (5 Max)
        <FontAwesomeIcon
          icon={faClose}
          className="close-icon"
          onClick={(e) => handleClose(e, "cancel")}
        />
      </DialogTitle>

      <div className="content">
        <div className="contracts-content">
          {contractsToSelect.map((contract, index) => (
            <div onClick={() => selectContract(index)}>
              <Checkbox
                checked={!!contract.isSelected}
                inputProps={{ "aria-label": "controlled" }}
                sx={{
                  color: "#c8a0fd",
                  "&.Mui-checked": {
                    color: "#c8a0fd",
                  },
                }}
              />
              {contract.contract_info.name}
            </div>
          ))}
        </div>
      </div>

      <Button
        className="close-button"
        onClick={(e) => handleClose(e, "close-button")}
      >
        CLAIM REWARDS
      </Button>
    </Dialog>
  );
}
