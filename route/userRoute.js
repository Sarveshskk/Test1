const express = require("express");
const {loginValidateRules,loginValidate} = require("../validator/loginValidator");
const {signupValidateRules,signupValidate }= require("../validator/signupValidator");
const verifyUser = require("../middleware/verifyUser");
const {addressValidateRules, addressValidate} = require("../validator/addressValidator");
const {taskStatusValidateRules, taskStatusValidate} = require("../validator/taskStatusValidator");

let userRouter = express.Router(),
{
    signUp,
    login,
    address,
    assignedTask,
    updateTaskStatus
} = require("../controller/userController");

userRouter.post("/signup",signupValidateRules(),signupValidate,signUp);
userRouter.post("/login",loginValidateRules(),loginValidate,login);
userRouter.post("/createAddress",addressValidateRules(),addressValidate,verifyUser,address);
userRouter.get("/assignedTask",verifyUser,assignedTask);
userRouter.put("/updateTaskStatus/:id",taskStatusValidateRules(),taskStatusValidate,verifyUser,updateTaskStatus);

module.exports = userRouter;