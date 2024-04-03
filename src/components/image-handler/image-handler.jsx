import React, { Component } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { queryTokenMetadata } from "../../helpers/queryhelper.ts";
import "./image-handler.scss";

class ImgHandler extends Component {
  constructor(props) {
    super();
    this.state = {
      hasError: false,
      isLoading: true,
      imgSrc: "",
    };
  }

  componentDidMount() {
    this.handleIndexedDb();
  }

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevProps.token_id !== this.props.token_id) {
      this.setState({ hasError: false, isLoading: true, imgSrc: "" });
      this.handleIndexedDb();
    }
  };
  async fetchImage() {
    const p = this.props;
    // get metadata
    const nftMetaData = await queryTokenMetadata(
      p.token_id,
      null,
      p.selectedContract.staked_info.staking_contract.address,
      p.selectedContract.staked_info.staking_contract.code_hash
    );
    if (
      nftMetaData &&
      (nftMetaData.nft_dossier.public_metadata.extension.media ||
        nftMetaData.nft_dossier.public_metadata.extension.external_url)
    ) {
      let data = await fetch(
        nftMetaData.nft_dossier.public_metadata.extension.media
          ? nftMetaData.nft_dossier.public_metadata.extension.media[0].url.replace(
              "ipfs.io",
              "nftstorage.link"
            )
          : nftMetaData.nft_dossier.public_metadata.extension.external_url
      )
        .then((response) => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error("failed to fetch img");
          }
        })
        .then((imageBlob) => {
          return this.readAsDataURL(imageBlob);
        })
        .catch((error) => {
          this.setState({ error: true, isLoading: false });
        });
      return {
        dataUrl: data,
        attributes:
          nftMetaData.nft_dossier.public_metadata.extension.attributes,
      };
    }
  }

  readAsDataURL(imageBlob) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onloadend = function () {
        resolve(fileReader.result);
      };
      fileReader.readAsDataURL(imageBlob);
    });
  }

  setLink(blob) {
    return URL.createObjectURL(blob);
  }

  handleIndexedDb() {
    const p = this.props;
    const table = p.selectedContract.staked_info.staking_contract.name;
    const request = indexedDB.open(p.address + "-ShillStake", 1);
    request.onerror = (event) => {
      console.error(`Database error: ${event.target.errorCode}`);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      this.getImageByTokenId(db, p.token_id, table);
    };
    request.onupgradeneeded = (event) => {
      let db = event.target.result;
      if (!db.objectStoreNames.contains("nfts")) {
        let store = db.createObjectStore("nfts", {
          autoIncrement: true,
          keyPath: "token_id",
        });
        let index = store.createIndex("token_id_nfts", "token_id", {
          unique: true,
        });
      }
    };
  }

  insertImage(db, imageInfo) {
    const p = this.props;
    const txn = db.transaction("nfts", "readwrite");
    const store = txn.objectStore("nfts");
    let query = store.put(imageInfo);

    query.onsuccess = function (event) {};
    query.onerror = function (event) {
      console.log(event.target.errorCode);
    };

    txn.oncomplete = function () {
      db.close();
    };
  }

  async getImageByTokenId(db, token_id, table) {
    const p = this.props;
    const txn = db.transaction("nfts", "readonly");
    const store = txn.objectStore("nfts");

    const index = store.index("token_id_nfts");
    let query = index.get(token_id + "||" + table);

    query.onsuccess = async (event) => {
      if (query.result && query.result.imageUrl) {
        db.close();
        if (p.selectedContract.staked_info.trait_restriction) {
          const attributes = JSON.parse(query.result.attributes);
          const hasAttribute = attributes.some(
            (f) =>
              f.trait_type === p.selectedContract.staked_info.trait_restriction
          );
          p.updateCantSelectNft(token_id, !hasAttribute);
        }

        this.setState({ isLoading: false, imgSrc: query.result.imageUrl });
      } else {
        const data = await this.fetchImage();
        if (data) {
          this.insertImage(
            db,
            {
              token_id: token_id + "||" + table,
              token_id_no_table: token_id,
              imageUrl: data.dataUrl,
              attributes: JSON.stringify(data.attributes),
              collection: table,
            },
            "nfts"
          );

          if (p.selectedContract.staked_info.trait_restriction) {
            const attributes = data.attributes;
            const hasAttribute = attributes.some(
              (f) =>
                f.trait_type ===
                p.selectedContract.staked_info.trait_restriction
            );
            p.updateCantSelectNft(token_id, !hasAttribute);
          }

          this.setState({ isLoading: false, imgSrc: data.dataUrl });
        }
      }
    };

    query.onerror = (event) => {
      this.setState({ isLoading: false, hasError: true });
      console.log(event.target.errorCode);
    };

    // txn.oncomplete = function () {
    //     db.close();
    // };
  }

  render() {
    const s = this.state;
    const p = this.props;
    if (s.isLoading) {
      return (
        <div className="spinner">
          <CircularProgress />
        </div>
      );
    } else {
      return <img src={s.imgSrc} crossOrigin="anonymous" alt="thumbnail" />;
    }
  }
}

export default ImgHandler;
