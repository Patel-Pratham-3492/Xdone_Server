const Task = require("../models/Task");
const DailySummary = require("../models/DailySummary");

// Helper: normalize date to local midnight
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // local midnight
  return d;
};

// Helper: update daily summary for a given date
const updateDailySummary = async (date) => {
  if (!date) return;

  const dayStart = normalizeDate(date);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  const tasks = await Task.find({ date: { $gte: dayStart, $lte: dayEnd } });
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const isFullyCompleted = totalTasks > 0 && totalTasks === completedTasks;

  let completionColor = "yellow";
  const ratio = totalTasks === 0 ? 0 : completedTasks / totalTasks;
  if (ratio === 1) completionColor = "green";
  else if (ratio >= 0.5) completionColor = "lightGreen";
  else if (ratio > 0) completionColor = "orange";

  await DailySummary.findOneAndUpdate(
    { date: dayStart },
    { totalTasks, completedTasks, completionColor, isFullyCompleted },
    { upsert: true }
  );
};

// Add new task
exports.addTask = async (req, res) => {
  try {
    const { title, date } = req.body;

    const taskDate = normalizeDate(date);
    const task = await Task.create({ title, date: taskDate });
    await updateDailySummary(taskDate);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tasks for a specific date
exports.getTasksByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const dayStart = normalizeDate(date);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const tasks = await Task.find({ date: { $gte: dayStart, $lte: dayEnd } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark task as done
exports.markDone = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "done", completedAt: new Date() },
      { new: true }
    );

    if (task) await updateDailySummary(task.date);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update task (including changing date)
exports.updateTask = async (req, res) => {
  try {
    const { title, date, status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const oldDate = task.date;

    // Update task fields
    task.title = title !== undefined ? title : task.title;
    task.date = date !== undefined ? normalizeDate(date) : task.date;
    task.status = status !== undefined ? status : task.status;

    await task.save();

    // Update old date summary and new date summary if date changed
    await updateDailySummary(oldDate);
    if (date && normalizeDate(date).getTime() !== oldDate.getTime()) {
      await updateDailySummary(date);
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) await updateDailySummary(task.date);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
