import Chat from "../../../DB/models/chat.model.js"
import Company from "../../../DB/models/company.model.js"
import { validateUserToken } from "../../../Middleware/authentication.middleware.js"
import { socketConnections } from "../../../utils/socket.utils.js"




export const sendMessageService = async (socket) => {
    socket.on('sendmessage', async (message) => {
        const authUser = await validateUserToken(socket.handshake.auth.accesstoken)

        const isCompanyOwnerOrHr = await Company.findOne(
            {
                $or: [
                    {createdBy: authUser._id},
                    {HRs: {$in: authUser._id}}
                ],
                deletedAt: null, 
                bannedAt: null
            }
        )
        if(!isCompanyOwnerOrHr){
            return 'Unauthorized'
        }

        const {body, receiverId} = message

        const chat = await Chat.findOneAndUpdate(
            {
                senderId: authUser._id,
                receiverId
            },
            {
                $addToSet: {
                    messages: {
                        body,
                        senderId: authUser._id
                    }
                }
            }
        )

        if(!chat){
            chat = await Chat.create(
                {
                    senderId: authUser._id,
                    receiverId,
                    messages: [{
                        body,
                        senderId: authUser._id
                    }]
                }
            )
        }
        socket.emit('successMessage', {body, chat})

        const messageReceiver_SId = socketConnections.get(receiverId.toString())
        socket.to(messageReceiver_SId).emit('receiveMessage', {body})
    })
}