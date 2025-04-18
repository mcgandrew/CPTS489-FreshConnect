import mongoose from "mongoose"
import { Order } from "../models/Order.js"
import jwt from 'jsonwebtoken';

// get all Orders
export const getOrders = async(req, res) => {
    // get Orders
    const orders = await Order.find({}).sort({createdAt: -1})

    // send response with Orders
    res.status(200).json(orders)
}

// get one Order
export const getOrder = async(req, res) => {
    // get Order id
    const { id } = req.params

    // check valid id type
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }

    // get Order
    const order = await Order.findById(id)

    // check valid Order
    if (!order) {
        return res.status(404).json({error: 'No such Order'})
    }

    // send response with Order
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
        
        // Send response with user's orders
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(401).json({ error: 'Request is not authorized' });
    }
}

// create an Order
export const createOrder = async(req, res) => {
    // Extract userId from token
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
    
    // get new Order info
    const {
        status,
        total,
        items
    } = req.body

    try {
        // create Order with userId
        const order = await Order.create({
            userId, // Add this line to include the user ID
            status,
            total,
            items
        })

        // send response with id of new Order
        res.status(200).json(order)
    } catch(error) {
        // send response with error message
        res.status(400).json({error: error.message})
    }
}

// delete an Order
export const deleteOrder = async(req, res) => {
    // get Order id
    const { id } = req.params

    // check valid id type
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }

    // delete Order
    const order = await Order.findOneAndDelete({_id: id})

    // check valid Order
    if (!order) {
        return res.status(404).json({error: 'No such Order'})
    }

    // send response with deleted Order
    res.status(200).json(order)
}

// update an Order
export const updateOrder = async(req, res) => {
    // get Order id
    const { id } = req.params

    // check valid id type
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }

    // update Order
    const order = await Order.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    // check valid Order
    if (!order) {
        return res.status(404).json({error: 'No such Order'})
    }

    // send response with updated Order (before changes)
    res.status(200).json(order)
}