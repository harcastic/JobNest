import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    job : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Job",
        required : true
    },
    recruiter : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    fullName : {
        type : String,
        required :true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    resume : {
        type : String,
        required : true 
    },
    portfolio :{
        type : String
    },
    experience : {
        type : String,
        required : true
    },
    skills : {
        type : String
    },
    availability : {
        type : String
    },
    salaryExpectation : {
        type : String
    },
    workAuthorization : {
        type : Boolean,
        required : true
    },
    status : {
        type : String,
        enum : ["pending", "accepted", "rejected", "reviewed"],
        default : "pending"
    }
},
    {
        timestamps : true
    }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;