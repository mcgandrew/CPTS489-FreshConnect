import mongoose from "mongoose"
import { Order } from "../models/Order.js"

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

// create an Order
export const createOrder = async(req, res) => {
    // get new Order info
    const {
        status,
        total,
        items
    } = req.body

    try {
        // create Order
        const order = await Order.create({
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