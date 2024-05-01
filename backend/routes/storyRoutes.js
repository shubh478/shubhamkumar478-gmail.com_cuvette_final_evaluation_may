const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyControllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/saveStory", authMiddleware, storyController.saveStory);

router.get("/all-stories", storyController.getAllStories);

router.get("/category/:category", storyController.getStoriesByCategory);

router.get("/user-stories", authMiddleware, storyController.getUserStories);
router.put("/editStory/:storyId", storyController.editStory);

router.post("/like/:storyId", authMiddleware, storyController.likeStory);

router.post(
  "/bookmark/:storyId",
  authMiddleware,
  storyController.bookmarkStory
);

router.get("/is-liked/:storyId", authMiddleware, storyController.isStoryLiked);

router.get(
  "/is-bookmarked/:storyId",
  authMiddleware,
  storyController.isStoryBookmarked
);
router.get("/bookmarked", authMiddleware, storyController.getBookmarkedStories);

router.get("/likes-count/:storyId", storyController.getLikesCount);
router.get("/:storyId", storyController.getStoryById);
module.exports = router;
