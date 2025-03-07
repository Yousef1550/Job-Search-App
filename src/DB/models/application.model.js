import mongoose from "mongoose";
import { applicationStatusEnum } from "../../Constants/constants.js";



const applicationSchema = mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,       
        ref: 'Job',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,       
        ref: 'User',
        required: true
    },
    userCV: {
        type: {
            secure_url: String,
            public_id: String,
        },
        required: true
    },
    status: {
        type: String,
        default: applicationStatusEnum.PENDING,
        enum: Object.values(applicationStatusEnum)
    }
}, {timestamps: true})



const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema)


export default Application