import express from 'express'
import dotenv from "dotenv";
dotenv.config();

import dbConnect from './config/dbConnect.js'
dbConnect();

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;
import authRouter from './modules/Auth/routes/authRoute.js';

// app.use('/' , (req, res)=>{
//     res.send("Working server");
// });

app.use('/api/auth', authRouter);


app.listen(port , () =>{
    console.log(`Server is running on port ${port}`);
});
