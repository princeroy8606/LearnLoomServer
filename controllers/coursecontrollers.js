const Courses = require("../models/Courses");
const Razorpay = require("razorpay");
const User = require("../models/user");

const razorpay = new Razorpay({
  key_id: "rzp_test_BVclXIQdCra5rg",
  key_secret: "h2Jn175k8jOELH27bEys1CvG",
});

exports.addNew = async (req, res) => {
  const { Name, Description, Fees, Target, Outcomes, Img } = req.body;
  try {
    const newCourse = new Courses({
      courseName: Name,
      description: Description,
      fees: Fees,
      outcomes: Outcomes,
      target: Target,
      thubnail: Img,
    });
    await newCourse.save();
    res.status(200).json(newCourse);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Courses.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.buyCourse = async (req, res) => {
  const { userId, CourseId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("Invalid User Details");
    const IdArrayJson = JSON.stringify(CourseId);
    const razoroptions = {
      amount: 10000 * 100,
      currency: "INR",
      receipt: "receipt#2",
      notes: {
        userId,
        IdArrayJson,
      },
    };
    const response = await razorpay.orders.create(razoroptions);
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.PyementSuccess = async (req, res) => {
  const { data, payment_intent } = req.body;
  const CourseId = JSON.parse(data?.IdArrayJson);
  try {
    const user = await User.findById(data?.userId);
    await Promise.all(
      CourseId.map(async (id) => {
        const course = await Courses.findById(id);
        if (!course) throw new Error(`Course with id ${id} not found`);
        course.enrolled.push(user._id);
        if (user.cart.includes(course?._id)) user.cart.splice(course._id);
        user.courses.push(course._id);
        await course.save();
      })
    );
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToCart = async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("Invalid User Details");
    const course = await Courses.findById(courseId);
    if (!course) throw new Error("Invalid Course Details");
    user.cart.push(course?._id);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.removeFromCart = async (req, res) => {
  const { userId, courseId } = req.body;
  console.log("start remove action");
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("Invalid User Details");
    const course = await Courses.findById(courseId);
    if (!course) throw new Error("Invalid Course Details");
    const index = user.cart.indexOf(courseId);
    if (index === -1) {
      throw new Error("Course not found in the user's cart");
    }
    user.cart.splice(courseId, 1);
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getCart = async (req, res) => {
  const userId = req.params.id;
  try {
    const cart = await User.findById(userId).populate("cart");
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json(err);
  }
};
