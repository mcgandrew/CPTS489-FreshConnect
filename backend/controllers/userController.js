import { User } from "../models/User.js"
import { Product } from "../models/Product.js" 
import { Order } from "../models/Order.js" 
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config({ path: './.env' }) 

export const registerUser = async (req, res) => {

    const { username, password, role } = req.body

    try {

        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({error: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await User.create({
            username,
            password: hashedPassword,
            role
        })

        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

export const loginUser = async (req, res) => {

    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({error: 'Invalid credentials'})
        }

        const token = jwt.sign({
            username: user.username,
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' })
        return res.status(200).json({ result: user, token, role: user.role })
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}

export const logoutUser = async (req, res) => {
    try {
        return res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new password are required' });
    }
    
    try {

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 12);
  
        user.password = hashedPassword;
        await user.save();
        
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ error: 'An error occurred while changing password' });
    }
};

export const deleteAccount = async (req, res) => {
    try {

        const user = await User.findByIdAndDelete(req.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await Product.deleteMany({ vendor: user.username });
        
        // Delete user's orders too
        await Order.deleteMany({ userId: req.userId });
        
        return res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(500).json({ error: 'An error occurred while deleting account' });
    }
};