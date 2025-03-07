import mongoose from "mongoose";




const chatSchema = mongoose.Schema({
    senderId: {                                  // chat starter, must be HR or company owner
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {                                   // chat replier
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // every single message data
    messages: [{
        body: {
            type: String,
            required: true 
        },
        sentAt: {
            type: Date,
            default: Date.now
        },
        // who send the message
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }]
}, 
    {
        timestamps: true
    }
)

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)



export default Chat