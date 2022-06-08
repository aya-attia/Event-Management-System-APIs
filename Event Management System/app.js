const { response } = require("express");
const { request } = require("express");
const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')
//const autoIncrement = require("mongoose-plugin-autoinc");
//const autoIncrement = require("mongoose-auto-increment");

// autoIncrement.initialize(mongoose.connect("mongodb://localhost:27017/EventsSystemDB"));


const studentRouter = require("./Routers/StudentRouter");
const eventRouter = require("./Routers/EventRouter");
const speakerrouter = require("./Routers/SpeakerRouter");
const authRouter = require("./Routers/AuthRouter");
const registerRouter = require("./Routers/RegisterRouter");

const server = express();
server.use(cors());

mongoose.connect("mongodb://localhost:27017/EventsSystemDB")
        .then(()=>{
            console.log("DB connected successfully");
            server.listen(process.env.PORT||8080, ()=>{
                console.log("I am listening ...")
            });
        })
        .catch(error=>console.log("DB connection failed"))



//Logger MW
server.use((request, response, next)=>{
    console.log(request.url, request.method);
    next();
});

//Body Parsing MW
//in case of post, put, delete
server.use(body_parser.json());//manage next automatically
server.use(body_parser.urlencoded({extended:false}));

//Routers
server.use(registerRouter);
server.use(authRouter);
server.use(studentRouter);
server.use(eventRouter);
server.use(speakerrouter);


//Not Found MW
server.use((request, response)=>{
    response.status(404).json({message: "Page Not Found"});
});

//Error MW
server.use((error, request, response, next)=>{
    response.status(500).json({message: error + ""});
});
