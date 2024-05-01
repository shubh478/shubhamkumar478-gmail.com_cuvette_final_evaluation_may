import React, { useEffect, useState } from "react";
import styles from "./AddStory.module.css";
import CrossIcon from "../../assets/CrossIcon.svg";
import axios from "axios";

function AddStory({ closePopup, initialStory, storyId, inBookmark }) {
  const [count, setCount] = useState(0);
  const [slides, setSlides] = useState(
    initialStory
      ? initialStory
      : [
          { heading: "", description: "", imageUrl: "", category: "" },
          { heading: "", description: "", imageUrl: "", category: "" },
          { heading: "", description: "", imageUrl: "", category: "" },
        ]
  );
  const [activeSlide, setActiveSlide] = useState(0);
  console.log("slide :", initialStory);
  console.log("activeSlide :", activeSlide);
  console.log("count :", count);

  const handleInputChange = (e, index) => {
    console.log("index :", index);
    console.log("active slide :", activeSlide);
    const { name, value } = e.target;
    const updatedSlides = [...slides];
    updatedSlides[index][name] = value;
    setSlides(updatedSlides);
  };

  const handleSlideClick = (index) => {
    setActiveSlide(index);
  };
  // useEffect(() => {}, [slides]);
  const handleSubmit = async () => {
    const isValid = slides.every(
      (slide) =>
        slide.heading && slide.description && slide.imageUrl && slide.category
    );

    if (isValid) {
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = token;
        if (!token) return;

        if (initialStory) {
          // If initialStory exists, call editStory endpoint
          await axios.put(
            `http://localhost:3000/api/v1/story/editStory/${storyId}`,
            {
              slides,
            }
          );
          console.log("Story edited successfully");
        } else {
          // If initialStory doesn't exist, call saveStory endpoint
          await axios.post("http://localhost:3000/api/v1/story/saveStory", {
            slides,
          });
          console.log("Story posted successfully");
        }
        closePopup();
      } catch (error) {
        console.error("Error:", error);
        alert("Error processing the request. Please try again.");
      }
    } else {
      alert("Please fill in details for all slides.");
    }
  };

  const handleAddSlide = () => {
    console.log("slides.length :", slides.length);
    setSlides([
      ...slides,
      { heading: "", description: "", imageUrl: "", category: "" },
    ]);

    setActiveSlide(slides.length);
  };

  const handleRemoveSlide = (index, e) => {
    e.stopPropagation(); // Stop event propagation to prevent calling handleSlideClick

    const updatedSlides = slides.filter((_, i) => i !== index);

    // Decrement activeSlide by 1
    setActiveSlide((prevActiveSlide) => {
      return Math.max(prevActiveSlide - 1, 0); // Ensure activeSlide doesn't go below 0
    });

    setSlides(updatedSlides);
  };

  const handlePrevSlide = () => {
    console.log("slides.length :", activeSlide);
    setActiveSlide(activeSlide > 0 ? activeSlide - 1 : 0);
  };

  const handleNextSlide = () => {
    console.log("slides.length :", activeSlide);
    setActiveSlide(
      activeSlide < slides.length - 1 ? activeSlide + 1 : slides.length - 1
    );
  };
  const handleClosePopup = () => {
    closePopup(); // Call the closePopup function passed from Header.jsx
  };

  const categories = ["Medical", "Fruits", "World", "India"];

  return (
    <div className={styles.container}>
      <img
        src={CrossIcon}
        className={styles.closePopup}
        onClick={handleClosePopup}
        alt=""
      />
      <div className={styles.limitSlideText}>Add upto 6 slides</div>
      <div className={styles.addFeedText}>Add story to feed</div>
      <div className={styles.slidenDetailsContainer}>
        <div className={styles.slideContainer}>
          {slides.map((slide, index) => (
            <div
              key={index}
              onClick={() => handleSlideClick(index)}
              className={`${styles.slide} ${
                activeSlide === index ? styles.activeSlide : ""
              }`}
            >
              Slide {index + 1}
              {index >= 3 && (
                <img
                  src={CrossIcon}
                  alt="Remove Slide"
                  className={styles.removeSlide}
                  onClick={(e) => handleRemoveSlide(index, e)}
                />
              )}
            </div>
          ))}
          {slides.length < 6 && (
            <div className={styles.slide} onClick={handleAddSlide}>
              Add+
            </div>
          )}
        </div>

        <div className={styles.detailsContainer}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Heading:</label>
            <input
              type="text"
              id="heading"
              name="heading"
              value={slides[activeSlide].heading}
              onChange={(e) => handleInputChange(e, activeSlide)}
              placeholder="Your heading"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Description:</label>
            <textarea
              id="description"
              name="description"
              value={slides[activeSlide].description}
              onChange={(e) => handleInputChange(e, activeSlide)}
              placeholder="Story Description"
              className={styles.textarea}
            ></textarea>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="imageUrl" className={styles.label}>
              Image URL:
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={slides[activeSlide].imageUrl}
              onChange={(e) => handleInputChange(e, activeSlide)}
              placeholder="Add Image URL"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="category" className={styles.label}>
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={slides[activeSlide].category}
              onChange={(e) => handleInputChange(e, activeSlide)}
              className={styles.select}
              placeholder="Select category"
            >
              <option value="" hidden>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.btn}>
        <div className={styles.prevNext}>
          <button onClick={handlePrevSlide} className={styles.prev}>
            Previous
          </button>
          <button onClick={handleNextSlide} className={styles.next}>
            Next
          </button>
        </div>
        <div className={styles.post}>
          <button onClick={handleSubmit} className={styles.postBtn}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddStory;
