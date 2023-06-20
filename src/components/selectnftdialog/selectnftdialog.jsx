import React, { Component } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@mui/material/Pagination";
import ImgHandler from "../image-handler/image-handler";
import "./selectnftdialog.scss";

class SelectNftDialog extends Component {
  constructor(props) {
    super();
    this.state = {
      open: false,
    };

    this.handleClose = this.handleClose.bind(this);
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOk = () => {
    this.setState({ open: false });
  };

  componentDidMount = () => {};

  render() {
    const s = this.state;
    const p = this.props;
    return (
      <div>
        <span className="choose-btn" onClick={this.handleClickOpen}>
          Choose NFTs
        </span>
        <SimpleDialog
          open={s.open}
          onClose={this.handleClose}
          onOk={this.handleOk}
          ownedTokens={p.ownedTokens}
          selectNft={p.selectNft}
          resetSelected={p.resetSelected}
          selectedContract={p.selectedContract}
          address={p.address}
          updateCantSelectNft={p.updateCantSelectNft}
        />
      </div>
    );
  }
}
export default SelectNftDialog;

class SimpleDialog extends Component {
  constructor(props) {
    super();
    this.state = {
      totalPages: 0,
      page: 0,
      pageSize: 10,
    };

    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount = () => {
    const p = this.props;
    const s = this.state;
    const totalPages = Math.ceil(p.ownedTokens.length / s.pageSize);
    this.setState({ totalPages: totalPages });
  };

  pageChange = (ev, page) => {
    this.setState({ page: page - 1 });
  };

  imageLoaded = (nft) => {
    let s = this.state;
    nft.isLoaded = true;
    this.setState(s);
  };

  render() {
    const p = this.props;
    const s = this.state;
    return (
      <Dialog
        onClose={this.handleClose}
        open={p.open}
        id="dialog"
        fullWidth="true"
        maxWidth="md"
      >
        <DialogTitle className="dialog-title">Select NFTs to stake</DialogTitle>

        <div className="content">
          {p.ownedTokens
            .sort((a, b) => {
              return b - a;
            })
            .slice(s.page * s.pageSize, s.page * s.pageSize + s.pageSize)
            .map((nft, index) => {
              return (
                <div
                  className="nft-container"
                  onClick={() => p.selectNft(index)}
                >
                  {!nft.cantSelect && !nft.isSelected && (
                    <FontAwesomeIcon icon={faCircle} className="circle-icon" />
                  )}
                  {!nft.cantSelect && nft.isSelected && (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="check-icon"
                    />
                  )}

                  <div className="token-text">#{nft.token_id}</div>
                  <div className="nft">
                    <div className="inner-container">
                      <ImgHandler
                        index={index}
                        token_id={nft.token_id}
                        selectedContract={p.selectedContract}
                        address={p.address}
                        updateCantSelectNft={p.updateCantSelectNft}
                      />
                      {nft.cantSelect && <div class="overlay"></div>}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <Pagination
          count={s.totalPages}
          onChange={this.pageChange}
          variant="outlined"
          shape="rounded"
          className="select-pagination"
        />
        <div className="btn-container">
          <button
            disabled={p.numSelected !== p.numNfts}
            href="#"
            className="mission-button button-border"
            onClick={() => this.handleOk()}
          >
            {p.numSelected !== p.numNfts
              ? `Select (${p.numNfts - p.numSelected}) More`
              : "Ok"}
          </button>
        </div>
      </Dialog>
    );
  }
  handleClose = () => {
    const p = this.props;
    p.resetSelected();
    p.onClose();
  };
  handleOk = () => {
    const p = this.props;
    p.onOk();
  };
}
