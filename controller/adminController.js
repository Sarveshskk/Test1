const User = require("../models/users");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const Address = require("../models/address");
const Task = require("../models/task");

exports.addUser = async (req, res) => {
    try {
        if (req.body.password == req.body.cnfpassword) {
            const user = await new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                username: req.body.username,
                password: md5(req.body.password),
                role: req.body.role,
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
                if (foundUser.role == "admin") {
                    const token = jwt.sign(
                        { id: foundUser._id },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: 60000,
                        }
                    );
                    res.status(200).send({ jwttoken: token });
                } else {
                    res.status(403).send("Unauthorised person");
                }
            } else {
                res.status(401).send("User password incorrect.");
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
        if (!updatedAddress.length) {
            res.status(401).send("user address not updated! check for user id");
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

exports.updateRole = async (req, res) => {
    try {
        let role = req.body.role
        let user_id = req.params["id"];
        let user = req.user;
        if (!user_id) {
            res.status(403)
                .send({
                    message: "Invalid user id"
                });
        }
        else {
            if (role == "manager") {
                let managerData = await User.findByIdAndUpdate(user["id"], { $push: { manager: user_id } })
                if (!managerData) {
                    res.status(401).send("user address not updated! check for user id");
                }
            }
            let updatedData = await User.findByIdAndUpdate({ _id: user_id }, { role: role })
            if (!updatedData) {
                res.status(401).send("error occured while updating role");
            }
            res.status(200).send("user role updated");
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

exports.userToManager = async (req, res) => {
    try {
        let manager_id = req.body.manager_id;
        let user_id = req.body.user_id;
        let foundUser = await User.findOne({ _id: user_id })
        if (foundUser) {
            if (foundUser.role == 'user') {
                let foundManager = await User.findOne({ _id: manager_id })
                let isInclude = foundManager.users.includes(user_id);
                if (isInclude) {
                    res.send("user already assigned to manager");
                } else {
                    if (foundManager) {
                        if (foundManager.role == 'manager') {
                            let managerData = await User.findByIdAndUpdate(manager_id, { $push: { users: user_id } })
                            if (!managerData) {
                                res.status(403).send("user address not updated! check for user id");
                            }
                            res.status(200).send("user assigned to manager");
                        }else{
                            res.status(403).send("user role is different from manager");
                        }
                    } else {
                        res.status(403).send("manager not found");
                    }
                }
            } else {
                res.status(403).send("user role is different from user");
            }

        } else {
            res.status(401).send("unauthorised user");
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

exports.changePassword = async (req, res) => {
    try {
        let user_id = req.params['id'];
        if (req.body.password == req.body.cnfpassword) {
            let password = md5(req.body.password);
            let updatedpassword = await User.findByIdAndUpdate({ _id: user_id }, { password: password })
            if(updatedpassword){
                res.status(200).send("update password successfull")
            }else{
                res.send("user id incorrect.")
            }
        } else {
            res.send("please type password carefully")
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

exports.readTasks = async (req, res) => {
    try {
        let user_id = req.params["id"];
        if (user_id == null) {
            res.status(403)
                .send({
                    message: "Invalid user id"
                });
        }
        else {
            await User.find({ _id: user_id }).populate("task").then(user => {
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

exports.deleteUser = async (req, res) => {
    try {
        let user_id = req.params['id'];
        if (!user_id) {
            res.status(403)
                .send({
                    message: "Invalid user"
                });
        }
        else {
            let deletedUser = await User.findOneAndDelete({ _id: user_id })
            if (!deletedUser) {
                res.send("user not deleted! check for user id.");
            }
            res.status(200).send("user deleted successfully");
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

