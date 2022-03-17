const express = require("express");
const verifyAdmin = require("../middleware/verifyadmin");
const {registerValidateRules,validate }= require("../validator/registerUserValidator")
const {loginValidateRules,loginValidate} = require("../validator/loginValidator");
const {addressValidateRules, addressValidate} = require("../validator/addressValidator");
const {changePasswordValidateRules,changePasswordValidate} = require("../validator/changePassword");
const {roleValidateRules, roleValidate} = require("../validator/roleUpdateValidator")

let adminRouter = express.Router(),
{
    addUser,
    login,
    address,
    updateRole,
    userToManager,
    changePassword,
    readTasks,
    deleteUser
} = require("../controller/adminController");

adminRouter.post("/register",registerValidateRules(),validate,addUser);
adminRouter.post("/login",loginValidateRules(),loginValidate,login);
adminRouter.post("/createAddress",addressValidateRules(),addressValidate,verifyAdmin,address);
adminRouter.put("/updateRole/:id",roleValidateRules(),roleValidate,verifyAdmin,updateRole);
adminRouter.put("/user_to_manager/",verifyAdmin,userToManager);
adminRouter.put("/changePassword/:id",changePasswordValidateRules(),changePasswordValidate,verifyAdmin,changePassword);
adminRouter.get("/allTasks/:id",verifyAdmin,readTasks);
adminRouter.delete("/deleteUser/:id",verifyAdmin,deleteUser);

module.exports = adminRouter;
