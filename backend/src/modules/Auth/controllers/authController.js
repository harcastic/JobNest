import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/user-authModel.js";


const register = async(req, res) => {
    try {
        const {username , email , password, role } = req.body;
        const existingUser = await User.findOne({email});
    
        if(existingUser){
            return res.status(401).json({ message : "User already exists"});
        }
        const hassedPwd = await bcrypt.hash(password, 10);
    
        const newUser = await User.create({
            username ,
            email,
            password : hassedPwd,
            role 
        });

        return res.status(201).json({
            message : `User registered successfully! : ${username} `,
            newUser 
        });
    
    } 
    catch (error) {
        return res.status(500).json({ message : "Server error"});
    }
};
export default register;


export const login = async(req, res) => {
    try {
        const {username, email, password } = req.body;
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        });
    
        if(!user) { 
            return res.status(404).json({ 
                message : `User with ${username} not found`
            });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if(!isMatch){
            return res.status(400).json({
                message : "Invalid Credentials"
            });
        }
    
        const token = jwt.sign(
            {id : user._id, role : user.role},
            process.env.TOKEN_SECRET_KEY,
            {expiresIn : '2h'}
        );
    
        return res.status(200).json({token});
    } 
    catch (error) {
        return res.status(500).json({
            message : "Login failed! Something went wrong"
        })    
    }
};