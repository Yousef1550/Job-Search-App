import express from 'express'
import { config } from 'dotenv'
import database_connection from './DB/connection.js'
import routerHandler from './utils/router-handler.utils.js'
import { CRON_JOB } from './Services/CRON-job.service.js'
import { Server } from 'socket.io'
import cors from 'cors'
import { establsihIoConnection } from './utils/socket.utils.js'

config()




const bootstrap = async () => {
    const app = express()
    await database_connection()
    

    app.use(cors())
    app.use(express.json())
    routerHandler(app)
    
    const port = process.env.PORT
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}!`);
    })

    CRON_JOB.start()  // delete expired OTPs from the Database every 6 hours


    const io = new Server(server, 
        {
            cors: {
                origin: '*'
            }
        }
    )
    establsihIoConnection(io)

}


export default bootstrap