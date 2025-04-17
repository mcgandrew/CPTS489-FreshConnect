import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import productRoutes from "./routes/productRoutes.js"

dotenv.config({ path: '.env'}) // load environment variables

// express app
const app = express()
app.use(express.json())

// middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.get('/', (req, res) => {
    res.json({mssg: 'Welcome to FreshConnect!'})
})
app.use('/products', productRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db and listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

export default app