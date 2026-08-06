const express = require("express");
const router = express.Router();

const {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
} = require("../controllers/leadController");

const authMiddleware = require("../middleware/authMiddleware");

// Public route (anyone can submit a lead)
router.post("/", createLead);

// Protected routes (admin only)
router.get("/", authMiddleware, getLeads);
router.put("/:id", authMiddleware, updateLeadStatus);
router.delete("/:id", authMiddleware, deleteLead);

module.exports = router;
