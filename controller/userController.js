const User = require("../models/users");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const Address = require("../models/address");
const Task = require("../models/task");

exports.signUp = async (req, res) => {
    try {
        if (req.body.password == req.body.cnfpassword) {
            const user = await new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                username: req.body.username,
                password: md5(req.body.password),
            });
            user.save();
            const token = jwt.sign(
                { id: user._id },
                process.env.TOKEN_KEY,
                {
                    expiresIn: 60000,
                }
            );
            res.status(200).send({ jwttoken: token });
        } else {
            res.send("password and confirm password must be match");
        }
    }
    catch (error) {
        res.send({
            message: error
        })
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.login = async (req, res) => {
    try {

        let username = req.body.username
        let password = md5(req.body.password)
        let foundUser = await User.findOne({ username: username })
        if (foundUser) {
            if (foundUser.password === password) {
                if (foundUser.role == "user") {
                    const token = jwt.sign(
                        { id: foundUser._id },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: 60000,
                        }
                    );
                    res.status(200).send({ jwttoken: token });
                } else {
                    res.status(403).send("user role is not user");
                }
            } else {
                res.status(403).send("User password incorrect.");
            }
        } else {
            res.status(401).send("User not regestered.");
        }
    } catch (error) {
        res.send({
            message: error
        })
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.address = async (req, res) => {
    try {
        let user = req.user;
        const address = await new Address({
            user_id: user["id"],
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pin_code: req.body.pin_code,
            phone_no: req.body.phone_no
        })
        address.save();
        let updatedAddress = await User.findByIdAndUpdate(user["id"], { $push: { address: address } })
        if (!updatedAddress) {
            res.send("user address not updated! check for user id");
        }
        res.status(200).send("user address updated");
    }
    catch (error) {
        res.send({
            message: error
        })
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message)
    });
}

exports.assignedTask = async (req, res) => {
    try {
        let user = req.user;
        if (!user) {
            res.status(403)
                .send({
                    message: "Invalid user"
                });
        }
        else {
            await User.find({ _id: user["id"] }).populate("task").then(user => {
                res.json(user);
            })
        }
    }
    catch (error) {
        res.send({
            message: error
        })
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};

exports.updateTaskStatus = async (req, res) => {
    try {
        let task_status = req.body.task_status
        let task_id = req.params["id"];
        if (!task_id) {
            res.status(403)
                .send({
                    message: "Invalid task id"
                });
        }
        else {
            let updatedData = await Task.findByIdAndUpdate({ _id: task_id }, { task_status: task_status })
            if (!updatedData) {
                res.send("error occured while updating task-status! check for task id");
            }
            res.status(200).send("task-status updated");
        }
    }
    catch (error) {
        res.send({
            message: error
        })
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};
