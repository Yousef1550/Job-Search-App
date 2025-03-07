import mongoose from "mongoose";
import { jobLocationEnum, seniorityLevelEnum, WorkingTimeEnum } from "../../Constants/constants.js";
import mongoosePaginate from "mongoose-paginate-v2";




const jobSchema = mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobLocation:{
        type: String,
        enum: Object.values(jobLocationEnum),
        required: true
    },
    workingTime: {
        type: String,
        enum: Object.values(WorkingTimeEnum),
        required: true
    },
    seniorityLevel: {
        type: String,
        enum: Object.values(seniorityLevelEnum),
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    technicalSkills: [String],
    softSkills: [String],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,       // HR id
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,       // HR id (should be realted to the company which will announce for this job)
        ref: 'User',
    },
    closed: {
        type: Boolean,
        default: false
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,      
        ref: 'Company',
        required: true
    }
}, {
    timestamps: true,
    toJSON: {           
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
}
)


jobSchema.plugin(mongoosePaginate)  // add the plugin to the job schema


jobSchema.virtual('Applications', {
    ref: 'Application',         // Application model
    localField: '_id',      // job Id
    foreignField: 'jobId'     // the job Id in the Application model 
})


const Job = mongoose.models.Job || mongoose.model('Job', jobSchema)


export default Job