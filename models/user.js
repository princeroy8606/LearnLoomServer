const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, reqired: true },
  email: { type: String, reqired: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  courses:[{type:mongoose.Types.ObjectId, ref:"Course"}],
  cart :[{type:mongoose.Types.ObjectId, ref:"Course"}]
});

const User = mongoose.model("User", userSchema);
module.exports = User;
