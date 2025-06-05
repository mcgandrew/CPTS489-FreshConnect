import mongoose from "mongoose"
import { Order } from "../models/Order.js"
import jwt from 'jsonwebtoken';


export const getOrders = async(req, res) => {

    const orders = await Order.find({}).sort({createdAt: -1})

    res.status(200).json(orders)
}

export const getOrder = async(req, res) => {

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }

    const order = await Order.findById(id)

    if (!order) {
        return res.status(404).json({error: 'No such Order'})
    }

    res.status(200).json(order)
}

export const getUserOrders = async(req, res) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token required' });
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded._id;
        
        // Find orders for this user
        const orders = await Order.find({ userId: userId }).sort({createdAt: -1});
        
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(401).json({ error: 'Request is not authorized' });
    }
}

export const createOrder = async(req, res) => {
    const authHeader = req.headers.authorization;
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id || decoded._id;
        } catch (error) {
            return res.status(401).json({ error: 'Invalid authorization token' });
        }
    } else {
        return res.status(401).json({ error: 'Authorization token required' });
    }
    
    const {
        status,
        total,
        items
    } = req.body

    try {
        const order = await Order.create({
            userId, 
            status,
            total,
            items
        })

        res.status(200).json(order)
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

export const deleteOrder = async(req, res) => {

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }

    const order = await Order.findOneAndDelete({_id: id})

    if (!order) {
        return res.status(404).json({error: 'No such Order'})
    }

    res.status(200).json(order)
}

export const updateOrder = async(req, res) => {

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }


    const order = await Order.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!order) {
        return res.status(404).json({error: 'No such Order'})
    }

    res.status(200).json(order)
}