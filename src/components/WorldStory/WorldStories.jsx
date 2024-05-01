import React, { useState, useEffect } from "react";
import Story from "../Story/Story";
import axios from "axios";
import styles from "../../pages/HomePage.module.css";

const WorldStories = ({ userID, storiesUpdated }) => {
  const [world, setWorldStories] = useState([]);
  const [seeMoreWorld, setSeeMoreWorld] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const fetchWorldStories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/story/category/World"
        );
        setWorldStories(response.data);
      } catch (error) {
        console.error("Error fetching world stories:", error);
      }
    };
    fetchWorldStories();
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
    setSeeMoreWorld((prevSeeMore) => !prevSeeMore);
  };

  return (
    <div className={styles.categoryContainer}>
      <h2 className={styles.categoryTitle}>Top Stories about World</h2>
      <div className={styles.storyContainer}>
        {renderStories(world, seeMoreWorld)}
      </div>
      <div className={styles.moreBTn}>
        {world.length > 4 && (
          <div className={styles.seeMoreButton} onClick={handleSeeMore}>
            {seeMoreWorld ? "See Less" : "See More"}
          </div>
        )}
      </div>
      {world.length === 0 && (
        <div className={styles.noStory}>No stories Available</div>
      )}
    </div>
  );
};

export default WorldStories;
