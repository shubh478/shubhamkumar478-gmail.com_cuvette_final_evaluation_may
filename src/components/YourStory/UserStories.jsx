import React, { useState, useEffect } from "react";
import Story from "../Story/Story";
import axios from "axios";
import styles from "../../pages/HomePage.module.css";
import editButton from "../../assets/editButton.png";
const UserStories = ({ userID, storiesUpdated }) => {
  const [userStories, setUserStories] = useState([]);
  const [seeMoreUser, setSeeMoreUser] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;
        if (!token) return;
        const response = await axios.get(
          "http://localhost:3000/api/v1/story/user-stories"
        );
        setUserStories(response.data);
        console.log("user story :", response.data);
      } catch (error) {
        console.error("Error fetching user stories:", error);
      }
    };
    fetchUserStories();
  }, [edited, storiesUpdated]);
  const handleEdited = () => {
    setEdited(true);
  };

  const renderStories = (stories, seeMore, currentUserID) => {
    return stories.slice(0, seeMore ? stories.length : 4).map((story) => (
      <div key={story._id}>
        <Story
          story={story}
          storyUserId={story.userId}
          currentUserId={userID}
          handleEdited={handleEdited}
        />
      </div>
    ));
  };

  const handleSeeMore = () => {
    setSeeMoreUser((prevSeeMore) => !prevSeeMore);
  };

  return (
    <div className={styles.categoryContainer}>
      <h2 className={styles.categoryTitle}>Your Stories</h2>
      <div className={styles.storyContainer}>
        {renderStories(userStories, seeMoreUser)}
      </div>
      <div className={styles.moreBTn}>
        {userStories.length > 4 && (
          <div className={styles.seeMoreButton} onClick={handleSeeMore}>
            {seeMoreUser ? "See Less" : "See More"}
          </div>
        )}
      </div>
      {userStories.length === 0 && (
        <div className={styles.noStory}>No stories Available</div>
      )}
    </div>
  );
};

export default UserStories;
