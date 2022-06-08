const { type } = require("express/lib/response");
const mongoose = require("mongoose");

let speakerSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Email:{type:String, 
        unique:true,
        validate:{
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    },
    UserName:{type:String},
    Password:{type:String},
    Address:{
        City:{type:String},
        Street:{type:String},
        Building:{type:Number}
    }
});

module.exports = mongoose.model("speakers", speakerSchema);