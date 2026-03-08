import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required :true
    },
    email : {
        type : String,
        unique : true,
        required : true,
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        requied : true,
        enum : ["admin", "user"],
        default :"user"
    }
},
    {
        timestamps : true, 
    }
);

const User = mongoose.model("User", userSchema);

export default  User;