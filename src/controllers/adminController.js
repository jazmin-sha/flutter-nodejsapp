const usersModel = require('../models/user');
const express = require('express');
const session = require('express-session')
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const product = require('../models/products');
const customer = require('../models/customer')
//#############################################################################################
//Demo WOrkOuts
// const Location = require('../models/locations');
// const protectHome = (req, res, next) => {
//     if (!req.session.adminDB) {
//         res.redirect("/adminLogin")
//     } else {
//         next()
//     }
// }

// const redirectToDashBoard = (req, res, next) => {
//     if (req.session.adminDB) {
//         res.redirect('/getAllUserData')
//     }
// }

//#############################################################################################


exports.adminLogIn = (req, res) => {
    try {
        const adminDB = "admin@gmail.com"
        const passwordDB = "Admin@123"
        const { admin_username, admin_password } = req.body;
        if (admin_username === adminDB && admin_password === passwordDB) {
            req.session.adminDB = admin_username;
            const adminToken = jwt.sign({ adminDB: admin_username }, process.env.ADMIN_TOKEN);
            res.header("authToken", adminToken).json({ token: adminToken, loginedUser: req.body })
            // res.json('login success')
        } else {
            res.status(400).send('err in login')
        }

    } catch (err) {
        res.status(500).json({ message: "Server error" })


    }

}
exports.adminUserRegister = (req, res) => {
    try {
        const password = req.body.password;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                const newUser = {
                    username: req.body.username,
                    password: hash,
                }
                const newMan = usersModel(newUser)
                const doc = newMan.save();
                res.json('user created')
            })
        })
    } catch (err) {
        res.status(400).send('Error while createing a user')

    }
}



//#############################################################################################
// Demo Workouts
// exports.getAllUserData = (req, res) => {
//     try {
//         var loc
//         Location.find({}).lean().exec((err, data) => {
//             loc = data;
//             if (loc) {
//                 loc.map(user => {

//                     console.log(user.user_id);
//                     usersModel.findByIdAndUpdate({ _id: user.user_id }, { $push: { locations: { $each: [user], $position: 0 } } }, (err, doc) => {
//                         if (doc) {

//                             console.log(doc);
//                             res.json(doc)

//                         }
//                         if (err) throw err;
//                         // console.log(doc);
//                     })

//                 })
//             }
//             // else {
//             //     res.status(403).send('err in get data from location');
//             // }
//         })

//     } catch (err) {

//         res.status(400).send(err)
//     }

// }

//#############################################################################################


exports.getAllUserData = (req, res) => {
    try {
        usersModel.find({}).lean().exec((err, datas) => {
            if (datas.length) {
                const finalData = datas.map(user => {
                    if (user && user.locations.length) {
                        const { latitude, longitude, date, activity } = user.locations[0]
                        const resultData = {
                            latitude,
                            longitude,
                            date,
                            activity,
                            username: user.username,
                            _id: user._id,
                        }
                        return resultData

                    } else {
                        return {
                            username: user.username,
                            _id: user._id,
                            activity: user.activity
                        }
                    }
                })
                res.json(finalData)
                console.log(finalData);
            } else {

                res.status(404).send('err while fetching...!')
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Server error" })

    }
}
exports.adminGetOneDataOfUser = (req, res) => {
    try {
        const id = req.params.id
        usersModel.find({ _id: id }, (err, doc) => {
            if (doc) {
                const docs = doc.find(i => i.locations);
                console.log(docs);
                res.json(docs)
            } else {
                res.status(400).send('err in fetching one data')
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Server error" })

    }
}
exports.deleteUser = (req, res) => {
    try {
        const id = req.params.id;
        usersModel.deleteOne({ _id: id }, (err, doc) => {
            if (doc) {
                res.json('user deleted..!')

            } else {
                res.status(400).send('err in deleteing user')
            }
        })

    } catch (err) {
        res.status(500).json({ message: "Server error" })


    }

}

exports.editUser = (req, res) => {
    try {
        const id = req.params.id
        const { username } = req.body;
        const data = {
            username
        }
        usersModel.findByIdAndUpdate(id, {
            $set: {
                username: data.username
            }
        }, (err, doc) => {
            if (doc) {
                res.json('editing success....!')
            } else {
                res.status(400).send('err while editing...!')
            }
        })

    } catch (err) {
        res.status(500).json({ message: "Server error" })

    }
}
exports.productAdd = (req, res) => {
    try {
        const data = {
            productName: req.body.productName
        }
        const docs = product(data);
        docs.save((err, doc) => {
            if (err) throw err;
            if (doc) {
                res.json(doc)
            } else {
                res.status(400).send({ message: "Error in Adding product" })
            }
        })
    } catch (err) {
        res.status(500).send({ message: "Server Error" })

    }
}

exports.getProducts = (req, res) => {
    try {
        product.find({}).lean().exec((err, doc) => {
            if (err) throw err;
            if (doc) {
                res.json(doc)
            } else {
                res.status(400).send({ message: "Error in fetching Products..!" })
            }
        })
    } catch (err) {
        res.status(500).send({ message: "Server Error" })
    }
}
exports.editProduct = (req, res) => {
    try {
        const id = req.params.id;
        const { productName } = req.body
        const data = {
            productName
        }
        product.findByIdAndUpdate(id, {
            $set: {
                productName: data.productName
            }
        }, (err, docs) => {
            if (err) throw err;
            if (docs) {
                res.json({ message: "Product edit success..!" })
            } else {
                res.status(400).send({ message: "Error in editng...!" })
            }
        })
    } catch (err) {
        res.status(500).send({ message: "Server error" })
    }
}
exports.deleteProduct = (req, res) => {
    try {
        const id = req.params.id
        product.deleteOne({ _id: id }, (err, docs) => {
            if (err) throw err;
            if (docs) {
                res.json({ message: "Product deleted...!" })
            } else {
                res.status(400).send({ message: "Error in deleting...!" })
            }
        })

    } catch (err) {
        res.status(500).send({ message: "Server error" })
    }
}
exports.getCustomers = (req, res) => {
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
        res.status(500).send({ message: "Server error" })
    }
}


exports.adminLogOut = (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                res.send('err in admin logout')
            }
            res.clearCookie(process.env.ADMIN_COOKIE_NAME).send('admin logout')
        })
    } catch (err) {
        res.status(500).json({ message: "Server error" })

    }
}
