const mongoose = require("mongoose");

const dailySummarySchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  totalTasks: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  completionColor: { type: String, default: "yellow" },
  isFullyCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("DailySummary", dailySummarySchema);
