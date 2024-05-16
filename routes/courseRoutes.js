const express = require("express");

const router = express.Router();

const CoursesContrl = require("../controllers/coursecontrollers");

router.post("/new", CoursesContrl.addNew);
router.get("/all", CoursesContrl.getAllCourses);
router.post("/buyOne", CoursesContrl.buyCourse);
router.post("/payment-success", CoursesContrl.PyementSuccess);
router.get("/cart/:id", CoursesContrl.getCart);
router.post("/cart/add", CoursesContrl.addToCart);
router.post("/cart/remove", CoursesContrl.removeFromCart);

module.exports = router;
