import mongoose from "mongoose";



const companySchema = mongoose.Schema({
    companyName: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    numberOfEmployees: {
        type: Number,
        required: true,
        min: [10, 'Number of employees must be at least 10'],
        max: [1000, 'Number of employees can not exceed 1000']
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    logo: {
        secure_url: String,
        public_id: String,
    },
    coverPic: {
        secure_url: String,
        public_id: String
    },
    HRs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    bannedAt: Date,
    deletedAt: Date,
    legalAttachment: {
        secure_url: String,
        public_id: String
    },
    approvedByAdmin: Boolean

}, {
    timestamps: true,
    toJSON: {           
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})


companySchema.virtual('Jobs', {
    ref: 'Job',         
    localField: '_id',      
    foreignField: 'companyId'     
})


const Company = mongoose.models.Company || mongoose.model('Company', companySchema)


export default Company