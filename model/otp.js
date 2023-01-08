const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp:{
    type: Number,
    required: true,
  },
  expiretime:{
    type:Date,
    
  }
  

},);

const otp = mongoose.model("otp", otpSchema);
module.exports = otp;