import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config({ path: './.env' }) // load environment variables

// authorizes the jsonwebtoken
export const auth = (req, res, next) => {
    // Check for Authorization header and extract token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'No token, authorization denied'});
    }
    
    // Extract the token from the Bearer format
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({error: 'No token, authorization denied'})
    }

    try {
        // decode and set token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id 
        req.userRole = decoded.role 
        next()
    } catch (error) {
        res.status(401).json({error: 'Token is not valid'})
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