import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import styles from "./ShareStory.module.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CloseStoryIcon from "../../assets/CloseStoryIcon.png";
import ShareStoryIcon from "../../assets/ShareStoryIcon.svg";
import LikeStory from "../../assets/LikeStory.svg";
import BookmarkStory from "../../assets/BookmarkStory.svg";
import LeftArrow from "../../assets/LeftArrow.svg";
import RightArrow from "../../assets/RightArrow.svg";
import BookmarkedIcon from "../../assets/BookmarkedIcon.svg";
import StoryLikedIcon from "../../assets/StoryLikedIcon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Login from "../../components/Login/Login";

const ShareStory = () => {
  const { storyId } = useParams();
  const [stories, setStory] = useState();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/story/${storyId}`
        );
        setStory(response.data.story.slides);
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        toast.error("An error occurred while fetching story details");
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchStoryDetails();
  }, [storyId]);
  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;
        if (!token) {
          setIsBookmarked(false);
          setIsLiked(false);
          return;
        }
        const [bookmarkResponse, likeResponse] = await Promise.all([
          axios.get(
            `http://localhost:3000/api/v1/story/is-bookmarked/${storyId}`
          ),
          axios.get(`http://localhost:3000/api/v1/story/is-liked/${storyId}`),
        ]);
        setIsBookmarked(bookmarkResponse.data.isBookmarked);
        setIsLiked(likeResponse.data.isLiked);
      } catch (err) {
        toast.error("An error occurred while fetching story details");
      }
    };

    fetchStoryDetails();
  }, [storyId]);

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/story/likes-count/${storyId}`
        );
        setLikesCount(response.data.likesCount);
      } catch (err) {
        toast.error("An error occurred while fetching likes count");
      }
    };

    fetchLikesCount();
  }, [isLiked, storyId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(progress + 1);
      } else {
        if (currentSlideIndex < stories.length - 1) {
          setCurrentSlideIndex(currentSlideIndex + 1);
          setProgress(0);
        } else if (currentSlideIndex === stories.length - 1) {
          closeStoryPopup();
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [progress, currentSlideIndex, stories]);

  const closeStoryPopup = () => {
    navigate("/");
  };

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowLogin(!showLogin);
        navigate("/", { state: { shouldShowLogin: true } });
        return;
      }
      setIsBookmarked(!isBookmarked);
      await axios.post(
        `http://localhost:3000/api/v1/story/bookmark/${storyId}`
      );
    } catch (error) {
      toast.error("An error occurred while bookmarking the story");
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowLogin(!showLogin);
        navigate("/", { state: { shouldShowLogin: true } });
        return;
      }
      setIsLiked(!isLiked);
      // Send a request to like the story
      await axios.post(`http://localhost:3000/api/v1/story/like/${storyId}`);
      // Fetch the updated likes count after the like operation
      const response = await axios.get(
        `http://localhost:3000/api/v1/story/likes-count/${storyId}`
      );
      // Update the likes count state with the new value
      setLikesCount(response.data.likesCount);
    } catch (error) {
      toast.error("An error occurred while liking the story");
    }
  };
  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };
  const handleShare = () => {
    // Get the ID of the current story
    if (linkCopied) return;
    setLinkCopied(!linkCopied);
    const storyLink = `http://localhost:5173/viewStory/${storyId}`;
    navigator.clipboard.writeText(storyLink);
    toast.success("Link copied to clipboard");
  };
  const handleSlideTap = (e) => {
    const containerWidth = e.currentTarget.offsetWidth;
    const clickX = e.nativeEvent.offsetX;
    const leftThreshold = containerWidth * 0.3;
    const rightThreshold = containerWidth * 0.7;
    if (clickX < leftThreshold) {
      if (currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);
        setProgress(0);
      } else {
        setCurrentSlideIndex(stories.length - 1);
        setProgress(0);
      }
    } else if (clickX > rightThreshold) {
      if (currentSlideIndex < stories.length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
        setProgress(0);
      } else {
        setCurrentSlideIndex(0);
        setProgress(0);
      }
    }
  };
  return (
    <div className={styles.container}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.storiesContainer}>
          <img
            src={LeftArrow}
            alt=""
            onClick={() => {
              if (currentSlideIndex > 0) {
                setCurrentSlideIndex(currentSlideIndex - 1);
                setProgress(0);
              }
            }}
            className={styles.navigation}
          />
          <div
            className={styles.slideContainer}
            onClick={window.innerWidth <= 480 ? handleSlideTap : null}
          >
            <div className={styles.firstContainer}>
              <div className={styles.progressBarContainer}>
                {stories.map((_, index) => (
                  <div
                    className={styles.progressBar}
                    key={index}
                    style={{ width: `${100 / stories.length}%` }}
                  >
                    {currentSlideIndex === index && (
                      <div
                        className={styles.fillBar}
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.CloseShareStory}>
                <img
                  src={CloseStoryIcon}
                  alt=""
                  className={styles.CloseStoryIcon}
                  onClick={closeStoryPopup}
                />
                <img src={ShareStoryIcon} alt="" onClick={handleShare} />
              </div>
            </div>
            <img
              className={styles.slideImage}
              src={stories[currentSlideIndex].imageUrl}
              alt={`Slide ${currentSlideIndex + 1}`}
            />
            <div className={styles.secondContainer}>
              {linkCopied && (
                <div className={styles.linkCopied}>
                  Link copied to clipboard
                </div>
              )}
              <div className={styles.textContainer}>
                <div className={styles.heading}>
                  {stories[currentSlideIndex].heading}
                </div>
                <div className={styles.description}>
                  {stories[currentSlideIndex].description}
                </div>
              </div>
              <div className={styles.bookmarkLikeContainer}>
                <img
                  src={isBookmarked ? BookmarkedIcon : BookmarkStory}
                  onClick={handleBookmark}
                  alt=""
                />
                <div className={styles.likeContainer}>
                  {isLiked ? (
                    <FontAwesomeIcon
                      icon={faHeart}
                      onClick={handleLike}
                      className={styles.heartIcon}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faHeart}
                      onClick={handleLike}
                      className={styles.heartIconNotLiked}
                    />
                  )}
                  <span className={styles.likeCount}>{likesCount}</span>
                </div>
              </div>
            </div>
          </div>
          <img
            src={RightArrow}
            onClick={() => {
              if (currentSlideIndex < stories.length - 1) {
                setCurrentSlideIndex(currentSlideIndex + 1);
                setProgress(0);
              }
            }}
            className={styles.navigation}
          />
        </div>
      )}
      {showLogin && (
        <div className={styles.login}>
          <Login toggleLogin={toggleLogin} />
        </div>
      )}
    </div>
  );
};

export default ShareStory;
