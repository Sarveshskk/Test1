require("dotenv").config();
const express = require("express");
const route = require("./route");
const dbConnect = require("./db");

dbConnect();
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", route.adminRouter);
app.use("/manager", route.managerRouter);
app.use("/user", route.userRouter);

app.listen(3000,()=>{
    console.log("server running...");
});
