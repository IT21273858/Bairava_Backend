const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require('../models/userModel');
const { Prisma } = require("@prisma/client");

const getAllUsers = async () => {
    return await userModel.findMany();
};

const getUserById = async (id) => {
    return await userModel.findUnique({ where: { id } });
};

const createUser = async (userDetails) => {
    console.log("Income to create a user.....");
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    return new Promise((resolve, reject) => {
        userModel.findUnique({ where: { email: userDetails.email } }).then((isfound) => {
            if (isfound) {
                console.log("Sorry... credentials already exist... \n try to login :)");
                reject(new Error("P2002"));
            } else {
                const data = {
                    uid: userDetails.uid,
                    name: userDetails.name,
                    u_name: userDetails.u_name,
                    email: userDetails.email,
                    password: hashedPassword,
                    salary: userDetails.salary,
                    position: userDetails.position,
                    phoneNumber: userDetails.phoneNumber,
                    joined_date: userDetails.joined_date,
                };
                userModel.create({ data }).then((res) => {
                    console.log("user has been created sucessfully..");
                    console.log(res);
                    resolve(true);
                })
                    .catch((error) => {
                        console.log("Sorry cannot create an account for you... :(",error);
                        if (error instanceof Prisma.PrismaClientKnownRequestError) {
                            if (error.code === 'P2002') {
                                reject(new Error("P2002"));
                            } else {
                                reject(new Error("Prisma error"));
                            }
                        } else {
                            reject(new Error("Unexpected error"));
                        }
                    });
            }
        }).catch((error) => {
            reject(new Error("Unexpected error"));
        });
    });
};

const updateUser = async (id, userDetails) => {
    const updateData = { ...userDetails };

    if (userDetails.password) {
        updateData.password = await bcrypt.hash(userDetails.password, 10);
    }
    const isfound = await userModel.findUnique({ where: { id } })
    if (isfound) {
        new Promise((resolve, reject) => {
            userModel.update({
                where: { id },
                data: updateData,
            }).then((response) => resolve(response)).catch((error) => { reject(error) })
        })
        return true
    }
    else {
        return false
    }
};

const deleteUser = async (id) => {
    try {
        const result = await userModel.delete({ where: { id } });
        console.log(result);
        return result;
    } catch (error) {
        console.error("Error deleting user:", error);
        return error;
    }
};


const login = async (email, password) => {
    console.log("Request income to login....");
    const user = await userModel.findUnique({
        where: {
            email: email,
        }
    })

    if (user && await bcrypt.compare(password, user.password)) {
        console.log("Login sucess.... sending token.....");
        const token = generateToken(user);
        return { token };
    } else {
        console.log("Invalid user credentials....");
        throw new Error("Invalid username or password");
    }
}

// Generating JWT Token for successful login
function generateToken(user) {
    console.log("Creating token....");
    const secretKey = process.env.JWT_SECRET; // Use environment variable for the secret key
    const expiresIn = "1h";
    console.log("Token generated");
    return jwt.sign({ id: user._id, name: user.name, img: user.profile_img }, secretKey, { expiresIn });
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    login,
    deleteUser
};
