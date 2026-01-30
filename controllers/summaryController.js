const DailySummary = require("../models/DailySummary");

// Helper: normalize date to local midnight
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get daily summary (single day)
exports.getDailySummary = async (req, res) => {
  try {
    const day = normalizeDate(req.query.date);
    const summary = await DailySummary.findOne({ date: day });
    res.json(summary || {
      date: day,
      totalTasks: 0,
      completedTasks: 0,
      completionColor: "yellow",
      isFullyCompleted: false
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all summaries (for calendar)
exports.getAllSummaries = async (req, res) => {
  try {
    const summaries = await DailySummary.find({});
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get month summary
exports.getMonthSummary = async (req, res) => {
  try {
    const { year, month } = req.query;
    const start = normalizeDate(new Date(year, month - 1, 1));
    const end = normalizeDate(new Date(year, month, 0));
    end.setHours(23, 59, 59, 999);

    const summaries = await DailySummary.find({ date: { $gte: start, $lte: end } });

    const totalDaysInMonth = new Date(year, month, 0).getDate();

    const days = summaries.map(s => ({
      date: s.date.toISOString().slice(0,10),
      totalTasks: s.totalTasks,
      completedTasks: s.completedTasks,
      isFullyCompleted: s.isFullyCompleted
    }));

    res.json(days); // return just days array for frontend
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get year summary
exports.getYearSummary = async (req, res) => {
  try {
    const { year } = req.query;
    const start = normalizeDate(new Date(year, 0, 1));
    const end = normalizeDate(new Date(year, 11, 31));
    end.setHours(23, 59, 59, 999);

    const summaries = await DailySummary.find({ date: { $gte: start, $lte: end } });

    const data = summaries.map(s => ({
      date: s.date.toISOString().slice(0,10),
      totalTasks: s.totalTasks,
      completedTasks: s.completedTasks,
      isFullyCompleted: s.isFullyCompleted
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get consistency / streak
exports.getConsistency = async (req, res) => {
  try {
    res.json({ message: "Not implemented yet" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
