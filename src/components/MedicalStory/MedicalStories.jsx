import React, { useState, useEffect } from "react";
import Story from "../Story/Story";
import axios from "axios";
import styles from "../../pages/HomePage.module.css";

const MedicalStories = ({ userID, storiesUpdated }) => {
  const [medical, setMedicalStories] = useState([]);
  const [seeMoreMedical, setSeeMoreMedical] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const fetchMedicalStories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/story/category/Medical"
        );
        setMedicalStories(response.data);
      } catch (error) {
        console.error("Error fetching medical stories:", error);
      }
    };
    fetchMedicalStories();
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
    setSeeMoreMedical((prevSeeMore) => !prevSeeMore);
  };

  return (
    <div className={styles.categoryContainer}>
      <h2 className={styles.categoryTitle}>Top Stories about Medical</h2>
      <div className={styles.storyContainer}>
        {renderStories(medical, seeMoreMedical)}
      </div>
      <div className={styles.moreBTn}>
        {medical.length > 4 && (
          <div className={styles.seeMoreButton} onClick={handleSeeMore}>
            {seeMoreMedical ? "See Less" : "See More"}
          </div>
        )}
      </div>
      {medical.length === 0 && (
        <div className={styles.noStory}>No stories Available</div>
      )}
    </div>
  );
};

export default MedicalStories;
