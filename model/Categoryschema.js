const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
  category_name:{
    type: String,
    required: true,
  },

 service:[{type:mongoose.Types.ObjectId, ref:"startup_for_indian_owner"}]
  

},);

const category = mongoose.model("category", categorySchema);
module.exports = category