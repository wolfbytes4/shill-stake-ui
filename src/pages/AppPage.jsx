// Dependencies
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getWalletClient } from "../helpers/wallethelper.ts";
// App  page
const AppPage = ({ title }) => {
  // Title
  document.title = title;
  const [walletClient, setWalletClient] = useState();
  // Hooks
  const navigate = useNavigate();
  const connectWallet = async () => {
    const wc = await getWalletClient();
    localStorage.setItem("shill-connected", "connected");
    setWalletClient(wc);
    navigate("/app/dashboard");
  };

  const initWallet = async () => {
    let connected = localStorage.getItem("shill-connected");
    if (connected === "connected") {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      while (
        !window.keplr ||
        !window.getEnigmaUtils ||
        !window.getOfflineSignerOnlyAmino
      ) {
        await sleep(100);
      }
      await connectWallet();
      navigate("/app/dashboard");
    }

    // window.addEventListener("keplr_keystorechange", () => {
    //   console.log("Key store in Keplr is changed. You may need to refetch the account info.")
    //   //TODO: popup confirm wallet change
    //   this.setState({ openWalletChangeDialog: true });
    // });
  };

  useEffect(() => {
    initWallet();
  });
  return (
    <main className="app-page">
      {/* Hero section */}
      <section className="hero-section">
        <div className="container">
          <div className="box">
            <h1>Connect Your Wallet</h1>

            <p>
              As you probably guessed, you'll need to connect your wallet in
              order to start staking.
            </p>

            <button onClick={() => connectWallet()}>Connect Wallet</button>
          </div>
        </div>
      </section>
    </main>
  );
};

// Export
export default AppPage;
