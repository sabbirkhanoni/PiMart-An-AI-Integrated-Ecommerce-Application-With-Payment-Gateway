import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';

import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadImageRouter from './route/uploadImage.route.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import deliveryAddressRouter from './route/deliveryAddress.route.js';
import orderRouter from './route/order.route.js';
import sslcommerzRouter from './route/SSLCOMMERZ.route.js';


const app = express();

app.use('/api/order/webhook', express.raw({ type: 'application/json' }));

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
}));


app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({
    crossOriginOpenerPolicy: false
}));

const PORT = 8080 || process.env.PORT;

app.get("/", (request, response) => {
    response.json({ 
        message: "Hello from server! Server is Running" + PORT 
    });
});

app.use('/api/user',userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/file', uploadImageRouter);
app.use('/api/subcategory', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/delivery-address', deliveryAddressRouter);
app.use('/api/order', orderRouter);
app.use('/api', sslcommerzRouter);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
