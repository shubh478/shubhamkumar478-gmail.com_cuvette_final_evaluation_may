const Story = require("../models/Story");

// Save Story
exports.saveStory = async (req, res) => {
  console.log("req.body :", req.body);
  try {
    const { userId, slides } = req.body;

    const story = new Story({ userId, slides });

    await story.save();

    res.status(201).json({ message: "Story saved successfully", story });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving story", error: error.message });
  }
};

// Get All Stories
exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().populate("userId", "username"); // Assuming you have a User model with 'username'
    res.status(200).json(stories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stories", error: error.message });
  }
};

// Get Stories by Category
exports.getStoriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const stories = await Story.find({ "slides.category": category });
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching stories by category",
      error: error.message,
    });
  }
};

// Get User Stories
exports.getUserStories = async (req, res) => {
  try {
    const { userId } = req.body;
    const stories = await Story.find({ userId });
    res.status(200).json(stories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user stories", error: error.message });
  }
};
// Edit Story
exports.editStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { slides } = req.body;

    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { slides },
      { new: true }
    );

    if (!updatedStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    res
      .status(200)
      .json({ message: "Story updated successfully", story: updatedStory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating story", error: error.message });
  }
};

exports.likeStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { userId } = req.body;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check if user already liked this story
    const alreadyLiked = story.likes.some(
      (like) => like.userId.toString() === userId
    );

    if (alreadyLiked) {
      // User already liked the story, so remove the like
      story.likes = story.likes.filter(
        (like) => like.userId.toString() !== userId
      );
      await story.save();
      return res.status(200).json({ message: "Story unliked successfully" });
    } else {
      // User has not liked the story, so add the like
      story.likes.push({ userId });
      await story.save();
      return res.status(200).json({ message: "Story liked successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error liking story", error: error.message });
  }
};

exports.bookmarkStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { userId } = req.body;

    const story = await Story.findById(storyId);

    // Check if user already bookmarked this story
    const alreadyBookmarkedIndex = story.bookmarks.findIndex(
      (bookmark) => bookmark.userId.toString() === userId
    );

    console.log("alreadyBookmarkedIndex :", alreadyBookmarkedIndex);

    if (alreadyBookmarkedIndex !== -1) {
      // User has already bookmarked the story, so remove the bookmark
      story.bookmarks.splice(alreadyBookmarkedIndex, 1);
      await story.save();
      return res
        .status(200)
        .json({ message: "Story unbookmarked successfully" });
    } else {
      // User has not bookmarked the story, so add the bookmark
      story.bookmarks.push({ userId });
      await story.save();
      return res.status(200).json({ message: "Story bookmarked successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error bookmarking story", error: error.message });
  }
};

exports.isStoryLiked = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { userId } = req.body;

    const story = await Story.findById(storyId);
    if (!story) {
      // If story is not found, send a custom response indicating that the story does not exist
      return res
        .status(200)
        .json({ isLiked: false, message: "Story not found" });
    }

    const isLiked = story.likes.some(
      (like) => like.userId.toString() === userId
    );

    res.status(200).json({ isLiked });
  } catch (error) {
    res.status(500).json({
      message: "Error checking if story is liked",
      error: error.message,
    });
  }
};

// Check if a story is bookmarked by a user
exports.isStoryBookmarked = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { userId } = req.body;

    const story = await Story.findById(storyId);
    if (!story) {
      // If story is not found, send a custom response indicating that the story does not exist
      return res
        .status(200)
        .json({ isBookmarked: false, message: "Story not found" });
    }

    const isBookmarked = story.bookmarks.some(
      (bookmark) => bookmark.userId.toString() === userId
    );

    res.status(200).json({ isBookmarked });
  } catch (error) {
    res.status(500).json({
      message: "Error checking if story is bookmarked",
      error: error.message,
    });
  }
};

exports.getBookmarkedStories = async (req, res) => {
  try {
    // Extract the user ID from the request
    const { userId } = req.body;

    // Find all stories where the user has bookmarked
    const bookmarkedStories = await Story.find({ "bookmarks.userId": userId });

    res.status(200).json({ bookmarkedStories });
  } catch (error) {
    console.error("Error fetching bookmarked stories:", error);
    res.status(500).json({ message: "Error fetching bookmarked stories" });
  }
};

exports.getLikesCount = async (req, res) => {
  console.log("rew :", req.params);
  try {
    const { storyId } = req.params;

    // Find the story by its ID
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Get the count of likes
    const likesCount = story.likes.length;

    console.log("likes count :", likesCount);

    res.status(200).json({ likesCount });
  } catch (error) {
    console.error("Error fetching likes count:", error);
    res.status(500).json({ message: "Error fetching likes count" });
  }
};
// controller/storyController.js

// Controller function to get a story by its ID
exports.getStoryById = async (req, res) => {
  console.log("rew :", req.params);
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId);
    console.log("req story :", story);
    if (!story) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }
    res.status(200).json({ success: true, story });
  } catch (error) {
    console.error("Error fetching story by ID:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
