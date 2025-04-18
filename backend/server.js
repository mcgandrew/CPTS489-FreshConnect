import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config({ path: '.env'}) // load environment variables

// express app
const app = express()
app.use(cors())

app.use(express.json({ limit: '50mb' })) // Increase from default 1mb to 50mb
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Fresh Connect' })
})
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/users', userRoutes)

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