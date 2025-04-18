import { User } from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config({ path: './.env' }) // load environment variables

// register a User
export const registerUser = async (req, res) => {
    // get User info
    const { username, password, role } = req.body

    try {
        // check if username is taken
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({error: 'User already exists'})
        }

        // encrypt password and create User
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await User.create({
            username,
            password: hashedPassword,
            role
        })

        // send response with new User
        res.status(200).json(user)
    } catch (error) {
        // send response with error message
        res.status(400).json({error: error.message})
    }
}

// login a User
export const loginUser = async (req, res) => {
    // get User info
    const { username, password } = req.body

    try {
        // validate user exists
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        // validate password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({error: 'Invalid credentials'})
        }

        // sign token and send success response
        const token = jwt.sign({
            username: user.username,
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' })
        return res.status(200).json({ result: user, token, role: user.role })
    } catch (error) {
        // send response with error message
        return res.status(400).json({error: error.message})
    }
}

// get the current User
export const getCurrentUser = async (req, res) => {
    try {
        // get User and validate
        const user = await User.findById(req.userId).select('-password')
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        // send response with username and role
        return res.status(200).json(user)
    } catch (error) {
        // send response with error message
        return res.status(400).json({error: error.message})
    }
}

// logout a User
export const logoutUser = async (req, res) => {
    try {
        
        return res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}