const mongoose = require("mongoose");
const express = require("express");
const Router = express.Router();
require("../db/connection");
const registration = require("../model/userSchema");
const servicesdb = require("../model/services");
const {basic,standard,premium} = require("../model/Price");
const contactus_query = require("../model/Query");
const category = require("../model/Categoryschema")
const authentication = require("../middleware/authentication");
const multer = require("multer");



// delete service from all 3 collection 
Router.post("/deletebasic_services", async(req,res)=>{
    
  try{
      const basic_data = await basic.findByIdAndRemove(req.body._id);
      const standard_data = await standard.findByIdAndRemove(req.body._id);
      const premium_data = await premium.findByIdAndRemove(req.body._id);
      
      if(basic_data || standard_data || premium_data){
        console.log(basic_data,standard_data,premium_data)
          res.status(200).json({message: "delete succsessfull"})
      }
      else{
          res.status(404).json({message: "not deleted "})
      }
  }
  catch(err)
  {
    res.status(400).json({message:"internal issue from backend "})
  }
})


// get basic services from basic collection 

Router.get("/basiclist_service", async (req,res)=>{
    try{
      const basicservice = await basic.find();
      res.status(200).json({message: basicservice})
      
    }
    catch(err){
      res.status(400).json({message:"internal issue from backend "})
    }
    
  })

  // changing status of basic services from basic collection 
  Router.post("/basicstatus_modify", async (req,res)=>{
    
    
    try{
      const basicservice = await basic.findById(req.body._id);
      if(basicservice)
      {
        basicservice.status= req.body.modifiedstatus
        await basicservice.save();
        res.status(200).json({message:"status is modified b "})
      }
      
    }
    catch(err){
      
      res.status(400).json({message:"internal issue from backend "})
    }
    
  })

  // adding new service basic services from basic collection 
  Router.post("/basicservice_upload",async(req, res)=>{

    const {status, servicename } = req.body;
    
    try{
      let data = await basic.findOne({sub_service_name:servicename});
      
      if(data)
      {
       return res.status(404).json({message:"service name is already present "})
      }
      else {
        
        const servicedata =  new basic({
          status,
          sub_service_name:servicename
        });
        await servicedata.save();
        console.log(servicedata);
        return res.status(200).json({message:"succsessfully added in basic  "})
      }
      
    }
    catch(err){
      res.status(400).json({message:"internal issue from backend "})
    }
  })

  



  // standard database collection 
  // get service 

  Router.get("/standardlist_service", async (req,res)=>{
    try{
      const standardservice = await standard.find();
      res.status(200).json({message: standardservice})
      
    }
    catch(err){
      res.status(400).json({message:"internal issue from backend "})
    }
    
  })


  // chnaging status of stnadrd services froms standard collection 
  Router.post("/standardstatus_modify", async (req,res)=>{
    
    try{
      const standardservice = await standard.findById(req.body._id);
      if(standardservice)
      {
        standardservice.status= req.body.modifiedstatus
        await standardservice.save();
        res.status(200).json({message:"status is modified s "})
      }
      
    }
    catch(err){
      res.status(400).json({message:"status is not modified internal issue "})
    }
    
  })


  // adding new service standard services from standard collection 
  Router.post("/standardservice_upload",async(req, res)=>{

    const {status, servicename } = req.body;
    
    try{
      let data = await standard.findOne({sub_service_name:servicename});
      
      if(data)
      {
       return res.status(404).json({message:"service name is already present "})
      }
      else {
        
        const servicedata =  new standard({
          status,
          sub_service_name:servicename
        });
        await servicedata.save();
       
        return res.status(200).json({message:"succsessfully added in standard "})
      }
      
    }
    catch(err){
      res.status(400).json({message:"internal issue from backend "})
    }
  })







  // premium collection 
  // get all data 
  Router.get("/premiumlist_service", async (req,res)=>{
    try{
      const standardservice = await premium.find();
      res.status(200).json({message: standardservice})
      
    }
    catch(err){
      res.status(400).json({message:"internal issue from backend "})
    }
    
  })

 // chnaging status of premium services froms premium collection 
  Router.post("/premiumstatus_modify", async (req,res)=>{
    
    try{
      const premiumservice = await premium.findById(req.body._id);
      if(premiumservice)
      {
        console.log(premiumservice)
        premiumservice.status= req.body.modifiedstatus
         await premiumservice.save();
        res.status(200).json({message:"status is modified p"})
      }
      
    }
    catch(err){
      res.status(400).json({message:"status is not modified internal issue "})
    }
    
  })


   // uploade service  of premium services froms premium collection 
  Router.post("/premiumservice_upload",async(req, res)=>{

    const {status, servicename } = req.body;
    
    try{
      let data = await premium.findOne({sub_service_name:servicename});
      
      if(data)
      {
       return res.status(404).json({message:"service name is already present "})
      }
      else {
        
        const servicedata =  new premium({
          status,
          sub_service_name:servicename
        });
        await servicedata.save();
        console.log(servicedata);
        return res.status(200).json({message:"succsessfully added in premium "})
      }
      
    }
    catch(err){
      res.status(400).json({message:"internal issue from backend "})
    }
  })


  var imageStorage = multer.diskStorage({
    // Destination to store image
    destination: function (req, file, cb) {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname);
      // file.fieldname is name of the field (image)
      // path.extname get the uploaded file extension
    },
  });
  
  var imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 100000000, // 1000000 Bytes = 1 MB
    },
    // fileFilter(req, file, cb) {
    //   if (!file.originalname.match(/\.(png|jpg)$/)) {
    //      // upload only png and jpg format
    //      throw ('Please upload a Image')
    //    }
  });

  // for adding a new services

Router.post( "/new_services_add",imageUpload.array("img", 3),async (req, res, next) => {
  // console.log(req.files);
  const imgarray = [];
  const { title,status,description, basicprice,standardprice,premiumprice,basic_sub_service,standard_sub_service,premium_sub_service  } = req.body;
console.log(title,status,description, basicprice,standardprice,premiumprice,basic_sub_service,standard_sub_service,premium_sub_service )
  req.files.forEach((element) => {
    var img = {
      originalname: element.originalname,
      filename: element.filename,
      path: element.path,
      destination: element.destination,
    };
    imgarray.push(img);
  });

  try {
    let data = await servicesdb.findOne({ title: title });

    if (data) {
      return res.status(404).json({ message: "title name is already saved " });
    } else {
      const add = new servicesdb({
        title,
        status,
        description,
        img: imgarray,
        basic:{
          basicprice,
          subservice:basic_sub_service===undefined?[]:basic_sub_service.map(element => {return mongoose.Types.ObjectId(element)} )
        },
        standard:{
          standardprice,
          subservice:standard_sub_service===undefined? []:standard_sub_service.map(element => {return mongoose.Types.ObjectId(element)} )
        },
        premium:{
         premiumprice,
          subservice:premium_sub_service===undefined ?[]: premium_sub_service.map(element => {return mongoose.Types.ObjectId(element)} )
        }
      });

      await add.save();
      return res.status(200).json({ status: "success", message: ` ${add.title} services add   successfull`,});
    }
  } catch (err) {
    res.status(400).json({message:"internal issue from backend "})
  }
}
);


// delete service from of main collection indian startup 
Router.post("/deletemain_services", async(req,res)=>{
  console.log(req.body._id)
    
  try{
      const data = await servicesdb.findByIdAndRemove(req.body._id);
     
      
      if(data){
        console.log(data)
          res.status(200).json({message: "delete succsessfull"})
      }
      else{
          res.status(400).json({message: "not deleted "})
      }
  }
  catch(err)
  {
    res.status(400).json({message:"internal issue from backend "})
  }
})




// get all service popullated 

Router.get("/get_all_services",async (req, res) => {


  try{
    const services1 = await servicesdb.find({}).populate([{
     
      path:"basic.subservice",
      model:"BASICSERVICE"
    },{
      path:"standard.subservice",
      model:"STANDARDSERVICE"
    },
    {
      path:"premium.subservice",
  model:"PREMIUMSERVICE"
  }])
  
  
    return res.status(200).json({message:services1});
}
  catch(err)
  {
    res.status(400).json({message:"internal issue from backend "})
  }
});


// changing state of serviuces

Router.post("/servicestatus_modify", async (req,res)=>{
  
    
  try{
    const service = await servicesdb.findById(req.body._id);
    if(service)
    {
      // console.log(service)
      service.status= req.body.modifiedstatus
       await service.save();
      res.status(200).json({message:"status is modified "})
    }
    
  }
  catch(err){
    res.status(400).json({message:"internal issue from backend "})
  }
  
})



// category opertaion 

// uploade category {}

Router.post('/upload_category',async (req,res)=>{
  

  try{
const data = await category.findOne({category_name:req.body.categoryname})

if(data)
{
  return res.status(404).json({message: "category name is already present "})
}
else{
  const newdata = new category({
    category_name:req.body.categoryname,
    service:req.body.object_id.map(element=>{ return mongoose.Types.ObjectId(element)} )
  })

  await newdata.save();
  return res.status(200).json({ status: "success", message:"category  is added "})
}

  }catch(err){
    res.status(400).json({message:"internal issue from backend "})
  }
})

Router.get('/get_all_category',async (req, res)=>{
  try{
    const categorydata  = await category.find({}).populate(
      {
        
      path:"service",
      model:"startup_for_indian_owner", 
      populate:[{                                             
     
        path:"basic.subservice",
        model:"BASICSERVICE"                              /* modeluse in deep popullated */
      },{
        path:"standard.subservice",
        model:"STANDARDSERVICE"
      },
      {
        path:"premium.subservice",
    model:"PREMIUMSERVICE"
    }]

      })
   
  
      return res.status(200).json({message:categorydata})

  }
  catch(err){
    res.status(400).json({message:"internal issue from backend "})
  }
})

// delete CATEGORY
Router.post("/deletecategory", async(req,res)=>{
    
  try{
      const category_data = await category.findByIdAndRemove(req.body._id);
     
      
      if(category_data){
        
          res.status(200).json({message: "delete succsessfull"})
      }
      else{
          res.status(404).json({message: "not deleted "})
      }
  }
  catch(err)
  {
    res.status(400).json({message:"internal issue from backend "})
  }
})

Router.post('/update_category',async(req,res)=>{
  console.log(req.body.updateObject_id)
  
  try{

    const data = await category.findOne({_id: req.body._idbtn})

    if(!data)
    {
      return res.status(404).json({message: "data is not found  "})
    }
    else{
      let updatedata=req.body.updateObject_id.map(element=>{ return mongoose.Types.ObjectId(element)} )

       await category.updateOne({_id: req.body._idbtn},{$addToSet:{service:updatedata}})

      return res.status(200).json({ status: "success", message:"success fully modfified "})
    }
    
      }catch(err)
      {console.log(err)
        res.status(400).json({message:"internal issue from backend "})
        
      }
})





// query data

// get contact us query data
Router.get('/get_contactus_query',async(req, res) =>{
  
  try{

    const contactusdata = await contactus_query.find()
    console.time()
   return  res.status(200).json({message: contactusdata})
  }
  catch(err) {
    return res.status(400).json({message:"internal issue from backend "})
  }
}) 

Router.post("/delete_contactus_query", async(req,res)=>{
    
  try{
      const contactus_data = await contactus_query.findByIdAndRemove(req.body._id);
     
      
      if(contactus_data){
        
          res.status(200).json({message: "delete succsessfull"})
      }
      else{
          res.status(404).json({message: "not deleted "})
      }
  }
  catch(err)
  {
    res.status(400).json({message:"internal issue from backend "})
  }
})

Router.get("/get_data_user", async (req, res) => {
 
  try {
    const userdata = await registration.find({});
    return res.status(200).json({ status: "success", message: userdata });
  } catch (err) {
    return res.status(400).json({ status: "error", message: err });
  }
});

Router.get("/service_list_data", async (req,res)=>{
  try{
    const service = await servicesdb.find({});
    res.status(200).json({message: service})

  }
  catch(err){
    res.status(400).json(err)
  }

})
 
 

module.exports = Router;