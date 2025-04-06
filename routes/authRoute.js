import express from "express"
import {registerController,loginController,testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from "../middelwares/authMiddleware.js"

//router object
const router=express.Router()

// routing
// Register || Method Post
router.post('/register',registerController)


// Login|| Post request

router.post('/login', loginController)

// Forgot Password  ||Post
router.post('/forgot-password',forgotPasswordController)

// test routes
router.get('/test',requireSignIn,isAdmin, testController)

//protected route auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})

//protected  Admin route auth
router.get('/admin-auth',requireSignIn,isAdmin, (req,res)=>{
    res.status(200).send({ok:true})
})

//update profile
router.put('/profile',requireSignIn,updateProfileController)

// order
router.get('/orders',requireSignIn,getOrdersController)

//all  order
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//order  status update
router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatusController)

export default router;