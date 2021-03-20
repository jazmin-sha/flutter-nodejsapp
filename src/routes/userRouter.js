const express = require('express');
const router = express.Router();
const controllers = require('../controllers/userController')
//get
router.get('/getOneDataOfUser/:id', controllers.getOneDataOfUser)
router.get('/getAllCustomer/:id', controllers.getAllCustomer)
router.get('/getOneCustomer', controllers.getOneCustomer)
router.get('/getAllProducts', controllers.getAllProducts)
//post
router.post('/userLogIn', controllers.userLogIn);

//#############################################################################################
// demo WorkOUts

// router.post('/addActivity/:id', controllers.addActivity);
// router.post('/userRegister', controllers.userRegister)

//#############################################################################################

router.post('/updateUserLocation/:id', controllers.updateUserLocation)
router.post('/userLogOut', controllers.userLogOut)
router.post('/addCustomerDetails/:id', controllers.addCustomerDetails)
router.post('/updateCustomerDetails', controllers.updateCustomerDetails)
module.exports = router;