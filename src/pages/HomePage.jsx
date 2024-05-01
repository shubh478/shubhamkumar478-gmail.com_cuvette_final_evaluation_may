import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Filter from "../components/Filter/Filter";
import MedicalStories from "../components/MedicalStory/MedicalStories";
import FruitsStories from "../components/FruitStory/FruitStories";
import WorldStories from "../components/WorldStory/WorldStories";
import IndiaStories from "../components/IndiaStory/IndiaStories";
import UserStories from "../components/YourStory/UserStories";
import styles from "./HomePage.module.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Login from "../components/Login/Login";

const HomePage = () => {
  const [userID, setUserID] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storiesUpdated, setStoriesUpdated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const {
    shouldShowLogin,
    loginThroughStory,
    showYourStoryThroughBokkmark,
    logoutThroughBookmark,
  } = location.state || {};
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showMbileViewYourStory, setShowMbileViewYourStory] = useState(false);
  const [showfilter, setShowFilter] = useState(true);
  useEffect(() => {
    if (logoutThroughBookmark) {
      setSelectedFilter("All");
    }
  });
  useEffect(() => {
    if (showYourStoryThroughBokkmark) {
      handleUserStories();
    }
  }, []);
  useEffect(() => {
    console.log("i m here for location changes");
    const fetchUserID = async () => {
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;
        if (!token) {
          setUserID(null);
          return;
        }
        const response = await axios.get(
          "http://localhost:3000/api/v1/users/get-user-id"
        );
        localStorage.setItem("userId", response.data.data.userId.userId);
        setUserID(response.data.data.userId.userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserID();
  }, [location.pathname, isLoggedIn]);

  useEffect(() => {
    console.log("Checking location...");
    const token = localStorage.getItem("token");
    if (token) {
      // Check if the current location is the homepage
      if (location.pathname === "/") {
        console.log("Navigated to homepage after logging in. Fetching data...");
        // Perform any action you need here, such as fetching data
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    // Check if shouldShowLogin is true, then show the login component
    console.log("i m here nothing changed");
    if (shouldShowLogin) {
      setShowLogin(true);
    }
    if (loginThroughStory) {
      setIsLoggedIn(true);
    }
  }, [shouldShowLogin, isLoggedIn]);

  const handleLogin = () => {
    console.log("i m after login here in handleLogin");
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    if (!token) {
      setUserID(null);
    }
    setIsLoggedIn(!isLoggedIn);
    setStoriesUpdated((prevState) => !prevState); // Update storiesUpdated state
  };

  const handleUserId = () => {
    return localStorage.getItem("userId");
  };

  const handleStoryAdded = () => {
    setStoriesUpdated((prevState) => !prevState);
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  const handleFilter = (item) => {
    setShowFilter(true);
    setSelectedFilter(item);
  };
  const handleUserStories = () => {
    console.log(" i m here");
    setShowMbileViewYourStory(true);
    setShowFilter(false);
    setSelectedFilter("");
  };

  return (
    <div className={styles.container}>
      <Header
        handleLogin={handleLogin}
        handleStoryAdded={handleStoryAdded}
        handleUserStories={handleUserStories}
        showMbileViewYourStory={showMbileViewYourStory}
        handleFilter={handleFilter}
      />
      {showfilter && <Filter handleFilter={handleFilter} />}
      <div className={styles.desktopViewUserStory}>
        {userID && selectedFilter === "All" && (
          <UserStories
            userID={handleUserId()}
            storiesUpdated={storiesUpdated}
          />
        )}
      </div>
      <div className={styles.mobileViewUserStory}>
        {userID && showMbileViewYourStory && (
          <UserStories
            userID={handleUserId()}
            storiesUpdated={storiesUpdated}
          />
        )}
      </div>
      {(selectedFilter === "All" || selectedFilter === "Medical") && (
        <MedicalStories
          handleLogin={handleLogin}
          userID={handleUserId()}
          storiesUpdated={storiesUpdated}
        />
      )}
      {(selectedFilter === "All" || selectedFilter === "Fruits") && (
        <FruitsStories
          handleLogin={handleLogin}
          userID={handleUserId()}
          storiesUpdated={storiesUpdated}
        />
      )}
      {(selectedFilter === "All" || selectedFilter === "World") && (
        <WorldStories
          handleLogin={handleLogin}
          userID={handleUserId()}
          storiesUpdated={storiesUpdated}
        />
      )}
      {(selectedFilter === "All" || selectedFilter === "India") && (
        <IndiaStories
          handleLogin={handleLogin}
          userID={handleUserId()}
          storiesUpdated={storiesUpdated}
        />
      )}
      {showLogin && (
        <div className={styles.login}>
          <Login toggleLogin={toggleLogin} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
