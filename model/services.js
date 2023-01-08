const mongoose = require("mongoose");



const servicesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status:{
    type: Boolean,
    default:true,
  },
  description:{
    type:String,
    
  },
  img: [Object],
  basic:{
      basicprice:{type:Number},
      subservice:[{type:mongoose.Types.ObjectId, ref:"BASICSERVICE"}]
  },
  standard:{
      standardprice:{type:Number},
      subservice:[{type:mongoose.Types.ObjectId, ref:"STANDARDSERVICE"}]
  },
  premium:{
      premiumprice:{type:Number},
      subservice:[{type:mongoose.Types.ObjectId, ref:"PREMIUMSERVICE"}]
  },
    

    
},);


const servicesdb = mongoose.model("startup_for_indian_owner", servicesSchema);

module.exports = servicesdb;