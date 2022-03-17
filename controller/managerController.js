const User = require("../models/users");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");
const Address = require("../models/address");
const taskPerformance = require("../models/taskPerformance");


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
                if (foundUser.role == "manager") {
                    const token = jwt.sign(
                        { id: foundUser._id },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: 60000,
                        }
                    );
                    res.status(200).send({ jwttoken: token });
                } else {
                    res.status(403).send("user is not manager");
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

exports.createTask = async (req, res) => {
    try {
        let user = req.user;
        const task = await new Task({
            manager_id: user["id"],
            task_name: req.body.task_name,
            description: req.body.description,
        });
        task.save();
        res.status(200).send("task created");
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

exports.deleteTask = async (req, res) => {
    try {
        let user = req.user;
        let task_id = req.params['id'];
        if (!task_id) {
            res.status(403)
                .send({
                    message: "Invalid task id"
                });
        }
        else {
            let isUser = await Task.find({ manager_id: user["id"] })
            if (isUser.length != 0) {
                let deletedTask = await Task.findOneAndDelete({ _id: task_id })
                if (!deletedTask) {
                    res.send("task not deleted");
                }
                res.status(200).send("task deleted successfully");
            } else {
                res.status(403).send("task belong to other manager");
            }
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

exports.updateTask = async (req, res) => {
    try {
        let user = req.user;
        let task = req.body.task_name;
        let task_id = req.params["id"];
        if (!task_id) {
            res.status(403)
                .send({
                    message: "Invalid task id"
                });
        }
        else {
            let isUser = await Task.find({ manager_id: user["id"] })
            console.log(isUser);
            if (isUser.length != 0) {
                let updatedData = await Task.findByIdAndUpdate({ _id: task_id }, { task_name: task })
                if (!updatedData) {
                    res.send("error occured while updating task");
                }
                res.status(200).send("user task updated");
            } else {
                res.status(403).send("task belong to other manager");
            }
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

exports.assignedUsers = async (req, res) => {
    try {
        let user = req.user;
        if (!user) {
            res.status(403)
                .send({
                    message: "Invalid user"
                });
        }
        else {
            await User.find({ _id: user['id'] }).populate("users").then(user => {
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
        let user = req.user;
        let task_status = req.body.task_status
        let task_id = req.params["id"];
        if (!task_id) {
            res.status(403)
                .send({
                    message: "Invalid task id"
                });
        }
        else {
            let isUser = await Task.find({ manager_id: user["id"] })
            if (isUser.length != 0) {
                let updatedData = await Task.findByIdAndUpdate({ _id: task_id }, { task_status: task_status })
                if (!updatedData) {
                    res.send("error occured while updating task-status");
                }
                res.status(200).send("task-status updated");
            } else {
                res.status(403).send("task belong to other manager");
            }
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

exports.unAssignedTask = async (req, res) => {
    try {
        let user = req.user;
        let task_id = req.body.task_id;
        let user_id = req.body.user_id;
        if ((!task_id) && (!user_id)) {
            res.status(403)
                .send({
                    message: "Invalid details"
                });
        }
        else {
            let isUser = await Task.find({ manager_id: user["id"] })
            let managerData = await User.find({ _id: user["id"] })
            let isInclude = managerData.users.includes(user_id);
            if ((isUser.length != 0) && isInclude) {
                let unassignedTask = await User.findOneAndUpdate({ _id: user_id }, { $pull: { task: task_id } })
                let unassignedUser = await Task.findOneAndUpdate({ _id: task_id }, { $pull: { users: user_id } })
                if (unassignedTask) {
                    res.status(200).send("task unassigned from the user");
                } else {
                    res.send("error occured! please check user id and task id")
                }
            } else {
                res.status(403).send("task or user belong to other manager");
            }
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
}

exports.assignTaskToUser = async (req, res) => {
    try {
        let manager = req.user;
        let task_id = req.body.task_id;
        let user_id = req.body.user_id;
        let isUser = await Task.find({ manager_id: manager["id"] })
        let managerData = await User.findOne({_id: manager["id"] })
        let isInclude = managerData.users.includes(user_id);
        if ((isUser.length != 0) && isInclude) {
            let foundUser = await User.findOne({ _id: user_id })
            if (foundUser) {
                if (foundUser.role == 'user') {
                    let foundTask = await Task.findOne({ _id: task_id })
                    let isIncludeTask = foundTask.users.includes(user_id);
                    if(isIncludeTask){
                        res.send("task already assigned.")
                    }else{
                    if (foundTask) {
                        let assignTaskTo = await Task.findByIdAndUpdate(task_id, { $push: { users: user_id } });
                        let assignTask = await User.findByIdAndUpdate(user_id, { $push: { task: task_id } })
                        if (!assignTask) {
                            res.status(403).send("please check user id");
                        }
                        res.status(200).send("task assigned to user");
                    } else {
                        res.send("unassigned!please check task id.")
                    }
                }
                } else {
                    res.status(403).send("user role is not user!");
                }
            } else {
                res.status(403).send("user not found");
            }
        } else {
            res.status(403).send("task or user belong to other manager");
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

exports.assignMultiUserOnTask = async (req, res) => {
    try {
        let task_id = req.params["id"];
        let manager = req.user;
        let isUser = await Task.find({ manager_id: manager["id"] })
        if (isUser.length != 0) {
            let foundManager = await User.findOne({ _id: manager["id"] })
            if (foundManager) {
                let assignTask = await Task.findByIdAndUpdate(task_id, { $push: { users: foundManager.users } });
                //update task on every users of a manager
                let users = foundManager.users;
                users.forEach( async ( id) => {
                    await User.findByIdAndUpdate(id, { $push: { task: task_id } })
                }); 
                if (!assignTask) {
                    res.status(401).send("please check task id");
                }
                res.status(200).send("task assigned to user");
            } else {
                res.status(403).send("manager not found!please check user id");
            }
        } else {
            res.send("task belong to other manager")
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

exports.rateUser = async (req, res) => {
    try {
        let user = req.user;
        let task_id = req.body.task_id;
        let user_id = req.body.user_id;
        let task_rating = req.body.task_rating;
        let isTaskManager = await Task.find({ user_id: user["id"] })
        let managerData = await User.find({ _id: user["id"] })
        let isIncludeUser = managerData.users.includes(user_id);
        if ((isTaskManager.lenght != 0) && (isIncludeUser)) {
            let foundUser = await User.findOne({ _id: user_id })
            if (foundUser.role == "user") {
                let taskperformance = new taskPerformance({
                    user_id: user_id,
                    task_id: task_id,
                    task_rating: task_rating,
                });
                taskperformance.save();
                res.status(200).send("user task performance created")
            } else {
                res.status(403).send("user role is not user!");
            }
        } else {
            res.status(403).send("task belong to other manager or user not belong to manager");
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
 
