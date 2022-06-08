const express = require("express");
const {body, param, query} = require("express-validator");
const authMW=require("./../MiddleWares/AuthMiddleWare");
const router = express.Router();
const controller = require("./../Controllers/EventController");

router.use(authMW);

router.route("/events")
.get(controller.getAllEvents)
.post(
    [
        body("id").isInt().withMessage("Id should be number"),
        body("Title").isString().withMessage("Invalid title"),
        //body("Date").isDate().withMessage("Invalid date"),
        body("StudentIds").isArray().isInt().withMessage("Id should be number")
    ]
    ,controller.insertEvent)
.put(
    [
        body("Title").isString().withMessage("Invalid title"),
        body("Date").isDate().withMessage("Invalid date"),
        body("StudentIds").isArray().isInt().withMessage("Id should be number")
    ]
    ,controller.updateEvent)
.delete(body("id").isInt().withMessage("Id should be number")
    ,controller.deleteEvent)

router.get("/events/:id",
    param("id").isInt().withMessage("Id should be number")
    ,controller.getEvent);

router.post("/events/:id",
    controller.addStudentToEvent);

router.post("/events/:speakerId/:eventId",
    controller.addSpeakerToEvent);


    


module.exports = router;