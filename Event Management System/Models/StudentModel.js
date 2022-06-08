const mongoose = require("mongoose");
const autoIncrement = require("mongoose-plugin-autoinc");
const connection = mongoose.createConnection("mongodb://localhost:27017/EventsSystemDB");

let studentSchema = new mongoose.Schema({
    _id:Number,
    Email:{type:String, 
            unique:true,
            validate:{
                validator: function(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email"
            },
            required: [true, "Email is required"]
        },
    Password:{type:String}
});

studentSchema.plugin(autoIncrement.plugin, {
    model: 'students',
    field: '_id'
});

// studentSchema.plugin(autoIncrement.plugin, 'students');
// const students = connection.model('students', studentSchema);

module.exports = mongoose.model("students", studentSchema);