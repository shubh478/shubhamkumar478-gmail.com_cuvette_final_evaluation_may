import React, { useState } from "react";
import styles from "./Filter.module.css";
import AllImage from "../../assets/AllImage.svg";
import MedicalImage from "../../assets/MedicalImage.svg";
import FruitsImage from "../../assets/FruitsImage.svg";
import WorldImage from "../../assets/WorldImage.svg";

function Filter({ handleFilter }) {
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleFilterClick = (image) => {
    handleFilter(image);
    setSelectedFilter(image);
  };

  return (
    <div className={styles.filterContainer}>
      <div
        className={`${styles.filterItem} ${
          selectedFilter === "All" ? styles.selected : ""
        }`}
        onClick={() => handleFilterClick("All")}
      >
        <img src={WorldImage} alt="" className={styles.filterImage} />
        <span className={styles.filterText}>All</span>
      </div>
      <div
        className={`${styles.filterItem} ${
          selectedFilter === "Medical" ? styles.selected : ""
        }`}
        onClick={() => handleFilterClick("Medical")}
      >
        <img src={MedicalImage} alt="" className={styles.filterImage} />
        <span className={styles.filterText}>Medical</span>
      </div>
      <div
        className={`${styles.filterItem} ${
          selectedFilter === "Fruits" ? styles.selected : ""
        }`}
        onClick={() => handleFilterClick("Fruits")}
      >
        <img src={FruitsImage} alt="" className={styles.filterImage} />
        <span className={styles.filterText}>Fruits</span>
      </div>
      <div
        className={`${styles.filterItem} ${
          selectedFilter === "World" ? styles.selected : ""
        }`}
        onClick={() => handleFilterClick("World")}
      >
        <img src={WorldImage} alt="" className={styles.filterImage} />
        <span className={styles.filterText}>World</span>
      </div>
      <div
        className={`${styles.filterItem} ${
          selectedFilter === "India" ? styles.selected : ""
        }`}
        onClick={() => handleFilterClick("India")}
      >
        <img src={WorldImage} alt="" className={styles.filterImage} />
        <span className={styles.filterText}>India</span>
      </div>
    </div>
  );
}

export default Filter;
