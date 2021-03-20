const usersModel = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session')
const mongoose = require('mongoose')
require('dotenv').config()
const jwt = require('jsonwebtoken');
// const Locaction = require('../models/locations');
const customer = require('../models/customer');
const product = require('../models/products')
exports.userLogIn = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await usersModel.findOne({ username: username });
        if (!user)
            return res.status(400).json({
                message: "User Not Exist"
            });
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.username = user.username;
            const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN);
            res.header("authToken", token).send({ token: token, logInedIUser: user, message: "Successfully Logined.....!" });
        } else {
            res.status(400).json({ message: 'Invalid Password..!' })
        }

    } catch (err) {
        res.send(err)
    }
}






//#############################################################################################
// Demo Workouts

// try {
//     const username = req.body.username;
//     const password = req.body.password;
//     // const user = await usersModel.findOne({ username: username });
//     const user = await usersModel.findOne({ username: username }).lean().exec((err, doc) => {
//         // console.log(doc.password);
//         // console.log(user.username);
//         if (!doc.username) {
//             return res.status(400).json({ message: 'Invalid userName' })
//         }
//         const isMatch = bcrypt.compare(password, doc.password);
//         if (isMatch) {
//             req.session.username = doc.username;
//             const token = jwt.sign({ _id: doc._id }, process.env.JWT_TOKEN);
//             res.header("authToken", token).send({ token: token, logInedIUser: doc });
//         }
//         // else if (!doc.username) {
//         //     res.status(400).json('Invalid username..!')
//         // }
//         else {
//             res.status(400).json({ message: 'Invalid user..!' })
//         }

//     });
// } catch (err) {
//     res.send(err)
// }
// }

// exports.userRegister = (req, res) => {
//     try {
//         const password = req.body.password;
//         bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(password, salt, (err, hash) => {
//                 const newUser = {
//                     username: req.body.username,
//                     password: hash,
//                 }
//                 const newMan = usersModel(newUser)
//                 const doc = newMan.save();
//                 res.json('user created')
//             })
//         })
//     } catch (err) {
//         res.send(400).send('Error while createing a user')

//     }
// }
// exports.updateUserLocation = (req, res) => {
//     try {
//         var loc
//         Location.find({}).lean().exec((err, data) => {
//             loc = data;
//             if (loc) {
//                 loc.map(user => {

//                     usersModel.findByIdAndUpdate({ _id: user.user_id }, { $push: { locations: { $each: [user], $position: 0 } } }, (err, doc) => {
//                         if (err) {
//                             res.status(400).send('err')
//                         } else {
//                             // console.log(doc);
//                             res.json(doc)
//                         }
//                     })

//                 })
//             } else {
//                 res.status(400).send('err in updateing')
//             }
//         })

//     } catch (err) {
//         res.status(400).send(err)
//     }
// }




// exports.updateUserLocation = (req, res) => {
//     try {
//         const id = req.params.id
//         const doc = {
//             user_id: id,
//             latitude: req.body.latitude,
//             longitude: req.body.longitude,
//             date: req.body.date,
//             activity: req.body.activity,
//         }
//         const data = Locaction(doc)
//         data.save();
//         console.log(data);
//         res.json(data)

//     } catch (err) {
//         res.status(400).send(err)
//     }
// }
// exports.addActivity = (req, res) => {
//     try {
//         // const newActivity = {
//         //     activity: req.body.activity
//         // }
//         // const newData = usersModel(newActivity);
//         // newData.save();
//         // res.json('activity added')

//         const id = req.params.id;
//         const data = req.body;
//         usersModel.findByIdAndUpdate({ _id: id }, { "activity": data }, (err, result) => {
//             if (result) {
//                 res.json(result)
//             }
//         })
//     } catch (err) {
//         res.status(400).send(err)
//     }
// }


//#############################################################################################


exports.updateUserLocation = (req, res) => {
    try {
        const id = req.params.id
        const data = req.body;
        usersModel.findByIdAndUpdate({ _id: id }, { $push: { locations: { $each: [data], $position: 0 } } }, (err, doc) => {
            if (err) {
                res.status(400).send('err in updateing')
            } else {
                res.json(doc)
            }
        })

    } catch (err) {
        res.status(400).send(err)
    }
}
exports.getOneDataOfUser = (req, res) => {
    try {
        const id = req.params.id
        usersModel.find({ _id: id }, (err, doc) => {
            if (doc) {
                const docs = doc.find(i => i.locations);
                res.json(docs)
            } else {
                res.status(400).send('err in fetching one data')
            }
        })
    } catch (err) {
        res.status(400).send(err)
    }
}


exports.addCustomerDetails = (req, res) => {
    try {
        const id = req.params.id
        const docs = {
            employeeId: id,
            customerName: req.body.customerName,
            customerPhone: req.body.customerPhone,
            place: req.body.place,
            productName: req.body.productName,
            status: req.body.status,
            description: req.body.description,
            followupDate: req.body.followupDate,
            proposalStatus: req.body.proposalStatus,
        }
        const data = customer(docs)
        data.save((err, doc) => {
            if (err) throw err;
            if (doc) {

                res.json(doc).status(200)
            }
        });
    } catch (err) {
        res.json({ message: 'Server is Down' }).status(500)
    }
}

exports.getAllCustomer = (req, res) => {
    try {
        const id = req.params.id;
        usersModel.findById({ _id: id }).lean().exec((err, data) => {
            if (err) throw err;
            if (data) {
                // res.json(data._id)
                const emId = data._id
                customer.find({ emId: customer.employeeId }).lean().exec((err, data) => {
                    if (err) throw err;
                    if (data) {
                        res.json(data)
                    }
                })
            }
        })
    } catch (err) {
        res.json({ message: "Server error" }).status(500)
    }
}

exports.getOneCustomer = (req, res) => {
    try {
        const id = req.body.id;
        customer.findById({ _id: id }).lean().exec((err, data) => {
            if (err) throw err;
            if (data) {
                res.json(data)
            }

        })
    } catch (err) {
        res.send({ message: "Server error" }).status(500)
    }
}
exports.updateCustomerDetails = (req, res) => {
    try {
        const id = req.body.id;
        const des = req.body.description
        const foll = req.body.followupDate
        customer.findByIdAndUpdate({ _id: id }, { $push: { description: { $each: [des], $position: 0 } } }, { $push: { followupDate: { $each: [foll], $position: 0 } } }, (err, doc) => {
            if (err) throw err;
            if (doc) {
                res.json(doc)
            } else {
                res.status(400).send({ message: 'Updateing is Failed' })
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}
exports.getAllProducts = (req, res) => {
    try {
        product.find({}).lean().exec((err, doc) => {
            if (err) throw err;
            if (doc) {
                res.json(doc);
            } else {
                res.status(400).send({ message: "Error in geting Data" })
            }
        })
    } catch (err) {
        res.status(500).send({ message: 'Server error' })
    }
}
exports.userLogOut = (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                res.send('err in logout')
            }
            res.clearCookie(process.env.USER_COOKIE_NAME).send('logout')
        })
    } catch (err) {
        res.status(500).send({ message: 'Server error' })
    }
}