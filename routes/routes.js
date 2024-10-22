const express = require('express');
const userController = require('../src/controllers/userController');
const productController = require('../src/controllers/productController')
const employeeController = require('../src/controllers/employeeController')
const router = express.Router();

// User Routes
router.get('/users/getAll', userController.getAllUsers);
router.get('/users/get/:id', userController.getUserById);
router.post('/users/create', userController.createUser);
router.patch('/users/update/:id', userController.updateUser);
router.delete('/users/delete/:id', userController.deleteUser);
router.get('/users/login', userController.login);

// Product Routes
router.get('/products/getAll', productController.getAllProducts);
router.get('/products/get/:id', productController.getProductById);
router.post('/products/create', productController.createProduct);
router.patch('/products/update/:id', productController.updateProduct);
router.delete('/products/delete/:id', productController.deleteProduct);

// Employee Routes
router.get('/employees/getAll', employeeController.getAllEmployees);
router.get('/employees/get/:id', employeeController.getEmployeeById);
router.post('/employees/create', employeeController.createEmployee);
router.patch('/employees/update/:id', employeeController.updateEmployee);
router.delete('/employees/delete/:id', employeeController.deleteEmployee);
router.post('/employees/login', employeeController.login);
router.post('/employees/forgot', employeeController.forgotEmployee);
router.post('/employees/verifyotp', employeeController.verifyotp);

module.exports = router;


