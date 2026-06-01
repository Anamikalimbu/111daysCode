const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// ─────────────────────────────────────────
// GET /api/notes — Get all notes
// Supports ?search=query for live search
// Pinned notes always come first
// ─────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    // If search query provided, filter by title or content
    if (search && search.trim() !== "") {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Pinned notes first, then by newest
    const notes = await Note.find(filter).sort({
      isPinned: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching notes",
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────
// GET /api/notes/:id — Get single note
// ─────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching note",
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────
// POST /api/notes — Create a new note
// ─────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { title, content, color, isPinned, tags } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      title,
      content,
      color,
      isPinned,
      tags,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while creating note",
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────
// PUT /api/notes/:id — Update a note
// ─────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const { title, content, color, isPinned, tags } = req.body;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, color, isPinned, tags },
      {
        new: true,          // return updated document
        runValidators: true, // run schema validators on update
      }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while updating note",
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────
// PATCH /api/notes/:id/pin — Toggle pin
// ─────────────────────────────────────────
router.patch("/:id/pin", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({
      success: true,
      message: `Note ${note.isPinned ? "pinned" : "unpinned"} successfully`,
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while toggling pin",
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────
// DELETE /api/notes/:id — Delete a note
// ─────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while deleting note",
      error: error.message,
    });
  }
});

module.exports = router;