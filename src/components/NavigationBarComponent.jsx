import { useEffect, useState } from "react";

// Dependencies
import { Link, useLocation, useNavigate } from "react-router-dom";

// Navigation bar component
const NavigationBarComponent = () => {
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();

  // States
  const [pathName, setPathName] = useState("/");
  const [hamburgerMenuOpened, setHamburgerMenuOpened] = useState(false);

  // Functions
  useEffect(() => {
    setPathName(location.pathname);
  }, [location]);

  return (
    <nav className="navigation-bar-component">
      <div className="container">
        <Link to="/" className="logo-wrapper">
          <img src="/images/brand/logo.png" alt="" />
        </Link>

        <button
          onClick={() => {
            setHamburgerMenuOpened(true);

            window.scrollTo({
              left: 0,
              top: 0,
            });
          }}
          className="hamburger-menu-open-btn"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 8C7 7.4477 7.4477 7 8 7C8.5523 7 9 7.4477 9 8C9 8.5523 8.5523 9 8 9C7.4477 9 7 8.5523 7 8Z"
              fill="white"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 8C1 7.4477 1.4477 7 2 7C2.5523 7 3 7.4477 3 8C3 8.5523 2.5523 9 2 9C1.4477 9 1 8.5523 1 8Z"
              fill="white"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 2C7 1.4477 7.4477 1 8 1C8.5523 1 9 1.4477 9 2C9 2.5523 8.5523 3 8 3C7.4477 3 7 2.5523 7 2Z"
              fill="white"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 2C1 1.4477 1.4477 1 2 1C2.5523 1 3 1.4477 3 2C3 2.5523 2.5523 3 2 3C1.4477 3 1 2.5523 1 2Z"
              fill="white"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {pathName === "/app/dashboard" || pathName === "/app/pools-info" ? (
          <div className="app-nav">
            <button
              onClick={() => {
                navigate("/app/dashboard");
              }}
              className={pathName === "/app/dashboard" && "active"}
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                navigate("/app/pools-info");
              }}
              className={pathName === "/app/pools-info" && "active"}
            >
              Pools Info
            </button>
          </div>
        ) : null}

        <div
          className={
            hamburgerMenuOpened
              ? "navigation-bar-component-elements active"
              : "navigation-bar-component-elements"
          }
        >
          <button
            onClick={() => {
              setHamburgerMenuOpened(false);
            }}
            className="hamburger-menu-close-btn"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L18.7742 18.7742"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 18.7744L18.7742 6.00024"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {pathName === "/" || pathName === "/app" ? (
            <ul>
              <li>
                <Link
                  onClick={() => {
                    setTimeout(() => {
                      const location = document.querySelector(
                        ".collections-section"
                      ).offsetTop;

                      window.scrollTo({
                        left: 0,
                        top: location - 100,
                      });

                      setHamburgerMenuOpened(false);
                    }, 300);
                  }}
                  to="/"
                >
                  Collections
                </Link>
              </li>

              <li>
                <Link
                  onClick={() => {
                    setTimeout(() => {
                      const location =
                        document.querySelector(".stake-section").offsetTop;

                      window.scrollTo({
                        left: 0,
                        top: location - 100,
                      });

                      setHamburgerMenuOpened(false);
                    }, 300);
                  }}
                  to="/"
                >
                  Stake
                </Link>
              </li>
            </ul>
          ) : null}

          {pathName === "/" || pathName === "/app" ? (
            <button
              onClick={() => {
                navigate("/app");

                setHamburgerMenuOpened(false);
              }}
              className="cta-btn"
            >
              Launch App
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

// Export
export default NavigationBarComponent;
