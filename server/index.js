import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

dotenv.config();

const app = express();
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
    response.json({ message: "Hello from server! Server is Running" + PORT });
});

//use user.route.js which basically use registerUserController(user.controller.js)
app.use('/api/user',userRouter);
//use category.route.js which basically use UploadCategoryController(category.controller.js)
app.use('/api/category', categoryRouter);
//use uploadImage.route.js which basically use uploadImageController(uploadImage.controller.js)
app.use('/api/file', uploadImageRouter);
//use subCategory.route.js which basically use AddSubCatgoryController(subCategory.controller.js)
app.use('/api/subcategory', subCategoryRouter);
//use product.route.js which basically use AddProductController(product.controller.js)
app.use('/api/product', productRouter);
//use cart.route.js which basically use AddProductToCartController(cart.controller.js)
app.use('/api/cart', cartRouter);


//before starting the server, connect to the database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
