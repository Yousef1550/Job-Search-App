import { validateUserToken } from "../Middleware/authentication.middleware.js"
import { sendMessageService } from "../Modules/User/services/chat.service.js"


export const socketConnections = new Map


const registerSocketId = async (handshake, sId) => {
    // get user accesstoken
    const accesstoken = handshake.auth.accesstoken
    
    // get loggedIn user data after verifying the token
    const authUser = await validateUserToken(accesstoken)

    // attach socketId to user _id
    socketConnections.set(authUser?._id?.toString(), sId)

    console.log('Socket Connected', socketConnections);
}


const removeSocketId = async (socket) => {
    return socket.on('disconnect', async () => {
        const accesstoken = socket.handshake.auth.accesstoken

        const authUser = await validateUserToken(accesstoken)
    
        socketConnections.delete(authUser?._id?.toString())
        
        console.log('Socket Disconnected', socketConnections);

    })
}



export const establsihIoConnection = (io) => {
    io.on('connection', async (socket) => {

        await registerSocketId(socket.handshake, socket.id)

        await sendMessageService(socket)

        await removeSocketId(socket)
    })
}