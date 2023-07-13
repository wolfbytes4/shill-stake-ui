// Dependencies
import { Link } from "react-router-dom";

// Footer component
const FooterComponent = () => {
  return (
    <footer className="footer-component">
      <div className="container">
        <div className="footer-component-top">
          <Link to="/" className="logo-wrapper">
            <img src="/images/brand/logo-white.png" alt="" />
          </Link>

          <div className="social-links">
            <a href="https://discord.gg/uFnfHUacyJ" target="_blank">
              <svg
                width="19"
                height="13"
                viewBox="0 0 19 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.0842 1.07766C14.8524 0.570093 13.5525 0.20815 12.2169 0.000893284C12.2047 -0.001141 12.1922 0.00032151 12.1811 0.00505294C12.17 0.00978436 12.1607 0.017556 12.1548 0.0272588C11.9877 0.293967 11.8027 0.641819 11.6732 0.915202C10.2128 0.718927 8.7599 0.718927 7.32953 0.915202C7.19997 0.635716 7.00816 0.293967 6.84048 0.0272588C6.83421 0.0177731 6.82504 0.0101959 6.81394 0.00551015C6.80284 0.000813014 6.79042 -0.000763765 6.77835 0.000961948C5.44256 0.207739 4.14255 0.569647 2.91087 1.07759C2.90034 1.08164 2.89146 1.08852 2.88547 1.09727C0.422283 4.40057 -0.252536 7.62274 0.0785345 10.8049C0.0794754 10.8127 0.0821412 10.8202 0.0863876 10.8271C0.0906218 10.8339 0.0963519 10.84 0.10324 10.8448C1.72836 11.9161 3.30258 12.5666 4.84759 12.9977C4.85965 13.0008 4.87244 13.0007 4.88438 12.9971C4.89633 12.9937 4.9067 12.987 4.9143 12.9781C5.27971 12.5301 5.60542 12.0576 5.88481 11.5609C5.88867 11.5541 5.89084 11.5466 5.89132 11.539C5.89169 11.5314 5.89024 11.5238 5.88722 11.5167C5.88409 11.5096 5.87926 11.5031 5.87323 11.4978C5.8672 11.4925 5.85984 11.4883 5.85188 11.4857C5.33508 11.3098 4.84313 11.0953 4.36976 10.8517C4.36113 10.8471 4.35387 10.8407 4.34865 10.833C4.34342 10.8254 4.34037 10.8167 4.33978 10.8077C4.33918 10.7987 4.34106 10.7897 4.34523 10.7816C4.34942 10.7734 4.35577 10.7663 4.36374 10.7609C4.46333 10.6939 4.563 10.6242 4.65807 10.5537C4.66653 10.5475 4.67677 10.5435 4.68763 10.5422C4.69849 10.5409 4.70946 10.5423 4.71948 10.5463C7.82896 11.8207 11.1953 11.8207 14.2681 10.5463C14.2781 10.5421 14.2892 10.5403 14.3003 10.5416C14.3113 10.5429 14.3216 10.5467 14.3302 10.5531C14.4254 10.6234 14.525 10.6939 14.6254 10.7609C14.6334 10.7663 14.6398 10.7734 14.644 10.7815C14.6482 10.7896 14.6501 10.7985 14.6497 10.8074C14.6492 10.8165 14.6462 10.8251 14.6411 10.8328C14.6359 10.8405 14.6287 10.847 14.6201 10.8515C14.1466 11.0998 13.6506 11.3118 13.1374 11.485C13.1294 11.4878 13.1222 11.492 13.1161 11.4974C13.1101 11.5029 13.1054 11.5093 13.1024 11.5165C13.0994 11.5237 13.098 11.5312 13.0985 11.539C13.099 11.5466 13.1013 11.5541 13.1052 11.5609C13.3905 12.0569 13.7162 12.5294 14.0749 12.9774C14.0823 12.9865 14.0927 12.9935 14.1046 12.9971C14.1166 13.0008 14.1295 13.0009 14.1415 12.9977C15.6941 12.5664 17.2683 11.9161 18.8935 10.8448C18.9003 10.8402 18.9063 10.8343 18.9105 10.8275C18.9148 10.8208 18.9174 10.8133 18.9182 10.8056C19.3144 7.12663 18.2546 3.93086 16.109 1.09791C16.1038 1.08871 16.095 1.0815 16.0842 1.07759V1.07766ZM6.34913 8.86731C5.41301 8.86731 4.64161 8.09577 4.64161 7.14834C4.64161 6.2008 5.39805 5.42926 6.34925 5.42926C7.30782 5.42926 8.07168 6.20754 8.05672 7.14834C8.05672 8.09577 7.30022 8.86731 6.34913 8.86731ZM12.6626 8.86731C11.7264 8.86731 10.955 8.09577 10.955 7.14834C10.955 6.2008 11.7114 5.42926 12.6626 5.42926C13.6211 5.42926 14.385 6.20754 14.37 7.14834C14.37 8.09577 13.6211 8.86731 12.6626 8.86731Z"
                  fill="white"
                />
              </svg>
            </a>

            <a href="https://stashh.io" target="_blank">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_27_161)">
                  <path
                    d="M9.08165 17.1485L5.70459 9.81494H12.4587L9.08165 17.1485Z"
                    fill="white"
                  />
                  <path
                    d="M4.70341 9.67898L7.89951 16.4804L0 6.61938L4.70341 9.67898Z"
                    fill="white"
                  />
                  <path
                    d="M12.4538 8.84687L5.65601 8.87618L6.55406 5.07195L11.4739 5.05078L12.4538 8.84687Z"
                    fill="white"
                  />
                  <path
                    d="M4.76239 8.57923L0.299805 5.74895L2.21401 3.17163L5.79745 4.89961L4.76239 8.57923Z"
                    fill="white"
                  />
                  <path
                    d="M11.3369 0.851562L15.2303 2.51517L11.6597 4.18141L6.25969 4.14296L2.86084 2.48699L6.60546 0.851562H11.3369Z"
                    fill="white"
                  />
                  <path
                    d="M13.2839 8.61941L17.7377 5.79464L15.7023 3.26904L12.2478 4.94042L13.2839 8.61941Z"
                    fill="white"
                  />
                  <path
                    d="M13.4517 9.72314L10.2991 16.5247L18 6.79028L13.4517 9.72314Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_27_161">
                    <rect width="18" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </a>

            <a href="https://twitter.com/shillstake" target="_blank">
              <svg
                width="16"
                height="13"
                viewBox="0 0 16 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.3554 3.23982C14.3655 3.38198 14.3655 3.52422 14.3655 3.66638C14.3655 8.0031 11.066 13 5.03557 13C3.17764 13 1.45175 12.4617 0 11.5273C0.263969 11.5578 0.517751 11.5679 0.791882 11.5679C2.32487 11.5679 3.73602 11.05 4.86295 10.1664C3.42137 10.136 2.21317 9.19138 1.79691 7.8914C2.00004 7.92186 2.203 7.94217 2.41622 7.94217C2.71071 7.94217 3.00511 7.90156 3.27917 7.83048C1.77666 7.52577 0.649723 6.20549 0.649723 4.61096V4.57035C1.08625 4.81404 1.59395 4.96644 2.13199 4.98666C1.2487 4.39764 0.670036 3.39213 0.670036 2.25462C0.670036 1.6453 0.832438 1.08674 1.11676 0.599172C2.73096 2.58979 5.15735 3.88976 7.87814 4.03201C7.82738 3.78823 7.79695 3.53438 7.79695 3.28044C7.79695 1.47268 9.25887 0 11.0761 0C12.0203 0 12.8731 0.396093 13.4721 1.03597C14.2132 0.893726 14.9238 0.619479 15.5533 0.243784C15.3096 1.00551 14.7919 1.6453 14.1116 2.05154C14.7716 1.98047 15.4112 1.79761 16 1.54376C15.5534 2.1937 14.9949 2.77265 14.3554 3.23982Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-component-bottom">
          <p>© Copyright 2023 ShillStake.io</p>

          <div className="links">
            {/* <Link to="/">Terms of Service</Link>

            <Link to="/">Privacy Policy</Link> */}
          </div>

          <p>
            Contract Address:{" "}
            <a
              href={
                "https://www.mintscan.io/secret/account/" +
                import.meta.env.VITE_APP_STAKE_MANAGER_CONTRACT_ADDRESS
              }
              target="_blank"
            >
              {import.meta.env.VITE_APP_STAKE_MANAGER_CONTRACT_ADDRESS.substring(
                0,
                8
              ) +
                "...." +
                import.meta.env.VITE_APP_STAKE_MANAGER_CONTRACT_ADDRESS.substring(
                  import.meta.env.VITE_APP_STAKE_MANAGER_CONTRACT_ADDRESS
                    .length - 8,
                  import.meta.env.VITE_APP_STAKE_MANAGER_CONTRACT_ADDRESS.length
                )}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Export
export default FooterComponent;
