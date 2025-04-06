import express from  'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import cors from "cors";
import categryRoutes from "./routes/categoryRoutes.js"
import productRoues from "./routes/productRoutes.js"
//configure env
dotenv.config();


//database config
connectDB();



// rest object
const app=express()

//middleware
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth',authRoutes);
app.use("/api/v1/category",categryRoutes);
app.use("/api/v1/product",productRoues)





//rest api

app.get('/',(req,res)=>{
    res.send("<h1>welcome to ecommerce app</h1>")
})

//Port

const PORT=process.env.PORT||8080;

//Listen
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`.bgCyan.white);
})