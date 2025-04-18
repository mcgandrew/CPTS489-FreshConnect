import mongoose from "mongoose"
import { productSchema } from "./Product.js"

const orderSchema = mongoose.Schema({
    status:{
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        required: true
    },
    total:{
        type: Number,
        required: true
    },
    items:[productSchema]
}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema)