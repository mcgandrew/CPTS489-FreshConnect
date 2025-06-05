import express from "express"
import {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder,
    getUserOrders
} from "../controllers/orderController.js"

const router = express.Router()

router.get("/", getOrders)

router.get("/user", getUserOrders)

router.get("/:id", getOrder)

router.post("/", createOrder)

router.delete("/:id", deleteOrder)

router.patch("/:id", updateOrder)

export default router