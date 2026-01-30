const express = require("express");
const router = express.Router();

const {
  getDailySummary,
  getAllSummaries,
  getMonthSummary,
  getYearSummary
} = require("../controllers/summaryController");

// Daily donut
router.get("/daily-summary", getDailySummary);

// Calendar
router.get("/calendar", getAllSummaries);

// Month donut
router.get("/month-summary", getMonthSummary);

// Year donut
router.get("/year-summary", getYearSummary);

module.exports = router;
