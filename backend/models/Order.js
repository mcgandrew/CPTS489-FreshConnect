import mongoose from "mongoose"
import { productSchema } from "./Product.js"

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
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