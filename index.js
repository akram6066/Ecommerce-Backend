const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const categoryRouter = require('./Routes/categoryRoutes.js'); // Require the category router
const orderRoutes = require('./Routes/orderRouters.js');
const products =require('./Routes/productRouter.js')
const userRote = require('./Routes/userRoutes.js');
const paymentRouter = require('./Routes/parmentRouter.js');
const bannerRouter = require('./Routes/bannersRouter.js');

const app = express();
app.use(bodyParser.json());
dotenv.config();

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static('upload'));

app.use(express.urlencoded({extended:false}));
// Routes
// Use the category router
app.use('/api/categories', categoryRouter);
app.use('/api/user', userRote);
app.use('/api/products', products,);
// Use the order routes
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRouter);
app.use('/api/banners', bannerRouter);



mongoose.connect(process.env.MONGODB_URL,{
   
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
},).then(()=>{
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log(err.message);
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})
