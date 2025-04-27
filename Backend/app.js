require('dotenv').config(); 

const express = require('express');     
const mongoose = require('mongoose');
const ClassRouter = require('./Routes/ClassRoutes');
const userRouter = require('./Routes/UserRoutes');
const MaterialRoutes = require('./Routes/materialRoutes');
const paymentRouter = require('./Routes/PaymentRoutes');
const Adverticement = require('./Routes/AdverticeRout');
const salaryRouter = require('./Routes/SalaryRoutes');

const app = express();
const cors = require('cors');


app.use(express.json());
app.use(cors());
app.use("/Classes",ClassRouter);
app.use("/Users",userRouter);
app.use("/payments",paymentRouter);
app.use("/MaterialRoutes", MaterialRoutes);
app.use("/Adverticement", Adverticement);
app.use("/api/salary", salaryRouter);

const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL)
.then(()=> console.log("Server is running!"))
.then(()=>{
    app.listen(5000);
})
.catch((error)=> console.error("error connecting",error));