import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config({ path: './.env' }) // load environment variables

// authorizes the jsonwebtoken
export const auth = (req, res, next) => {
    // get current token and validate
    const token = req.header('x-auth-token')
    if (!token) {
        return res.status(404).json({error: 'No token, authorization denied'})
    }

    try {
        // decode and set token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id 
        req.userRole = decoded.role 
        next()
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// checks if the user is an admin
export const isAdmin = (req, res, next) => {
    // validate admin priviledge
    if (req.userRole !== 'admin') {
        return res.status(401).json({ message: 'Access denied. Admins only.' })
    }
    next()
}