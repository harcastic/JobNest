import express from 'express'
import dotenv from "dotenv";
dotenv.config();

import dbConnect from './config/dbConnect.js'
import authRouter from './modules/Auth/routes/authRoute.js';
import userRouter from './modules/User/routes/usersRoute.js';
import jobRouter from './modules/Jobs/routes/jobsRoute.js';
dbConnect();

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;


//Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/jobs', jobRouter);


app.listen(port , () =>{
    console.log(`Server is running on port ${port}`);
});
