const express = require('express');
const routers = express.Router();
const adminControllers = require('../controllers/adminController');
//get
routers.get('/', (req, res) => {
    res.redirect('/authentication/adminLogin')
})
routers.get('/getAllUserData', adminControllers.getAllUserData);
routers.get('/getOneDataOfUser/:id', adminControllers.adminGetOneDataOfUser);
routers.get('/allProducts', adminControllers.getProducts);
routers.get('/getCustomers/:id', adminControllers.getCustomers)
//post
routers.post('/adminLogin', adminControllers.adminLogIn);
routers.post('/userRegister', adminControllers.adminUserRegister);
routers.post('/addProducts', adminControllers.productAdd);
routers.post('/adminLogOut', adminControllers.adminLogOut);
routers.put('/:id', adminControllers.editUser);
routers.put('/:id', adminControllers.editProduct);
//delete
routers.delete('/:id', adminControllers.deleteUser)
routers.delete('/:id', adminControllers.deleteProduct);
module.exports = routers;