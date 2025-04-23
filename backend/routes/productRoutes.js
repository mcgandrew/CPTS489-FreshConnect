import express from "express"
import {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
} from "../controllers/productController.js"

// create empty router
const router = express.Router()

// GET all Products
router.get("/", getProducts)

// GET a Product
router.get("/:id", getProduct)

// POST a new Product
router.post("/", createProduct)

// DELETE a Product
router.delete("/:id", deleteProduct)

// PATCH a Product
router.patch("/:id", updateProduct)

export default router