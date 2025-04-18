import express from "express"
import { 
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    changePassword,
    deleteAccount
} from "../controllers/userController.js"
import {
    auth,
    isAdmin
} from "../middleware/auth.js"

// create empty router
const router = express.Router()

// POST a new User
router.post('/register', registerUser)

// POST an existing User
router.post('/login', loginUser)

// POST logout User
router.post('/logout', logoutUser);

// GET the current User
router.get('/current', auth, getCurrentUser)

// PATCH update user password
router.patch('/password', auth, changePassword)

// DELETE user account
router.delete('/account', auth, deleteAccount)

// Example protected route that only admins can access
router.get('/admin-only', auth, isAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome, admin!' })
})

// export router to be used by the server
export default router