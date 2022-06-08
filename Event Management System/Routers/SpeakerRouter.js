const express = require("express");
const {body, param, query} = require("express-validator");
const authMW=require("./../MiddleWares/AuthMiddleWare");
const router = express.Router();
const controller = require("./../Controllers/SpeakerController");

router.use(authMW);

router.route("/speakers")
.get(controller.getAllSpeakers)
.post(
    [
        body("Email").isEmail().withMessage("Email format is incorrect"),
        body("UserName").isString().withMessage("Invalid username").isLength({max: 6}).withMessage("Username should be maximum 6 characters"),
        body("Password").isLength({min: 6}).withMessage("Password should be at least 6 characters"),
        body("City").isString().withMessage("Invalid city name"),
        body("Street").isString().withMessage("Invalid street name"),
        body("Building").isInt().withMessage("Invalid building number")
    ]
    ,controller.insertSpeaker)
.put(
    [
        body("Email").isEmail().withMessage("Email format is incorrect"),
        body("UserName").isString().withMessage("Invalid username").isLength({max: 6}).withMessage("Username should be maximum 6 characters"),
        body("Password").isLength({min: 6}).withMessage("Password should be at least 6 characters"),
        body("City").isString().withMessage("Invalid city name"),
        body("Street").isString().withMessage("Invalid street name"),
        body("Building").isInt().withMessage("Invalid building number")
    ]
    ,controller.updateSpeaker)
.delete(controller.deleteSpeaker)

router.get("/speakers/:id",controller.getSpeaker);

module.exports = router;