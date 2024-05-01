import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import BookmarkIcon from "../../assets/BookmarkIcon.svg";
import ProfilePic from "../../assets/ProfilePic.svg";
import HamburgerIcon from "../../assets/HamburgerIcon.svg";
import Register from "../../components/Register/Register";
import Login from "../../components/Login/Login";
import AddStory from "../AddStory/AddStory";
import CroosIconMobileHeader from "../../assets/CroosIconMobileHeader.svg";
const Header = ({
  handleLogin,
  handleStoryAdded,
  inBookmark,
  handleUserStories,
  mobileViewHeader,
  logoutThroughBookmark,
  showMbileViewYourStory,
  handleFilter,
}) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddStory, setShowAddStory] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");

    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, [showLogin, showRegister]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    if (!inBookmark) {
      console.log("need to be checked");
      setIsLoggedIn(false);
      setUserName("");
      handleLogin();
    }
    setIsDropdownOpen(false);
    if (logoutThroughBookmark) {
      navigate("/", { state: { logoutThroughBookmark: true } });
    } else if (showMbileViewYourStory) {
      handleFilter("All");
      navigate("/");
    } else {
      navigate("/");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleRegister = () => {
    setIsDropdownOpen(false);
    handleLogin();
    setShowRegister(!showRegister);
  };

  const toggleLogin = () => {
    setIsDropdownOpen(false);
    handleLogin();
    setShowLogin(!showLogin);
  };

  const toggleAddStory = () => {
    if (!inBookmark) {
      handleStoryAdded();
    }
    setShowAddStory(!showAddStory);
  };
  const handleYourStory = () => {
    console.log("i m in ur story problem");
    if (mobileViewHeader) {
      navigate("/", { state: { showYourStoryThroughBokkmark: true } });
    }
    handleUserStories();
  };

  return (
    <div className={styles.headerContainer}>
      <div
        className={`${styles.header} ${
          isLoggedIn ? styles.loggedIn : styles.notLoggedIn
        }`}
      >
        <div className={styles.logo}>SwipTory</div>

        <div className={styles.menu}>
          {isLoggedIn ? (
            <>
              <div className={styles.actions}>
                <div className={styles.addStory} onClick={toggleAddStory}>
                  {" "}
                  {/* Trigger toggleAddStory */}
                  <div>Add Story</div>
                </div>
                <Link to="/bookmark" className={styles.noUnderline}>
                  <div className={styles.bookmark}>
                    <img src={BookmarkIcon} alt="Not found Image" />
                    <div className={styles.bookmarkLinkText}>Bookmarks</div>
                  </div>
                </Link>
                <div className={styles.userProfile}>
                  <img src={ProfilePic} alt="User Profile" />
                </div>

                <div className={styles.hamburger} onClick={toggleDropdown}>
                  <img
                    src={HamburgerIcon}
                    alt=""
                    className={styles.hamburgerIcon}
                  />
                </div>
                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.userName}>{userName}</div>
                    <button
                      className={styles.logoutButton}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={styles.buttonRegister} onClick={toggleRegister}>
                Register
              </div>
              <div className={styles.buttonLogin} onClick={toggleLogin}>
                Login
              </div>
            </>
          )}
        </div>

        {showRegister && (
          <div className={styles.register}>
            <Register toggleRegister={toggleRegister} />
          </div>
        )}
        {showLogin && (
          <div className={styles.login}>
            <Login toggleLogin={toggleLogin} />
          </div>
        )}

        {/* Popup for AddStory */}
        {showAddStory && (
          <div className={styles.addStoryPopup}>
            <div className={styles.addStoryContent}>
              <AddStory closePopup={toggleAddStory} inBookmark={inBookmark} />{" "}
            </div>
          </div>
        )}
      </div>
      <div className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>SwipTory</div>
        <div className={styles.mobileHamburger} onClick={toggleDropdown}>
          <img
            src={HamburgerIcon}
            alt=""
            className={styles.mobileHamburgerIcon}
          />
        </div>

        <div className={styles.mobileMenu}>
          {isLoggedIn ? (
            <>
              <div className={styles.mobileActions}>
                {isDropdownOpen && (
                  <div className={styles.mobileDropdownMenu}>
                    <div className={styles.userContainer}>
                      <div className={styles.userProfile}>
                        <div className={styles.mobileUserProfile}>
                          <img src={ProfilePic} alt="User Profile" />
                        </div>
                        <div className={styles.mobileUserName}>{userName}</div>
                      </div>
                      <div className={styles.closeIcon}>
                        {" "}
                        <img
                          src={CroosIconMobileHeader}
                          alt=""
                          onClick={toggleDropdown}
                        />
                      </div>
                    </div>
                    <button
                      className={styles.mobileLogoutButton}
                      onClick={handleYourStory}
                    >
                      Your Story
                    </button>
                    <button
                      className={styles.mobileLogoutButton}
                      onClick={toggleAddStory}
                    >
                      Add Story
                    </button>
                    <Link to="/bookmark" className={styles.noUnderline}>
                      <button className={styles.mobileLogoutButton}>
                        <img src={BookmarkIcon} alt="" />
                        <span>Bookmarks</span>
                      </button>
                    </Link>
                    <button
                      className={styles.mobileLogoutButton}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={styles.mobileActions}>
                {isDropdownOpen && (
                  <div className={styles.mobileDropdownMenu}>
                    <div className={styles.closeIconNotLoggedIn}>
                      {" "}
                      <img
                        src={CroosIconMobileHeader}
                        onClick={toggleDropdown}
                        alt=""
                      />
                    </div>
                    <div className={styles.registerLoginBtn}>
                      <div
                        className={styles.mobileButtonRegister}
                        onClick={toggleRegister}
                      >
                        Register
                      </div>
                      <div
                        className={`${styles.mobileButtonLogin} ${styles.mobileText}`}
                        onClick={toggleLogin}
                      >
                        Login
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {showRegister && (
          <div className={styles.register}>
            <Register toggleRegister={toggleRegister} />
          </div>
        )}
        {showLogin && (
          <div className={styles.login}>
            <Login toggleLogin={toggleLogin} />
          </div>
        )}

        {/* Popup for AddStory */}
        {showAddStory && (
          <div className={styles.addStoryPopup}>
            <div className={styles.addStoryContent}>
              <AddStory closePopup={toggleAddStory} inBookmark={inBookmark} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
