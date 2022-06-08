const express = require("express");
const {body, param, query} = require("express-validator");
const authMW=require("./../MiddleWares/AuthMiddleWare");
const router = express.Router();
const controller = require("./../Controllers/StudentController");

router.use(authMW);

router.route("/students")
.get(controller.getAllStudents)
.post(
    [
        //body("id").isInt().withMessage("Id should be number"),
        body("Email").isEmail().withMessage("Email format is incorrect"),
        body("Password").isLength({min: 6}).withMessage("Password should be at least 6 characters")
    ]
    ,controller.insertStudent)
.put(
    [
        body("Email").isEmail().withMessage("Email format is incorrect"),
        body("Password").isLength({min: 6}).withMessage("Password should be at least 6 characters")
    ]
    ,controller.updateStudent)
.delete(body("id").isInt().withMessage("Id should be number")
    ,controller.deleteStudent)

router.get("/students/:id",
    param("id").isInt().withMessage("Id should be number")
    , controller.getStudent);

module.exports = router; 