const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  console.log(req.body)
  try {
    const existingUser = await User.findOne({email});
    if (existingUser) throw new Error("Email Already Exist");
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
    });
    await newUser.save();
    console.log(newUser);
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
};

exports.login = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const existingUser = await User.findOne({ email: Email });
    console.log(existingUser);
    if (!existingUser) throw new Error("Email doesn't Exist");
    const passwordMatched = await bcrypt.compare(
      Password,
      existingUser.password
    );
    if (!passwordMatched) throw new Error("Incorrect Password");
    console.log(existingUser);
    res.status(200).json(existingUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
