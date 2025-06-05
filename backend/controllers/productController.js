import mongoose from "mongoose"
import { Product } from "../models/Product.js"

export const getProducts = async(req, res) => {

    const products = await Product.find({}).sort({createdAt: -1})

    res.status(200).json(products)
}

export const getProduct = async(req, res) => {

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }

    const product = await Product.findById(id)

    if (!product) {
        return res.status(404).json({error: 'No such Product'})
    }

    res.status(200).json(product)
}

export const createProduct = async(req, res) => {
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

        res.status(200).json(product)
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

export const deleteProduct = async(req, res) => {

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }

    const product = await Product.findOneAndDelete({_id: id})

    if (!product) {
        return res.status(404).json({error: 'No such Product'})
    }

    res.status(200).json(product)
}

export const updateProduct = async(req, res) => {

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid id'})
    }

    const product = await Product.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!product) {
        return res.status(404).json({error: 'No such Product'})
    }

    res.status(200).json(product)
}