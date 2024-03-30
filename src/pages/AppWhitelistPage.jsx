import { Fragment, useEffect, useState } from "react";
import { queryOwnedTokens } from "../helpers/queryhelper";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  resetPermit,
  getWalletClient,
  getPermit,
} from "../helpers/wallethelper";
import { whitelist } from "../helpers/txhelper";

// App dashboard page
const AppWhitelistPage = ({ title, wClient }) => {
  // Title
  document.title = title;

  useEffect(() => {
    init();
  }, [wClient]);

  const [walletClient, setWalletClient] = useState();
  const [address, setAddress] = useState("");
  const [ownedTokens, setOwnedTokens] = useState(null);
  const [isPermitError, setIsPermitError] = useState(false);
  const [isMyTokensLoading, setIsMyTokensLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const init = async () => {
    const wc = await getWalletClient();
    setWalletClient(wc);
  };
  const setMyTokens = async () => {
    setIsMyTokensLoading(true);
    const wc = await getWalletClient();
    const permit = !isPermitError
      ? await tryGetPermit()
      : await tryResetPermit();
    if (!isPermitError) {
      const myTokens = await queryOwnedTokens(
        wc.address,
        permit,
        import.meta.env.VITE_APP_CATYCLOPS_CONTRACT_ADDRESS,
        import.meta.env.VITE_APP_CATYCLOPS_CONTRACT_HASH,
        [import.meta.env.VITE_APP_CATYCLOPS_CONTRACT_ADDRESS]
      );
      setOwnedTokens(myTokens);
      setIsMyTokensLoading(false);
    } else {
      setIsMyTokensLoading(false);
    }
  };

  const tryResetPermit = async (contract) => {
    const permit = await resetPermit(
      walletClient.address,
      import.meta.env.VITE_APP_CATYCLOPS_CONTRACT_ADDRESS,
      null
    ).catch((err) => {
      setIsPermitError(true);
    });

    if (permit) {
      setIsPermitError(false);
      return permit;
    }
    return null;
  };

  const tryGetPermit = async () => {
    const wc = await getWalletClient();
    setIsPermitError(false);
    let permitError = false;
    const permit = await getPermit(
      wc.address,
      import.meta.env.VITE_APP_CATYCLOPS_CONTRACT_ADDRESS,
      null
    ).catch((err) => {
      permitError = true;
    });
    if (permit && Object.keys(permit).length === 0) {
      permitError = true;
    }

    setIsPermitError(permitError);
    if (!permitError) {
      return permit;
    }
    return null;
  };

  const submit = async () => {
    setIsSubmitLoading(true);
    toast.loading("Whitelisting", {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    const collectAddressMsg = {
      collect_address: { token_ids: ownedTokens, wallet_address: address },
    };
    const whitelistMsg = {
      set_whitelisted_approval: {
        address: import.meta.env.VITE_APP_COLLECTION_CONTRACT_ADDRESS,
        view_owner: "all",
        expires: "never",
      },
    };

    let errMsg = "";
    if (!ownedTokens || ownedTokens.length === 0) {
      errMsg = "No Tokens";
    }
    if (!address) {
      errMsg = "No Address Entered";
    }
    if (errMsg) {
      toast.dismiss();
      toast.error(errMsg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setIsSubmitLoading(false);
      return;
    }

    const res = await whitelist(
      whitelistMsg,
      collectAddressMsg,
      550_000,
      true,
      walletClient
    ).catch((err) => {
      toast.dismiss();
      toast.error(err.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setIsSubmitLoading(false);
    });

    if (res) {
      console.log(res);
      //show success message
      toast.dismiss();
      toast.success("Successfully Whitelisted", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setIsSubmitLoading(false);
      setIsCompleted(true);
    }
  };

  return (
    <main className="app-whitelist-page">
      <ToastContainer />
      <section className="hero-section">
        <div className="container">
          {!isCompleted && (
            <>
              <div className="left">
                <div className="info-box">
                  <p>Welcome Catyclops!!!</p>
                  <h4>
                    Go through the steps in order to get on the list for a
                    Steers free mint on Stargaze!
                  </h4>
                </div>
              </div>
              <div className="right">
                <div className="info-box">
                  <p>Step 1</p>
                  <h4>Get your Catyclops</h4>
                  <div className="button-container">
                    <p>
                      NFT balance:{" "}
                      <>{ownedTokens ? ownedTokens.length : "--"}</>
                    </p>
                    <button onClick={() => setMyTokens()}>
                      {isMyTokensLoading && (
                        <CircularProgress
                          color="secondary"
                          className="loading-spinner"
                        />
                      )}
                      {!isMyTokensLoading && <>Get</>}
                    </button>
                  </div>
                </div>
                <div className="info-box">
                  <p>Step 2</p>
                  <h4>Enter a Stars address to whitelist</h4>
                  <input
                    type="text"
                    placeholder="Stars address ..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="info-box">
                  <p>Step 3</p>
                  <h4>
                    Allow our smart contract to prove ownership and submit
                    whitelist address
                  </h4>
                  <div className="button-container">
                    <button onClick={() => submit()}>
                      {isSubmitLoading && (
                        <CircularProgress
                          color="secondary"
                          className="loading-spinner"
                        />
                      )}
                      {!isSubmitLoading && <>Submit</>}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {isCompleted && (
            <div className="info-box completed-box">
              <p>All Done!</p>
              <h4>
                You've Successfully whitelisted your address for the{" "}
                {ownedTokens.length} Catyclops you own for a free mint of Steers
                on Stargaze. You can now close this page!
              </h4>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

// Export
export default AppWhitelistPage;
