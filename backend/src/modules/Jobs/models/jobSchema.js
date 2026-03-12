import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    companyName : {
        type : String,
        required : true
    },
    aboutCompany : {
        type : String,
        required : true
    },
    jobDescription : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    duration : {
        type : String
    },
    salary : {
        type : String
    },
    jobType : {
        type : String,
        enum : ["Onsite", "Hybrid", "Remote"],
        required : true
    },
    timing : {
        type : String
    },
    skillsRequired : [
        {
            type : String
        }
    ],
    importantDates : {
        applicationDeadline : Date,
        startDate : Date
    },
    recruiter : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},
    {
        timestamps : true
    }
);

const Job = mongoose.model("Job" ,jobSchema);

export default Job;