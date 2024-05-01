import React, { useState, useEffect } from "react";
import Story from "../Story/Story";
import axios from "axios";
import styles from "../../pages/HomePage.module.css";

const FruitsStories = ({ userID, storiesUpdated }) => {
  const [fruits, setFruitsStories] = useState([]);
  const [seeMoreFruits, setSeeMoreFruits] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const fetchFruitsStories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/story/category/Fruits"
        );
        setFruitsStories(response.data);
      } catch (error) {
        console.error("Error fetching fruits stories:", error);
      }
    };
    fetchFruitsStories();
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
    setSeeMoreFruits((prevSeeMore) => !prevSeeMore);
  };

  return (
    <div className={styles.categoryContainer}>
      <h2 className={styles.categoryTitle}>Top Stories about Fruits</h2>
      <div className={styles.storyContainer}>
        {renderStories(fruits, seeMoreFruits)}
      </div>
      <div className={styles.moreBTn}>
        {fruits.length > 4 && (
          <div className={styles.seeMoreButton} onClick={handleSeeMore}>
            {seeMoreFruits ? "See Less" : "See More"}
          </div>
        )}
      </div>
      {fruits.length === 0 && (
        <div className={styles.noStory}>No stories Available</div>
      )}
    </div>
  );
};

export default FruitsStories;
