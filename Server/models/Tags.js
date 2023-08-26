const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        
    },
    description:{
        type:String,
    },
    name:{
        type:String,
        required:true,
    },
}) 

module.exports = mongoose.model("Tags",tagsSchema)