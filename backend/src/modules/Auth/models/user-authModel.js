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
        required : true,
        enum : ["admin", "recruiter" ,"user"], // Admin to manage platfrom  // Recruiter - posting Jobs  // User - Job seekers
        default :"user"
    },
    bio : {
        type : String,
        default : ""
    },
    skills : [
        {
            type : [String],
            default : [] 
        }
    ],
    experienceLevel : {
        type : String
    },
    location : {
        type : String,
        default : ""
    },
    profileImage : {
        type : String,
        default : ""
    },
    resume :{
        type : String
    },
    companyName : {
        type : String,
        default : ""
    },
    isVerifiedRecruiter :{
        type : Boolean,
        default : false
    }
},
    {
        timestamps : true, 
    }
);

const User = mongoose.model("User", userSchema);

export default  User;