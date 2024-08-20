const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth');
const uploadMiddleware = require('../middlewares/upload');
const uploadController = require('../controllers/UploadController');
const employeeController = require('../controllers/EmployeeController');
const vehicleController = require('../controllers/VehicleController');


// User
router.post('/register', employeeController.add_employee);
router.get('/get_employees', employeeController.get_employees);
router.get('/get_default_employee_by_email/:email', employeeController.get_employee_by_email);
router.put('/update_employee', employeeController.update_employee);

// Auth Routes
router.post('/login', authController.login);
router.post('/refresh_token', authController.refresh_token);
router.post('/forgot_password', authController.forgot_password);
router.post('/verify_code', authController.verify_code);
router.post('/change_password', authController.change_password);
router.delete('/logout', authController.logout);

// Vehicle
router.post('/add_vehicle', authMiddleware.authenticateToken, vehicleController.add_vehicle);
router.put('/update_vehicle', authMiddleware.authenticateToken, vehicleController.update_vehicle);
router.post('/search_vehicles', authMiddleware.authenticateToken, vehicleController.search_vehicles);
router.get('/get_dashboard_data', authMiddleware.authenticateToken, vehicleController.get_dashboard_data);
router.post('/get_vehicles', authMiddleware.authenticateToken, vehicleController.get_vehicles);
router.get('/get_vehicle_by_id/:id', authMiddleware.authenticateToken, vehicleController.get_vehicle_by_id);
router.delete('/delete_vehicle_by_id/:id', authMiddleware.authenticateToken, vehicleController.delete_vehicle_by_id);

// File Upload Routes
router.post('/upload', uploadMiddleware.upload, uploadController.upload_file);
router.get('/files', uploadController.get_files);
router.get('/file/:filename', uploadController.get_file_by_filename);
router.delete('/file/:id', uploadController.delete_file_by_id);

module.exports = router;