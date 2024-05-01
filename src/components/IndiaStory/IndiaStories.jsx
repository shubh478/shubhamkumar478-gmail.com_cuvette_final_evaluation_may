import React, { useState, useEffect } from "react";
import Story from "../Story/Story";
import axios from "axios";
import styles from "../../pages/HomePage.module.css";

const IndiaStories = ({ userID, storiesUpdated }) => {
  const [india, setIndiaStories] = useState([]);
  const [seeMoreIndia, setSeeMoreIndia] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const fetchIndiaStories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/story/category/India"
        );
        setIndiaStories(response.data);
      } catch (error) {
        console.error("Error fetching India stories:", error);
      }
    };
    fetchIndiaStories();
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
    setSeeMoreIndia((prevSeeMore) => !prevSeeMore);
  };

  return (
    <div className={styles.categoryContainer}>
      <h2 className={styles.categoryTitle}>Top Stories about India</h2>
      <div className={styles.storyContainer}>
        {renderStories(india, seeMoreIndia)}
      </div>
      <div className={styles.moreBTn}>
        {india.length > 4 && (
          <div className={styles.seeMoreButton} onClick={handleSeeMore}>
            {seeMoreIndia ? "See Less" : "See More"}
          </div>
        )}
      </div>
      {india.length === 0 && (
        <div className={styles.noStory}>No stories Available</div>
      )}
    </div>
  );
};

export default IndiaStories;
