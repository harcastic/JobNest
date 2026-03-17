import mongoose from 'mongoose'

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
        ref : "User",
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