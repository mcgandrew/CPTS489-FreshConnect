import express from "express"
import {
    getOrders,
    getOrder,
    createOrder,
    deleteOrder,
    updateOrder,
    getUserOrders
} from "../controllers/orderController.js"

// create empty router
const router = express.Router()

// GET all Orders (admin route)
router.get("/", getOrders)

// GET orders for the current user
router.get("/user", getUserOrders)

// GET an Order
router.get("/:id", getOrder)

// POST a new Order
router.post("/", createOrder)

// DELETE an Order
router.delete("/:id", deleteOrder)

// PATCH an Order
router.patch("/:id", updateOrder)

// export router to be used by the server
export default router