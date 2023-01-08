const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const Router = express.Router();
require("../db/connection");
const registration = require("../model/userSchema");
const Resetotp = require("../model/otp");
const servicesdb = require("../model/services");
const category = require("../model/Categoryschema");
const contactus_query = require("../model/Query");
const { basic, standard, premium } = require("../model/Price");
const bcrypt = require("bcrypt");
const authentication = require("../middleware/authentication");
const cookieParser = require("cookie-parser");
const sendemail = require("../sendmail");
const multer = require("multer");


Router.use(cookieParser());

Router.get("/", (req, res) => {
  res.send("Welcome to auth js");
});

Router.post("/registeremailverification", async (req, res) => {
  const { email, phone } = req.body;

  let cotp = Math.floor(Math.random() * 1000000 + 1);

  try {
    const userExist = await registration.findOne({
      email: email.toLowerCase(),
    }); // check email exists or not // check email number or not

    if (userExist) {
      return res
        .status(404)
        .json({ status: "error", message: "email already exist" });
    } else {
      const resetotp = new Resetotp({
        email: email.toLowerCase(),
        otp: cotp,

        expiretime: new Date().getTime() + 1000 * 1800,
      });
      await resetotp.save();
      await sendemail.registration(email.toLowerCase(), cotp);
      return res
        .status(200)
        .json({ status: "success", message: "message is sent " });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "internal issue from backend" + err });
  }
});

// registration new entry

Router.post("/register", async (req, res) => {
  const { name, email, phone, password, cpassword, otp } = req.body;

  try {
    {
      let data = await Resetotp.findOne({
        email: email.toLowerCase(),
        otp: otp,
      });
      //  let jdata =  JSON.parse(data)
      // console.log(data[0].expiretime)             // its is in array form gives data
      if (!data) {
        return res.status(404).json({
          status: "error",
          message: "otp and email doesnot match plz check again  ",
        });
      } else {
        let currentime = new Date().getTime();
        let time = data.expiretime - currentime;
        if (time < 0) {
          return res
            .status(404)
            .json({ status: "error", message: "time limit exceed" });
        } else {
          const Registration = new registration({
            name,
            email: email.toLowerCase(),
            phone,
            password,
            cpassword,
          });
          //yaha pe password hasing ka use hog save se phele         // hashing
          await Registration.save();
          res.status(200).json({
            status: "success",
            message: ` ${Registration.name}  success`,
          });
        }
      }
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "internal issue from backend  " });
  }
});

// login routes

Router.post("/login", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userLogin = await registration.findOne({
      email: email.toLowerCase(),
    });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        return res
          .status(404)
          .json({ status: "error", message: "invalid details credential" }); // for password
      } else {
         // jwt token authrentication token
         const accessToken = jwt.sign(
          { "user_id":userLogin._id},
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn:'60s'}
         )
         const refreshToken = jwt.sign(
          { "user_id":userLogin._id},
          process.env.REFRESH_TOKEN_SECRET,
          {expiresIn:'1d'}
         )

         userLogin.tokens.push({token:refreshToken});
         userLogin.save();
          
        res.cookie("jwtoken",refreshToken , {domain:'localhost:3000', sameSite:'none',secure:true, maxAge:1000*24*60*60 });
        return res.status(200).json({
          status: "success",
          message: `${userLogin.name} user successfull`,
          accessToken:accessToken
        });
      }
    } else {
      return res
        .status(404)
        .json({ status: "error", message: " invalid details credential" }); //for mail
    }
  } catch (err) {
    return res
      .status(404)
      .json({ status: "error", message: "internal issue from backend "+err });
  }
});

// logout routes

Router.get("/logout",async (req, res) => {
  const cookies = req.cookies;
  try {
    if(!cookies?.jwtoken) return res.status(404).json({message: "you are not login yet "})
    const refreshToken = cookies.jwtoken;
    const user= await registration.findOne({"tokens.token":refreshToken});

    const a = user.tokens.filter((currelement) => {
      return currelement.token !== refreshToken;});

      user.tokens=a
      user.save();

res.clearCookie("jwtoken", { path: "/" ,domain: 'localhost:3000',sameSite:'none',secure:true,});

    // if we want logout from all device then we need to delete all token so we use unset to delete token field

    return res
      .status(200)
      .json({ status: "success", message: "user logged out successfully " });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "internal error from backend"+err });
  }
});

//logout all
Router.get("/alllogout", async (req, res) => {
  const cookies = req.cookies;
  try {
    if(!cookies?.jwtoken) return res.status(404).json({message: "you are not login yet "})
    
    const refreshToken = cookies.jwtoken;
    const user= await registration.findOne({"tokens.token":refreshToken});
    user.tokens=[]
      user.save();

      
    res.clearCookie("jwtoken", { path: "/",domain: 'localhost:3000', sameSite:'none',secure:true,});

    // if we want logout from all device then we need to delete all token so we use unset to delete token field
    return res.status(200).json({
      status: "success",
      message: "user logged out successfully from all devices ",
    });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "internal error from backend" });
  }
});

// refresh token controller 

Router.get("/refreshtoken",async (req, res) => {
  const cookies= req.cookies;
  if(!cookies?.jwtoken) return res.status(404).json({message:" you are not login"});
  const refreshToken = cookies.jwtoken;
  const user= await registration.findOne({"tokens.token":refreshToken});
  
  if(!user) return res.status(404).json("invalid data in cookies user not found ");
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err,decoded)=>{
      
      if(err || user.id!==decoded.user_id ) return res.status(501).json({message:"token is not verify or expire "});
      const accessToken = jwt.sign(
        { "user_id":decoded.user_id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'60s'}
       )
        return res.status(200).json({accessToken})
    }
  )})
// email verification

Router.post("/login/emailverification", async (req, res) => {
  const { email } = req.body;

  let cotp = Math.floor(Math.random() * 1000000 + 1);

  try {
    const User = await registration.findOne({ email: email.toLowerCase() });

    if (User) {
      const resetotp = new Resetotp({
        email: email.toLowerCase(),
        otp: cotp,

        expiretime: new Date().getTime() + 1000 * 1800,
      });
      await resetotp.save();
      await sendemail.emailverificationforreset(email.toLowerCase(), cotp, User.name);
      return res
        .status(200)
        .json({ status: "success", message: "message is sent system" });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "user not found " });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "internal issue from backend" });
  }
});

// resert password

Router.post("/login/resetpassword", async (req, res) => {
  const { email, otp, password, cpassword } = req.body;
  try {
    let data = await Resetotp.findOne({ email: email.toLowerCase(), otp: otp });
    //  let jdata =  JSON.parse(data)
    // console.log(data[0].expiretime)             // its is in array form gives data
    if (data) {
      let currentime = new Date().getTime();
      let time = data[0].expiretime - currentime;
      if (time < 0) {
        return res
          .status(404)
          .json({ status: "error", message: "time limit exceed" });
      } else {
        let user = await registration.findOne({ email: email.toLowerCase() });

        user.password = password;
        user.cpassword = cpassword;
        await user.save();
        // console.log(user.password)
        return res
          .status(200)
          .json({ status: "success", message: "password change succesfull " });
      }
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "otp does not match " });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "internal issue from backend",err }); 
  }
});

// profile data show

Router.get("/your_profile", authentication,async (req, res) => {

  try{
    const userdetails = await registration.findById(req.userId);
   
    if(!userdetails) return res.status(404).json({message:"user not found not verified "});

    return res.status(200).json({message: userdetails})

  }
  catch(err){
    return res
    .status(400)
    .json({ status: "error", message: "internal issue from backend" });
  }
 
});

// update prodile data

Router.post("/updateprofile", authentication, async (req, res) => {
  const { name, email, phone, password, cpassword, newpassword } = req.body;

  try {
    const user = await registration.findById(req.userId);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        user.name = name || user.name;
        // user.email = email || user.email;
        user.phone = phone || user.phone;
        user.password = newpassword || user.password;
        user.cpassword = cpassword || user.cpassword;

        const updateuser = await user.save();

        console.log(updateuser);
        return res
          .status(200)
          .json({ status: "success", message: "user updated successfully" });
      } else {
        return res.status(404).json({
          status: "error",
          message: "current  password does not match",
        });
      }
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "user not found " });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "internal issue from backend" });
  }
});

//contact us

Router.post("/contact_us", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    const userquery = new contactus_query({
      name,
      email,
      subject,
      phone,
      message,
    });

    await userquery.save();
    await sendemail.mail(name, email, phone, subject, message);   // jisme beja h mail client-side 
    await sendemail.mail(name, "shubhamkaushik9069@gmail.com", phone, subject, message);//server-side mail jaha query solve hogi 
      return res.status(200).json({status: 'success',message:"message is sent "});
  } catch (err) {
    return res
      .status(404)
      .json({ status: "error", message: "message not send internal issue ",err });
      
  }
});

// services for bnwjournal for new services add

// to get the services

Router.get("/get_data_services", async (req, res) => {
  try {
    const servicedata = await servicesdb.find({ status: true });
    return res.status(200).json({ status: "success", message: servicedata });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "internal issue from backend " + err });
  }
});

// get category data all
Router.get("/get_category_data", async (req, res) => {
  try {
    const categorydata = await category.find({}).populate({
      path: "service",
      model: "startup_for_indian_owner",
      populate: [
        {
          path: "basic.subservice",
          model: "BASICSERVICE" /* modeluse in deep popullated */,
        },
        {
          path: "standard.subservice",
          model: "STANDARDSERVICE",
        },
        {
          path: "premium.subservice",
          model: "PREMIUMSERVICE",
        },
      ],
    });

    return res.status(200).json({ message: categorydata });
  } catch (err) {
    res.status(400).json({ message: "internal issue from backend " + err });
  }
});

// get cataegory data indivisual category

Router.post("/get_category_data_id", async (req, res) => {
  try {
    const categorydata = await category
      .findOne({ _id: req.body._id })
      .populate({
        path: "service",
        model: "startup_for_indian_owner",
        populate: [
          {
            path: "basic.subservice",
            model: "BASICSERVICE" /* modeluse in deep popullated */,
          },
          {
            path: "standard.subservice",
            model: "STANDARDSERVICE",
          },
          {
            path: "premium.subservice",
            model: "PREMIUMSERVICE",
          },
        ],
      });
    var data = []
    categorydata.service.forEach((element) => {
      /* backend se true laane ke liye */
      if(element.status ===true)
      {return data.push(element)
      }
      
    });
    return res.status(200).json({ message: data });
  } catch (err) {
    res.status(400).json({ message: "internal issue from backend " + err });
  }
});

Router.get("/get_data_by_id", async (req, res) => {
  let id = req.query.id;

  try {
    const prddetails = await servicesdb.findOne({ _id: id }).populate([{
      path: "basic.subservice",
      model: "BASICSERVICE" /* modeluse in deep popullated */,
    },
    {
      path: "standard.subservice",
      model: "STANDARDSERVICE",
    },
    {
      path: "premium.subservice",
      model: "PREMIUMSERVICE",
    },]);
    if(prddetails){
      return res.status(200).json({ status: "success", message: prddetails });
    }
    else{
      return res.status(404).json({ status: "success", message: "product not found " });
    }

    
  } catch (err) {
    return res.status(400).json({ status: "error", message: "internal issue from backend "});
  }
});

// get all registration data



module.exports = Router;
