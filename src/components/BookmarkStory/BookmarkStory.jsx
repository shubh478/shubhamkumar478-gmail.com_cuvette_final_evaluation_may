import React, { useState, useEffect } from "react";
import Story from "../Story/Story";
import axios from "axios";
import styles from "../../pages/HomePage.module.css";
import Header from "../Header/Header";
import NoBookmarkimage from "../../assets/NoBookmarkimage.png";
import { Link } from "react-router-dom";
const BookmarkStories = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [seeMoreBookmarked, setSeeMoreBookmarked] = useState(false);
  const [edited, setEdited] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(
    localStorage.getItem("userId")
  );
  const [inBookmark, setInBookmark] = useState(true);
  const [removed, setRemoved] = useState(false);
  const [mobileViewHeader, setMobileViewHeader] = useState(true);
  const [logoutThroughBookmark, setLogoutThroughBookmark] = useState(true);

  useEffect(() => {
    const fetchBookmarkedStories = async () => {
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;
        if (!token) return;
        const response = await axios.get(
          "http://localhost:3000/api/v1/story/bookmarked"
        );
        setBookmarkedStories(response.data.bookmarkedStories);
        console.log("bookmarked stories:", response.data.bookmarkedStories);
      } catch (error) {
        console.error("Error fetching bookmarked stories:", error);
      }
    };
    fetchBookmarkedStories();
  }, [edited, removed]);
  const handleEdited = () => {
    setEdited(!edited);
  };
  const handleRemove = () => {
    console.log("here in remove");
    setRemoved(!removed);
  };
  const renderBookmarkedStories = (stories, seeMore) => {
    return stories.slice(0, seeMore ? stories.length : 4).map((story) => (
      <div key={story._id}>
        <Story
          story={story}
          storyUserId={story.userId}
          currentUserId={currentUserId}
          handleEdited={handleEdited}
          handleRemove={handleRemove}
          inBookmark={inBookmark}
        />
      </div>
    ));
  };

  const handleSeeMore = () => {
    setSeeMoreBookmarked((prevSeeMore) => !prevSeeMore);
  };

  return (
    <div className={styles.bokkmarkContainer}>
      {mobileViewHeader && (
        <div className={styles.mobileHeader}>
          {" "}
          <Header
            inBookmark={inBookmark}
            mobileViewHeader={mobileViewHeader}
            logoutThroughBookmark={logoutThroughBookmark}
          />
        </div>
      )}

      <div className={styles.desktopHeader}>
        {" "}
        <Header inBookmark={inBookmark} />
      </div>
      <div className={styles.yourBookmarkText}>Your Bookmarks</div>
      <div className={styles.storyContainer}>
        {renderBookmarkedStories(bookmarkedStories, seeMoreBookmarked)}
      </div>
      <div className={styles.moreBTn}>
        {bookmarkedStories.length > 4 && (
          <div className={styles.seeMoreButton} onClick={handleSeeMore}>
            {seeMoreBookmarked ? "See Less" : "See More"}
          </div>
        )}
      </div>
      {bookmarkedStories.length !== 0 && (
        <div className={styles.backToHomeBtnContainer}>
          <Link to="/">
            <button className={styles.backToHomeBtn}>Back to Home</button>
          </Link>
        </div>
      )}
      {bookmarkedStories.length === 0 && (
        <div className={styles.noBookmarkContainer}>
          {" "}
          <div className={styles.noStory}>You have no bookmarks! </div>
          <img
            src={NoBookmarkimage}
            className={styles.noBookmarkImage}
            alt=""
          />
          <Link to="/">
            <button className={styles.backToHomeBtn}>Back to Home</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookmarkStories;
