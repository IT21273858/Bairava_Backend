const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
    console.log("Reqest incoming to Get All users...");

    try {
        const users = await userService.getAllUsers();
        if (users) {
            res.status(200).json({ status: true, users, message: 'Data retrived sucessfully' });
        }
        else {
            res.status(404).json({ status: false, message: 'No data available ' });
        }
    } catch (error) {
        console.log("Users fetch error", error);
        res.status(500).json({ error: 'Error retrieving users', message: error });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(id);
        if (user) {
            res.status(200).json({ status: true, user, message: "User found" });
        } else {
            res.status(404).json({ status: false, error: 'User not found' });
        }
    } catch (error) {
        console.log("User fetch error", error);
        res.status(500).json({ status: false, error: 'Error retrieving user', message: error });
    }
};

const createUser = (req, res) => {
    try {
        const user = userService.createUser(req.body);
        user.then(() => { res.status(201).json({ status: true, message: "User Created Sucessfully" }); })
            .catch((error) => {
                if (error.message == 'P2002') {
                    res.status(500).json({ status: false, message: "New user cannot be created with this email", code: "P2002" });
                }
                else {
                    res.status(404).json({ status: false, message: "User Creation UnSucessfull... Please check variables :(", error: error });
                }
            })
    } catch (error) {
        console.log("User creation Error", error);

        res.status(500).json({ error: `User could not be created - ${error} `, message: error });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userService.updateUser(id, req.body);
        if (user) {
            res.status(200).json({ status: true, message: "User Updated Sucessfully" });
        }
        else {
            res.status(404).json({ status: false, message: "No user found to update" })
        }
    } catch (error) {
        console.log("User update error", error);

        res.status(500).json({ error: 'User could not be updated' });
    }
};

const deleteUser = async (req, res) => {
    console.log("Income to delete User....");

    const { id } = req.params;
    try {
        const response = await userService.deleteUser(id);

        if (response.code === 'P2025') {
            res.status(403).json({ status: false, message: 'User Not found for delete...' })
        }
        else {
            res.status(200).json({ status: true, message: 'User deleted' });
        }
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ status: false, error: 'User could not be deleted', message: error });
    }
};

const login = async (req, res) => {
    try {
        const { token } = await userService.login(req.body.email, req.body.password);
        if (token) {
            res.status(200).json({ status: true, token });
        } else {
            res.status(404).json({ status: false, error: 'Invalid login' });
        }
    } catch (error) {
        console.log("Login error", error);

        res.status(500).json({ error: `Error While login` });
    }
};
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    login,
    deleteUser
};
