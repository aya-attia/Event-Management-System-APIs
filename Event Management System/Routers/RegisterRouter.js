const express = require("express");
const {body, param, query} = require("express-validator");

const router = express.Router();
const controller = require("./../Controllers/RegisterController");


router.post("/student-register",
    [
        //body("id").isInt().withMessage("Id should be number"),
        body("Email").isEmail().withMessage("Email format is incorrect"),
        body("Password").isLength({min: 6}).withMessage("Password should be at least 6 characters")
    ],
    controller.registerStudent);

router.post("/speaker-register",
    [
        body("Email").isEmail().withMessage("Email format is incorrect"),
        body("UserName").isString().withMessage("Invalid username").isLength({max: 6}).withMessage("Username should be maximum 6 characters"),
        body("Password").isLength({min: 6}).withMessage("Password should be at least 6 characters"),
        body("City").isString().withMessage("Invalid city name"),
        body("Street").isString().withMessage("Invalid street name"),
        body("Building").isInt().withMessage("Invalid building number")
    ]
    ,controller.registerSpeaker);

module.exports=router;