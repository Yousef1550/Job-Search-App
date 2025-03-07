import multer from "multer";




export const MulterCloud = (allowedExtentions = []) => {
    const storage = multer.diskStorage({})

    const fileFilter = (req, file, cb) => {
        
        if(allowedExtentions.includes(file.mimetype)){
            cb(null, true)      // null refers to no errors, if I wanted to pass an error
        } else {
            cb(new Error('Invalid file type'), false)
        }
    }
    
    
    // file filter must be before storing the file
    const upload = multer({fileFilter, storage})

    return upload       // to use it's methods in the router
}
