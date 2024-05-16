const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName: { type: String },
  description: { type: String },
  fees: { type: Number },
  target: [{ type: String }],
  outcomes: [{ type: String }],
  thubnail: { type: String },
  enrolled: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
