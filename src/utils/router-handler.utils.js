import { globalErrorHandler } from "../Middleware/error-handler.middleware.js"
import adminController from "../Modules/Admin/admin.controller.js"
import authController from "../Modules/Auth/auth.controller.js"
import companyController from "../Modules/Company/company.controller.js"
import jobController from "../Modules/Job/job.controller.js"
import userController from "../Modules/User/user.controller.js"







const routerHandler = (app) => {
    app.use('/auth', authController)
    app.use('/user', userController)
    app.use('/admin', adminController)
    app.use('/company', companyController)
    app.use('/job', jobController)


    app.get('/', async (req, res) => {
        return res.status(200).json({message: 'Welcome to Job Search App'})
    })

    app.use(globalErrorHandler)
}


export default routerHandler