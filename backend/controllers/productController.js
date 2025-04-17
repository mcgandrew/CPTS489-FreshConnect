import mongoose from "mongoose"
import { Product } from "../models/Product.js"

// get all Products
export const getProducts = async(req, res) => {
    // get Products
    const products = await Product.find({}).sort({createdAt: -1})

    // send response with Products
    res.status(200).json(products)
}

// get one Product
export const getProduct = async(req, res) => {
    // get Product id
    const { id } = req.params

    // check valid id type
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }

    // get Product
    const product = await Product.findById(id)

    // check valid Product
    if (!product) {
        return res.status(404).json({error: 'No such Product'})
    }

    // send response with Product
    res.status(200).json(product)
}

// create a Product
export const createProduct = async(req, res) => {
    // get new Product info
    const {
        name,
        vendor,
        price,
        unit,
        category,
        location,
        image,
        description,
    } = req.body

    try {
        // create Product
        const product = await Product.create({
            name,
            vendor,
            price,
            unit,
            category,
            location,
            image,
            description
        })

        // send response with id of new Product
        res.status(200).json(product)
    } catch(error) {
        // send response with error message
        res.status(400).json({error: error.message})
    }
}

// delete a Product
export const deleteProduct = async(req, res) => {
    // get Product id
    const { id } = req.params

    // check valid id type
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }

    // delete Product
    const product = await Product.findOneAndDelete({_id: id})

    // check valid Product
    if (!product) {
        return res.status(404).json({error: 'No such Product'})
    }

    // send response with deleted Product
    res.status(200).json(product)
}

// update a Product
export const updateProduct = async(req, res) => {
    // get Product id
    const { id } = req.params

    // check valid id type
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }

    // update Product
    const product = await Product.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    // check valid Product
    if (!product) {
        return res.status(404).json({error: 'No such Product'})
    }

    // send response with updated Product (before changes)
    res.status(200).json(product)
}