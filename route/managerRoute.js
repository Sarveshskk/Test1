const express = require("express");
const verifyManager = require("../middleware/verifyManager");
const {loginValidateRules,loginValidate} = require("../validator/loginValidator");
const {signupValidateRules,signupValidate }= require("../validator/signupValidator")
const {addressValidateRules, addressValidate} = require("../validator/addressValidator")
const {taskValidateRules, taskValidate} = require("../validator/taskValidator");
const {taskStatusValidateRules, taskStatusValidate} = require("../validator/taskStatusValidator");
const {rateValidateRules, rateValidate} = require("../validator/performanceRateValidator");

let managerRouter = express.Router(),
{
    signUp,
    login,
    address,
    createTask,
    deleteTask,
    updateTask,
    assignedUsers,
    updateTaskStatus,
    unAssignedTask,
    assignTaskToUser,
    assignMultiUserOnTask,
    rateUser
} = require("../controller/managerController");

managerRouter.post("/signup",signupValidateRules(),signupValidate,signUp);
managerRouter.post("/login",loginValidateRules(),loginValidate,login);
managerRouter.post("/createAddress",addressValidateRules(),addressValidate,verifyManager,address);
managerRouter.post("/create_task",taskValidateRules(),taskValidate,verifyManager,createTask);
managerRouter.delete("/delete_task/:id",verifyManager,deleteTask);
managerRouter.put("/update_task/:id",taskValidateRules(),taskValidate,verifyManager,updateTask);
managerRouter.put("/assign_task_to_user/",verifyManager,assignTaskToUser);
managerRouter.get("/assigned_users/",verifyManager,assignedUsers);
managerRouter.put("/updateTaskStatus/:id",taskStatusValidateRules(),taskStatusValidate,updateTaskStatus);
managerRouter.put("/unassignedTask",verifyManager,unAssignedTask);
managerRouter.put("/assignUsersOnTask/:id",verifyManager,assignMultiUserOnTask);
managerRouter.post("/rateUser",rateValidateRules(), rateValidate,verifyManager,rateUser)

module.exports = managerRouter;