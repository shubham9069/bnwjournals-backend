const mongoose = require("mongoose");
var AutoIncrement = require('mongoose-sequence')(mongoose);

const Service = new mongoose.Schema({
    // unique_id:{
    //     type:Number,
        
    // },
    status:{
        type:Boolean,
        default:true,

    },
    sub_service_name:{
        type:String,
        required:true
    }

});



// basicService.plugin(AutoIncrement, {id:'order_seq1',inc_field: 'unique_id'});
// standardService.plugin(AutoIncrement, {id:'order_seq2',inc_field: 'unique_id'});
// plataniumService.plugin(AutoIncrement, {id:'order_seq3',inc_field: 'unique_id'});
const basic = mongoose.model("BASICSERVICE", Service);
const standard = mongoose.model("STANDARDSERVICE", Service);
const premium = mongoose.model("PREMIUMSERVICE", Service);

module.exports = {basic,standard,premium};