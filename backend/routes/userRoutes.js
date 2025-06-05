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

const router = express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.post('/logout', logoutUser);

router.get('/current', auth, getCurrentUser)

router.patch('/password', auth, changePassword)

router.delete('/account', auth, deleteAccount)

router.get('/admin-only', auth, isAdmin, (req, res) => {
    res.status(200).json({ message: 'Welcome, admin!' })
})

export default router