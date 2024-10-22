const employeeService = require('../services/employeeServices')
const employeeModel = require('../models/employeeModel')


const getAllEmployees = async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        if (employees) {
            res.status(200).json({ status: true, employees, message: "Data retreived sucess" });
        }
        else {
            res.status(404).json({ status: false, message: "Not Data Available" })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving employees' });
    }
};

const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await employeeService.getEmployeeById(id);
        if (employee) {
            res.status(200).json({ status: true, employee, message: "Employee found" });
        } else {
            res.status(404).json({ status: false, error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error retrieving employee' });
    }
};

const createEmployee = (req, res) => {
    try {
        const employee = employeeService.createEmployee(req.body);
        employee.then(() => { res.status(201).json({ status: true, message: "Employee Created Sucessfully" }); })
            .catch((error) => {
                if (error.message == 'P2002') {
                    res.status(500).json({ status: false, message: "New user cannot be created with this email", code: "P2002" });
                }
                else {
                    res.status(404).json({ status: false, message: "Employee Creation UnSucessfull" });
                }
            })
    } catch (error) {
        res.status(500).json({ error: `Employee could not be created - ${error} ` });
    }
};

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await employeeService.updateEmployee(id, req.body);
        if (employee) {
            res.status(200).json({ status: true, message: "Employee Updated Sucessfully" });
        }
        else {
            res.status(404).json({ status: false, message: "No user found to update" })
        }
    } catch (error) {
        res.status(500).json({ error: 'Employee could not be updated' });
    }
};

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    const userId = req.body.id;
    try {
        const response = await employeeService.deleteEmployee(id, userId);
        if (response == 'Not an Employee') {
            res.status(403).json({ status: false, message: response })
        }
        else {
            res.status(200).json({ status: true, message: 'Employee deleted' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Employee could not be deleted' });
    }
};

const forgotEmployee = async (req, res) => {
    const email = req.body.email;

    try {
        const employee = await employeeModel.findUnique({ where: { email: email } });

        if (!employee) {
            console.log("Employee not found");
            return res.status(404).json({ status: false, message: "Employee Not found" });
        }

        const response = await employeeService.forgotpassword(email);

        if (response === 'Not Found') {
            res.status(404).json({ status: false, message: 'Email not found' });
        } else if (response === 'OTP Sent') {
            res.status(200).json({ status: true, message: 'Reset Link Sent successfully :)' });
        } else if (response === 'Error in Mailing') {
            res.status(500).json({ status: false, message: 'Error in sending email' });
        } else {
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }

    } catch (error) {
        console.log("Error in forgot password process:", error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
};


const verifyotp = async (req, res) => {
    try {
        // Get the result directly from verifyForgototp
        const result = await employeeService.verifyForgototp(req.body.email, req.body.otp, req.body.password);
        console.log("Response from verifyForgototp:", result);

        // Handle the response based on the message in the result
        if (result.message === 'Success') {
            res.status(200).json({ status: true,message:"Password reset Suceess" });
        } else if (result.message === 'Employee not found') {
            res.status(404).json({ status: false, error: 'Email not found' });
        } else if (result.message === 'Invalid OTP or expired code') {
            res.status(400).json({ status: false, error: 'Invalid OTP or expired code' });
        } else if (result.message === 'Error in resetting') {
            res.status(403).json({ status: false, error: result.error });
        } else {
            res.status(400).json({ status: false, error: 'Unknown error occurred' });
        }
    } catch (error) {
        console.log("Error while resetting:", error);
        res.status(500).json({ message: 'Error while resetting password', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { token } = await employeeService.login(req.body.email, req.body.password);
        console.log("Response from login is....",token);
        
        if (token) {
            res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true, Domain: process.env.Origins }).status(200).json({ status: true, token });
        } else {
            res.status(404).json({ status: false, error: 'Invalid Login Credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: `Error While login`,error:error });
    }
};
module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    login,
    forgotEmployee,
    verifyotp
};
