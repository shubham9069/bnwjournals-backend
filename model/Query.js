const mongoose = require("mongoose");

const contactusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      subject:{
        type: String,
        required: true,
      },
    
      phone: {
        type: Number,
        required: true,
        min: 1111111111,
        max: 9999999999,
      },
      message:{
        type: String,
        required: true,
      },
})









const contactus_query= mongoose.model("contactus_query",contactusSchema);

module.exports = contactus_query;