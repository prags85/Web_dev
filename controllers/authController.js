import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address,answer } = req.body;

        // Validation
        if (!name) return res.status(400).json({ message: "Name is required" });
        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!password) return res.status(400).json({ message: "Password is required" });
        if (!phone) return res.status(400).json({ message: "Phone number is required" });
        if (!address) return res.status(400).json({ message: "Address is required" });
        if (!answer) return res.status(400).json({ message: "Answer is required" });

        // Check if user already exists
        const existinguser = await userModel.findOne({ email });
        if (existinguser) {
            return res.status(200).json({
                success: false,
                message: "Already registered, please login",
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Save new user
        const user = new userModel({ name, email, phone, address, password: hashedPassword,answer });
        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in registration",
            error,
        });
    }
};

//POST LOGIN 
export const loginController=async(req,res)=>{
    try {
        const {email,password}=req.body
        //validation
        if(!email || !password){
            return res.status(404).send({
                sucess:false,
                message:'Invalid email or password'
            })

        }
        const user=await userModel.findOne({email})
        if (!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registered'
            })
        }
        const match=await comparePassword(password,user.password)
        if (!match){
            return res.status(200).send({
                success:false,
                message:'Password is not matched'
            })
        }
        //token
        const token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.status(200).send({
            success:true,
            message:'login successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess:false,
            message:'Error in login',
            error
        })
        
    }
};


// forgot pass controller
export const forgotPasswordController = async (req, res) => {
    try {
      const { email, answer, newPassword } = req.body;
      if (!email) {
        res.status(400).send({ message: "Emai is required" });
      }
      if (!answer) {
        res.status(400).send({ message: "answer is required" });
      }
      if (!newPassword) {
        res.status(400).send({ message: "New Password is required" });
      }
      //check
      const user = await userModel.findOne({ email, answer });
      //validation
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Wrong Email Or Answer",
        });
      }
      const hashed = await hashPassword(newPassword);
      await userModel.findByIdAndUpdate(user._id, { password: hashed });
      res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  };

// test  Controller

export const testController=(req,res)=>{
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error)
        res.send({error})
        
    }
    
}

export const updateProfileController=async(req,res)=>{
    try {
        const {name,email,password,address,phone}=req.body
        const user=await userModel.findById(req.user._id)
        //password
        if(password&&password.length<6){
            return res.json({error:"Password is required  and 6 character long"})
        }
        const hashedPassword=password ? await hashPassword(password):undefined
        const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            password:hashedPassword || user.password,
            phone:phone || user.phone,
            address :address || user.address
        },{new:true})
        res.status(200).send({
            success:true,
            message:"Profile updated Successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"Error while updating profile",
            error

        })
        
    }
}

//orders

export const getOrdersController=async(req,res)=>{
    try {
const orders=await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
       res.json(orders) 
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting Order",
            error
        })
        
    }
}
export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: -1 }); // ✅ Correct sorting syntax
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Getting Orders",
        error,
      });
    }
};
export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };