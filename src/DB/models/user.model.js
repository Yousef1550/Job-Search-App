import mongoose from "mongoose";
import { gendersEnum, otpEnum, ProvidersEnum, systemRoles } from "../../Constants/constants.js";
import { hashSync } from "bcrypt";
import { decryption, encryption } from "../../utils/encryption.utils.js";



const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        default: ProvidersEnum.SYSTEM,
        enum: Object.values(ProvidersEnum)
    },
    gender: {
        type: String,
        default: gendersEnum.NOT_SPECIFIED,
        enum: Object.values(gendersEnum)
    },
    DOB: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => {
                const today = new Date()
                const minValidDate = new Date()
                minValidDate.setFullYear(today.getFullYear() - 18)  // age must be > 18
                return value < today && value <= minValidDate       // DOB should be less than 2007 
            },
            message: 'Enter a valid DOB, user must be at least 18 years old'
        }
    },
    mobileNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: systemRoles.USER,
        enum: Object.values(systemRoles)
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    bannedAt: Date,
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    changeCredentialTime: Date,
    profilePic: {
        secure_url: String,
        public_id: String
    },
    coverPic: {
        secure_url: String,
        public_id: String
    },
    OTP: [{
        code: {
            type: String,
            required: true
        },
        otpType: {
            type: String,
            enum: Object.values(otpEnum),
            required: true
        },
        expiresIn: {
            type: Date,
            required: true
        }
    }]
}, {
    timestamps: true,
    toJSON: {           
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})



userSchema.virtual('username').get( function(){
        return `${this.firstName} ${this.lastName}`
    } 
)

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = hashSync(this.password, +process.env.SALT_ROUNDS)
    }

    if(this.isModified('mobileNumber')){
        this.mobileNumber = await encryption({value: this.mobileNumber, secretKey: process.env.SECRET_KEY_PHONE})
    }
    next()
})

userSchema.post('findOne', async function(doc){
    if(doc){
        doc.mobileNumber = await decryption({cipher: doc.mobileNumber, secretKey: process.env.SECRET_KEY_PHONE})
    }
})


const User = mongoose.models.user || mongoose.model('User', userSchema)


export default User