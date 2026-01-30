const express = require("express");
const router = express.Router();
const { addTask, getTasksByDate, markDone, deleteTask } = require("../controllers/taskController");

router.post("/", addTask);
router.get("/", getTasksByDate);
router.patch("/:id/done", markDone);
router.delete("/:id", deleteTask);

module.exports = router;
