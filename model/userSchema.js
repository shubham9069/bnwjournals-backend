const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
    min: 1111111111,
    max: 9999999999,
  },

  password: {
    type: String,
    required: true,
  },

  cpassword: {
    type: String,
    required: true,
  },
  tokens:[                                                                  // token are stored in array because new token genrate eact time user login  
    { 
      token:{
        type: String,
        required: true,
      }

  }
],


});

// hasing password it like middle ware

userSchema.pre("save", async function (next) {
    console.log("hii from ")
  if (this.isModified('password')) {
    this.password =  await bcrypt.hash(this.password, 12);
    this.cpassword =  await bcrypt.hash(this.cpassword, 12);
  }
  next();
});


// we are gfenrate jwt toke in array form and



const registration = mongoose.model("REGISTRATION", userSchema);

module.exports = registration;
