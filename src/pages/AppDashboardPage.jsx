import { useEffect, useState } from "react";
import {
  resetPermit,
  getWalletClient,
  getPermit,
} from "../helpers/wallethelper";
import {
  queryWrapper,
  queryMyInfo,
  queryPaymentTokenBalance,
} from "../helpers/queryhelper";
import { txWrapper } from "../helpers/txhelper";
import { ToastContainer, toast } from "react-toastify";
import { getViewingKey, setViewingKey } from "../helpers/wallethelper";
import "react-toastify/dist/ReactToastify.css";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircularProgress from "@mui/material/CircularProgress";
// App dashboard page
const AppDashboardPage = ({ title, wClient }) => {
  // Title
  document.title = title;

  useEffect(() => {
    getData();
  }, [wClient]);

  // States
  const [walletClient, setWalletClient] = useState();
  const [activePool, setActivePool] = useState(1);
  const [poolType, setPoolType] = useState();
  const [selectedContract, setSelectedContract] = useState();
  const [contractsInfo, setContractsInfo] = useState([]);
  const [myInfo, setMyInfo] = useState({
    estimated_rewards: null,
    staked: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPermitError, setIsPermitError] = useState(false);
  const [isQueryError, setIsQueryError] = useState(false);

  const [hasVk, setHasVk] = useState(false);
  const [shillBalance, setShillBalance] = useState();
  const [hasBalanceError, setHasBalanceError] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState();

  const getData = async () => {
    setIsQueryError(false);
    setIsLoading(true);
    const contractsInfo = await getContractsInfo();
    if (contractsInfo.length > 0) {
      await getMyInfo(contractsInfo[0]);
    }
    setIsLoading(false);
    await loadBalance(
      contractsInfo[0].staked_info.staking_contract.address,
      contractsInfo[0].staked_info.staking_contract.code_hash
    );
  };
  const getContractsInfo = async () => {
    const q = { get_contracts_with_info: {} };
    const data = await queryWrapper(
      q,
      import.meta.env.VITE_APP_STAKE_MANAGER_CONTRACT_ADDRESS,
      import.meta.env.VITE_APP_STAKE_MANAGER_CONTRACT_HASH
    ).catch((err) => {
      setIsQueryError(true);
      setIsLoading(false);
    });

    setContractsInfo(data);
    if (data.length > 0) {
      selectPool(data[0], 0);
    }
    return data;
  };

  const tryResetPermit = async (contract) => {
    const wc = await getWalletClient();
    const permit = await resetPermit(
      wc.address,
      contract.contract_info.address
    ).catch((err) => {
      setIsPermitError(true);
    });

    if (permit) {
      setIsPermitError(false);
      setIsLoading(true);
      await getMyInfo(contract);
      setIsLoading(false);
    }
  };

  const getMyInfo = async (contract) => {
    const wc = await getWalletClient();
    setIsPermitError(false);
    setIsQueryError(false);
    let queryError = false;
    let permitError = false;
    let myInfo = null;

    const permit = await getPermit(
      wc.address,
      contract.contract_info.address
    ).catch((err) => {
      permitError = true;
      myInfo = null;
    });

    if (permit && Object.keys(permit).length === 0) {
      permitError = true;
    }

    if (!permitError) {
      myInfo = await queryMyInfo(permit, contract.contract_info).catch(
        (err) => {
          if (typeof err === "object" && err.isPermitError) {
            permitError = true;
          } else {
            queryError = true;
          }
        }
      );

      if (myInfo) {
        myInfo.percent =
          parseInt(contract.staked_info.total_staked_amount) === 0
            ? 0
            : (parseInt(myInfo.staked.staked_amount) /
                parseInt(contract.staked_info.total_staked_amount)) *
              100;
        myInfo.percent = myInfo.percent
          ? myInfo.percent.toFixed(2)
          : myInfo.percent;

        myInfo.estimated_rewards =
          contract.staked_info.total_rewards > 0 ? myInfo.estimated_rewards : 0;
      }
    }

    setIsPermitError(permitError);
    setIsQueryError(queryError);
    setMyInfo(myInfo);
  };

  const claimRewards = async () => {
    toast.loading("Claiming", {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    const txMsg = { claim_rewards: {} };
    const res = await txWrapper(
      txMsg,
      selectedContract.contract_info.address,
      selectedContract.contract_info.code_hash,
      250_000,
      true,
      await getWalletClient()
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
    });

    if (res) {
      //show success message
      toast.dismiss();
      toast.success("Successfully Claimed", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      getData();
      await loadBalance(
        selectedContract.staked_info.staking_contract.address,
        selectedContract.staked_info.staking_contract.code_hash
      );
    }
  };

  const withdraw = async () => {
    toast.loading("Withdrawing", {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    const txMsg = { withdraw_funds: {} };
    const res = await txWrapper(
      txMsg,
      selectedContract.contract_info.address,
      selectedContract.contract_info.code_hash,
      250_000,
      true,
      await getWalletClient()
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
    });

    if (res) {
      //show success message
      toast.dismiss();
      toast.success("Successfully Withdrawed", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      getData();
    }
  };

  const loadBalance = async (contract_address, hash) => {
    const vk = await getViewingKey(contract_address);
    if (vk) {
      const balance = await queryBalance(vk, contract_address, hash);
      if (balance && !balance.viewing_key_error) {
        setHasBalanceError(false);
        setHasVk(true);
        setShillBalance(balance.balance.amount.slice(0, -6));
      } else {
        setHasBalanceError(hasBalanceError);
      }

      setIsBalanceLoading(false);
    } else {
      setIsBalanceLoading(false);
      setHasVk(false);
    }
  };

  const handleVK = async () => {
    //TODO FIX THIS
    setIsBalanceLoading(true);
    await setViewingKey(
      selectedContract.staked_info.staking_contract.address
    ).catch((err) => {});
    const vk = await getViewingKey(
      selectedContract.staked_info.staking_contract.address
    );
    if (vk) {
      const balance = await queryBalance(
        vk,
        selectedContract.staked_info.staking_contract.address,
        selectedContract.staked_info.staking_contract.code_hash
      );
      if (balance) {
        setHasVk(true);
        setHasBalanceError(false);
        setIsBalanceLoading(false);
        setShillBalance(balance.balance.amount.slice(0, -6));
      }
    } else {
      setIsBalanceLoading(false);
    }
  };
  const depositShill = async () => {
    if (depositAmount && selectedContract && poolType === "token") {
      toast.loading("Depositing $SHILL", {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      let msgEncoded = window.btoa(JSON.stringify({ receive_stake: {} }));
      const txMsg = {
        send: {
          recipient: selectedContract.contract_info.address,
          recipient_code_hash: selectedContract.contract_info.code_hash,
          amount: depositAmount.toString() + "000000",
          msg: msgEncoded,
        },
      };

      const res = await txWrapper(
        txMsg,
        selectedContract.staked_info.staking_contract.address,
        selectedContract.staked_info.staking_contract.code_hash,
        250_000,
        true,
        await getWalletClient()
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
      });

      if (res) {
        //show success message
        toast.dismiss();
        toast.success("Successfully Deposited", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setDepositAmount(0);
        getData();
        await loadBalance(
          selectedContract.staked_info.staking_contract.address,
          selectedContract.staked_info.staking_contract.code_hash
        );
      }
    }
  };
  const queryBalance = async (vk, contract_address, hash) => {
    const wc = await getWalletClient();
    if (wc && wc.address) {
      const balance = await queryPaymentTokenBalance(
        wc.address,
        vk,
        contract_address,
        hash
      );
      return balance;
    }
  };

  const setMaxDeposit = () => {
    if (shillBalance) {
      setDepositAmount(shillBalance);
    }
  };

  const selectPool = (contract, index) => {
    setActivePool(index);
    setPoolType(contract.staked_info.staking_contract.stake_type);
    setSelectedContract(contract);
  };
  return (
    <main className="app-dashboard-page">
      <ToastContainer />
      {isLoading && (
        <img src="/images/brand/icon.png" className="loading-icon" />
      )}
      {/* Hero section */}
      <section className="hero-section">
        <div className="container">
          <div className="stats">
            <div className="stats-left">
              <h1>Dashboard</h1>

              <p>
                Provided is an overview of all of your staked positions. Enter
                into new positions and manage existing positions by depositing,
                withdrawing, and claiming rewards.
              </p>
            </div>
            {selectedContract && !isQueryError && (
              <div className="stats-right">
                <div className="box">
                  <p>Total Staked</p>

                  <h3>
                    {selectedContract.staked_info.total_staked_amount > 0
                      ? selectedContract.staked_info.total_staked_amount?.slice(
                          0,
                          -6
                        )
                      : 0}{" "}
                    {selectedContract.staked_info.staking_contract
                      .stake_type === "token"
                      ? "$" + selectedContract.staked_info.staking_contract.name
                      : ""}
                    <br /> {/* <span>$0.00</span> */}
                  </h3>
                </div>

                <div className="box">
                  <p>Rewards Emissions</p>

                  <h3>
                    {selectedContract.staked_info.reward_contract && (
                      <div>
                        {selectedContract.staked_info.reward_contract.rewards_per_day.slice(
                          0,
                          -6
                        )}{" "}
                        $SHILL/day
                      </div>
                    )}
                    <br />
                    {/* <span>$0.00</span> */}
                  </h3>
                </div>
              </div>
            )}
          </div>
          {isPermitError && (
            <div className="permit-box">
              <p>Permit Error</p>
              <h4>
                A permit is needed in order to retrieve your personalized pool
                information
              </h4>
              <button onClick={() => tryResetPermit(selectedContract)}>
                Create Permit
              </button>
            </div>
          )}

          {isQueryError && (
            <div className="query-box">
              <p>Query Error</p>
              <h4>
                There was a problem querying the contract. Please try again and
                if the problem persists contract the administrator.
              </h4>
            </div>
          )}
          {!isPermitError && !isQueryError && (
            <div className="pools">
              <div className="tab-nav">
                <h3>Pools:</h3>

                <div className="tab-nav-btns">
                  {contractsInfo.map((contract, index) => (
                    <button
                      onClick={() => selectPool(contract, index)}
                      className={activePool === index && "active"}
                    >
                      {contract.contract_info.stake_type === "token" ? "$" : ""}
                      {contract.staked_info.staking_contract.name}
                    </button>
                  ))}
                  {/* <button
                    onClick={() => setActivePool(2)}
                    className={activePool === 2 && "active"}
                  >
                    Shillables NFT
                  </button>

                  <button
                    onClick={() => setActivePool(3)}
                    className={activePool === 3 && "active"}
                  >
                    Broke Badgers
                  </button>

                  <button
                    onClick={() => setActivePool(4)}
                    className={activePool === 4 && "active"}
                  >
                    Alphacas
                  </button>

                  <button
                    onClick={() => setActivePool(5)}
                    className={activePool === 5 && "active"}
                  >
                    Boonanas
                  </button>

                  <button
                    onClick={() => setActivePool(6)}
                    className={activePool === 6 && "active"}
                  >
                    Wolf Pack
                  </button>

                  <button
                    onClick={() => setActivePool(7)}
                    className={activePool === 7 && "active"}
                  >
                    Bananappeals
                  </button>

                  <button
                    onClick={() => setActivePool(8)}
                    className={activePool === 8 && "active"}
                  >
                    Sly Foxes
                  </button> */}
                </div>
              </div>

              <div className="table">
                <div className="table-title-row">
                  <p>Asset</p>

                  <p>% Stake</p>

                  <p>Unclaimed</p>

                  <p>Deposited</p>

                  <p></p>
                </div>

                <div className="table-box-rows">
                  {poolType === "token" && myInfo && (
                    <div className="table-box-row">
                      <div className="content">
                        <div className="asset">
                          <img
                            src="/images/pages/app-dashboard-page/hero-section-img-1.png"
                            alt=""
                          />

                          <h3>$SHILL</h3>
                        </div>

                        <p>
                          <span>
                            % Stake <br />
                          </span>{" "}
                          {myInfo.percent} %
                        </p>

                        <p>
                          <span>
                            Unclaimed <br />
                          </span>{" "}
                          {myInfo.estimated_rewards?.slice(0, -6)}.
                          {myInfo.estimated_rewards?.slice(-6)} $SHILL
                        </p>

                        <p>
                          <span>
                            Deposited <br />
                          </span>{" "}
                          {myInfo.staked && (
                            <div>
                              {myInfo.staked.staked_amount?.slice(0, -6)} $SHILL
                            </div>
                          )}
                        </p>

                        {/* <button>Manage</button> */}
                      </div>

                      <div className="manage">
                        <div className="boxes">
                          <div className="box">
                            <div className="box-content">
                              <h3>Deposit</h3>

                              <div className="row">
                                <p class="balance">
                                  <p>
                                    Wallet balance:
                                    {isBalanceLoading &&
                                      !hasBalanceError &&
                                      hasVk && (
                                        <div className="balance-loading">
                                          <CircularProgress></CircularProgress>
                                        </div>
                                      )}{" "}
                                  </p>
                                  {(!hasVk || hasBalanceError) &&
                                    !isBalanceLoading && (
                                      <FontAwesomeIcon
                                        icon={faKey}
                                        className="key-icon"
                                        onClick={() => handleVK()}
                                      />
                                    )}
                                  {hasVk && !hasBalanceError && (
                                    <p className="info-value">
                                      {shillBalance || 0} $SHILL
                                    </p>
                                  )}
                                </p>
                                {/* <p>Wallet balance: 0 $SHILL</p> */}

                                <span
                                  onClick={(e) => setMaxDeposit()}
                                  className="max-deposit"
                                >
                                  MAX
                                </span>
                              </div>

                              <input
                                type="number"
                                placeholder="0.00"
                                value={depositAmount}
                                onChange={(e) =>
                                  setDepositAmount(e.target.value)
                                }
                              />
                              {!shillBalance ||
                                (parseInt(depositAmount) >
                                  parseInt(shillBalance) && (
                                  <span className="low-funds">
                                    Insufficient funds
                                  </span>
                                ))}
                            </div>

                            <div className="box-bottom">
                              <button
                                className="cta-btn"
                                onClick={() => depositShill()}
                              >
                                Deposit
                              </button>
                            </div>
                          </div>

                          <div className="box">
                            <div className="box-content">
                              <h3>Claim Rewards</h3>
                            </div>

                            <div className="box-bottom">
                              <p>
                                Unclaimed balance:{" "}
                                {myInfo.estimated_rewards?.slice(0, -6)}.
                                {myInfo.estimated_rewards?.slice(-6)} $SHILL
                              </p>

                              <button
                                className="cta-btn"
                                onClick={() => claimRewards()}
                              >
                                Claim
                              </button>
                            </div>
                          </div>

                          <div className="box">
                            <div className="box-content">
                              <h3>Withdraw</h3>

                              <p>
                                Deposited balance:{" "}
                                {myInfo.staked && (
                                  <span>
                                    {myInfo.staked.staked_amount > 0
                                      ? myInfo.staked.staked_amount.slice(0, -6)
                                      : "0"}{" "}
                                    $SHILL
                                  </span>
                                )}
                              </p>

                              <div className="input-group">
                                {/* <input type="number" placeholder="0.00" />

                              <button>Withdraw</button> */}
                              </div>
                            </div>

                            <div className="box-bottom">
                              <button
                                className="cta-btn"
                                onClick={() => withdraw()}
                              >
                                Withdraw All
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* 
                {activePool === 2 && (
                  <div className="table-box-row">
                    <div className="content">
                      <div className="asset">
                        <img
                          src="/images/pages/landing-page/nfts-section-img-1.png"
                          alt=""
                        />

                        <h3>Shillables NFT</h3>
                      </div>

                      <p>
                        <span>
                          Rewards 24H <br />
                        </span>{" "}
                        100.00 NFT(s)
                      </p>

                      <p>
                        <span>
                          Unclaimed <br />
                        </span>{" "}
                        100.00 NFT(s)
                      </p>

                      <p>
                        <span>
                          Deposited <br />
                        </span>{" "}
                        0.00 NFT(s)
                      </p>

                      <button>Stake Now</button>
                    </div>
                  </div>
                )} */}

                  {activePool >= 2 && (
                    <div className="table-box-row">
                      <div className="error">
                        <p>Coming Soon</p>
                        {/* <p>Currently, your wallet does not show any NFTs</p> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

// Export
export default AppDashboardPage;
