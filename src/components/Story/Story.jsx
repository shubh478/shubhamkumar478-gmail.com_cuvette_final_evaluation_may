import React, { useEffect, useState } from "react";
import styles from "./Story.module.css";
import Stories from "../StoryPopup/Stories";
import editButton from "../../assets/editButton.png";
import AddStory from "../AddStory/AddStory";
const Story = ({
  story,
  storyUserId,
  currentUserId,
  handleEdited,
  handleRemove,
  inBookmark,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [showStories, setShowStories] = useState(false);
  const [initialStory, setInitialStory] = useState([]);
  const [storyId, setStoryId] = useState(story._id);

  const [openAddStory, setOpenAddStory] = useState(false);
  useEffect(() => {
    console.log("story :", story);
  }, [story]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserId("someUserId");
  };

  const handleSlideClick = () => {
    setShowStories(!showStories);
  };
  const handleEdit = (event, storyId) => {
    event.stopPropagation(); // Stop event propagation

    setInitialStory(story.slides);

    setOpenAddStory(true);
  };
  const toggleAddStory = () => {
    handleEdited();
    setOpenAddStory(false); // Toggle the visibility of AddStory
  };
  const handleBookmarkRemoveStory = () => {
    console.log("here in story");
    if (inBookmark) handleRemove();
    return;
  };
  return (
    <div className={styles.storyContainer}>
      <div className={styles.slide} onClick={handleSlideClick}>
        <div className={styles.textContainer}>
          <div className={styles.slideHeading}>{story.slides[0].heading}</div>
          <div className={styles.slideDescription}>
            {story.slides[0].description}
          </div>
        </div>
        <img
          src={story.slides[0].imageUrl}
          alt={story.slides[0].heading}
          className={styles.storyImage}
        />
        {storyUserId === currentUserId && (
          <div
            onClick={(e) => handleEdit(e, story._id)}
            className={styles.editButton}
          >
            <div className={styles.edit}>
              <img src={editButton} alt="" />
              <div>Edit</div>
            </div>
          </div>
        )}
      </div>

      {showStories && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <Stories
              stories={story.slides.map((slide) => slide)}
              handleSlideClick={handleSlideClick}
              storyUserId={story._id}
              inBookmark={inBookmark}
              handleBookmarkRemoveStory={handleBookmarkRemoveStory}
            />
          </div>
        </div>
      )}
      {openAddStory && (
        <div className={styles.addStoryPopup}>
          <div className={styles.addStoryContent}>
            <AddStory
              closePopup={toggleAddStory}
              initialStory={initialStory}
              storyId={storyId}
            />{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default Story;
