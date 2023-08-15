import { useEffect, useState } from "react";
import { queryWrapper } from "../helpers/queryhelper";
// App pools info page
const AppPoolsInfoPage = ({ title, wClient }) => {
  // Title
  document.title = title;
  useEffect(() => {
    getData();
  }, [wClient]);

  const [contractsInfo, setContractsInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQueryError, setIsQueryError] = useState(false);
  const images = {
    SHILL: "/images/pages/app-dashboard-page/hero-section-img-1.png",
    Shillables: "/images/pages/landing-page/nfts-section-img-1.png",
    "Wolf Pack Alphas": "/images/pages/landing-page/nfts-section-img-5.png",
    "Wolf Pack Alphas V2": "/images/pages/landing-page/nfts-section-img-5.png",
    "Broke Badgers": "/images/pages/landing-page/nfts-section-img-2.png",
    Alphacas: "/images/pages/landing-page/nfts-section-img-3.png",
    BooNanas: "/images/pages/landing-page/nfts-section-img-4.png",
    BananAppeals: "/images/pages/landing-page/nfts-section-img-6.png",
    "Sly Foxes": "/images/pages/landing-page/nfts-section-img-7.png",
    "Ample Agents LLC": "/images/pages/landing-page/AmpleAgents_Pool.Logo.png",
    Catyclops: "/images/pages/landing-page/Catyclops_Pool.Logo.png",
  };
  const poolInfo = {
    "Wolf Pack Alphas V2":
      "Rewards are weighted based off 50% Pack Ranking and 50% Pack Size",
  };
  const getData = async () => {
    setIsLoading(true);
    await getContractsInfo();
    setIsLoading(false);
  };
  const getContractsInfo = async () => {
    const q = { get_contracts_with_info: {} };
    const data = await queryWrapper(
      q,
      import.meta.env.VITE_APP_STAKE_MANAGER_CONTRACT_ADDRESS,
      import.meta.env.VITE_APP_STAKE_MANAGER_CONTRACT_HASH
    ).catch((err) => {
      setIsQueryError(true);
    });

    setIsLoading(false);
    setContractsInfo(data);
    return data;
  };

  return (
    <main className="app-pools-info-page">
      {isLoading && (
        <img src="/images/brand/icon.png" className="loading-icon" />
      )}
      {/* Hero section */}
      <section className="hero-section">
        <div className="container">
          <h1>Pools and Allocation</h1>

          <p className="top-desc">
            Check back regularly to see new projects added and what their Pool
            allocation is.
          </p>
          {isQueryError && (
            <div className="query-box">
              <p>Query Error</p>
              <h4>
                There was a problem querying the contract. Please try again and
                if the problem persists contract the administrator.
              </h4>
            </div>
          )}
          {!isQueryError && (
            <div className="table">
              <div className="table-title-row">
                <p>Pool</p>

                <p>About</p>

                <p>Total Staked</p>

                <p>
                  Rewards <br /> Emissions
                </p>

                {/* <p>CAP</p>

              <p>Commitment</p> */}
              </div>

              <div className="table-box-rows">
                {contractsInfo.map((contract, index) => (
                  <div className="table-box-row">
                    <div className="content">
                      <div className="pool">
                        <img
                          src={
                            images[contract.staked_info.staking_contract.name]
                          }
                          alt=""
                        />

                        {contract.staked_info.staking_contract.name ===
                          "SHILL" && (
                          <h3>
                            Shillables Token <br /> (
                            {contract.staked_info.staking_contract
                              .stake_type === "token"
                              ? "$"
                              : ""}
                            {contract.staked_info.staking_contract.name})
                          </h3>
                        )}
                        {contract.staked_info.staking_contract.name !==
                          "SHILL" && (
                          <h3>{contract.staked_info.staking_contract.name}</h3>
                        )}
                      </div>
                      {contract.staked_info.staking_contract.name ===
                        "SHILL" && (
                        <p className="secondary">
                          $SHILL is more than a rewards token for Shillables NFT
                          Projects, it fuels our ecosystem. Trade it, Stake it,
                          or use it to mint NFTs.
                        </p>
                      )}
                      {contract.staked_info.staking_contract.name !==
                        "SHILL" && (
                        <p className="secondary">
                          If you have at least one{" "}
                          {contract.staked_info.staking_contract.stake_type ===
                          "token"
                            ? "$"
                            : ""}
                          {contract.staked_info.staking_contract.name} in your
                          wallet, you can stake and start accruing rewards.
                          &nbsp;
                          {poolInfo[contract.staked_info.staking_contract.name]}
                        </p>
                      )}

                      <p>
                        <span className="hidden">Total Staked:</span>
                        {contract.staked_info.total_staked_amount > 0
                          ? contract.staked_info.staking_contract.stake_type ===
                            "token"
                            ? contract.staked_info.total_staked_amount?.slice(
                                0,
                                -6
                              )
                            : contract.staked_info.total_staked_amount
                          : 0}{" "}
                        <br />{" "}
                        <span>
                          {contract.staked_info.staking_contract.stake_type ===
                          "token"
                            ? "$" + contract.staked_info.staking_contract.name
                            : "NFTs"}
                        </span>
                      </p>

                      <p>
                        <span className="hidden">Rewards Emissions:</span>
                        {contract.staked_info.reward_contract.rewards_per_day.slice(
                          0,
                          -6
                        )}{" "}
                        <br /> <span>$SHILL/day</span>
                      </p>

                      {/* <p>
                      <span className="hidden">CAP:</span>
                      None
                    </p> */}

                      {/* <p>
                      <span className="hidden">Commitment:</span>
                      $SHILL
                    </p> */}
                    </div>
                  </div>
                ))}
                {/* <div className="table-box-row">
                <div className="content">
                  <div className="pool">
                    <img
                      src="/images/pages/landing-page/nfts-section-img-1.png"
                      alt=""
                    />

                    <h3>SHILLABLES NFT</h3>
                  </div>

                  <p className="secondary">
                    If you have at least one SHILLABLES NFT in your wallet, you
                    can stake and start accruing rewards.
                  </p>

                  <p>
                    <span className="hidden">Total Staked:</span>
                    51,114,560.8 <br /> <span>SHILLABLES NFT</span>
                  </p>

                  <p>
                    <span className="hidden">Possible Rewards:</span>
                    0.00225 <br /> <span>$SHILL/24H</span>
                  </p>

                  <p>
                    <span className="hidden">CAP:</span>
                    None
                  </p>

                  <p>
                    <span className="hidden">Commitment:</span>
                    SHILLABLES NFT
                  </p>
                </div>
              </div>

              <div className="table-box-row">
                <div className="content">
                  <div className="pool">
                    <img
                      src="/images/pages/landing-page/nfts-section-img-2.png"
                      alt=""
                    />

                    <h3>BROKE BADGERS</h3>
                  </div>

                  <p className="secondary">
                    If you have at least one BROKE BADGERS NFT in your wallet,
                    you can stake and start accruing rewards.
                  </p>

                  <p>
                    <span className="hidden">Total Staked:</span>
                    51,114,560.8 <br /> <span>BROKE BADGERS</span>
                  </p>

                  <p>
                    <span className="hidden">Possible Rewards:</span>
                    0.00225 <br /> <span>$SHILL/24H</span>
                  </p>

                  <p>
                    <span className="hidden">CAP:</span>
                    None
                  </p>

                  <p>
                    <span className="hidden">Commitment:</span>
                    BROKE BADGERS
                  </p>
                </div>
              </div>

              <div className="table-box-row">
                <div className="content">
                  <div className="pool">
                    <img
                      src="/images/pages/landing-page/nfts-section-img-3.png"
                      alt=""
                    />

                    <h3>ALPHACAS</h3>
                  </div>

                  <p className="secondary">
                    If you have at least one ALPHACAS NFT in your wallet, you
                    can stake and start accruing rewards.
                  </p>

                  <p>
                    <span className="hidden">Total Staked:</span>
                    51,114,560.8 <br /> <span>ALPHACAS</span>
                  </p>

                  <p>
                    <span className="hidden">Possible Rewards:</span>
                    0.00225 <br /> <span>$SHILL/24H</span>
                  </p>

                  <p>
                    <span className="hidden">CAP:</span>
                    None
                  </p>

                  <p>
                    <span className="hidden">Commitment:</span>
                    ALPHACAS
                  </p>
                </div>
              </div>

              <div className="table-box-row">
                <div className="content">
                  <div className="pool">
                    <img
                      src="/images/pages/landing-page/nfts-section-img-4.png"
                      alt=""
                    />

                    <h3>BOONANAS</h3>
                  </div>

                  <p className="secondary">
                    If you have at least one BOONANAS NFT in your wallet, you
                    can stake and start accruing rewards.
                  </p>

                  <p>
                    <span className="hidden">Total Staked:</span>
                    51,114,560.8 <br /> <span>BOONANAS</span>
                  </p>

                  <p>
                    <span className="hidden">Possible Rewards:</span>
                    0.00225 <br /> <span>$SHILL/24H</span>
                  </p>

                  <p>
                    <span className="hidden">CAP:</span>
                    None
                  </p>

                  <p>
                    <span className="hidden">Commitment:</span>
                    BOONANAS
                  </p>
                </div>
              </div>

              <div className="table-box-row">
                <div className="content">
                  <div className="pool">
                    <img
                      src="/images/pages/landing-page/nfts-section-img-5.png"
                      alt=""
                    />

                    <h3>WOLF PACK</h3>
                  </div>

                  <p className="secondary">
                    If you have at least one WOLF PACK NFT in your wallet, you
                    can stake and start accruing rewards.
                  </p>

                  <p>
                    <span className="hidden">Total Staked:</span>
                    51,114,560.8 <br /> <span>WOLF PACK</span>
                  </p>

                  <p>
                    <span className="hidden">Possible Rewards:</span>
                    0.00225 <br /> <span>$SHILL/24H</span>
                  </p>

                  <p>
                    <span className="hidden">CAP:</span>
                    None
                  </p>

                  <p>
                    <span className="hidden">Commitment:</span>
                    WOLF PACK
                  </p>
                </div>
              </div>

              <div className="table-box-row">
                <div className="content">
                  <div className="pool">
                    <img
                      src="/images/pages/landing-page/nfts-section-img-6.png"
                      alt=""
                    />

                    <h3>BANANAPPEALS</h3>
                  </div>

                  <p className="secondary">
                    If you have at least one BANANAPPEALS NFT in your wallet,
                    you can stake and start accruing rewards.
                  </p>

                  <p>
                    <span className="hidden">Total Staked:</span>
                    51,114,560.8 <br /> <span>BANANAPPEALS</span>
                  </p>

                  <p>
                    <span className="hidden">Possible Rewards:</span>
                    0.00225 <br /> <span>$SHILL/24H</span>
                  </p>

                  <p>
                    <span className="hidden">CAP:</span>
                    None
                  </p>

                  <p>
                    <span className="hidden">Commitment:</span>
                    BANANAPPEALS
                  </p>
                </div>
              </div>

              <div className="table-box-row">
                <div className="content">
                  <div className="pool">
                    <img
                      src="/images/pages/landing-page/nfts-section-img-7.png"
                      alt=""
                    />

                    <h3>SLY FOXES</h3>
                  </div>

                  <p className="secondary">
                    If you have at least one SLY FOXES NFT in your wallet, you
                    can stake and start accruing rewards.
                  </p>

                  <p>
                    <span className="hidden">Total Staked:</span>
                    51,114,560.8 <br /> <span>SLY FOXES</span>
                  </p>

                  <p>
                    <span className="hidden">Possible Rewards:</span>
                    0.00225 <br /> <span>$SHILL/24H</span>
                  </p>

                  <p>
                    <span className="hidden">CAP:</span>
                    None
                  </p>

                  <p>
                    <span className="hidden">Commitment:</span>
                    SLY FOXES
                  </p>
                </div>
              </div> */}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

// Export
export default AppPoolsInfoPage;
