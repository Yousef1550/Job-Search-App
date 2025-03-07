import { v2 as cloudinaryV2 } from 'cloudinary'



export const cloudinary = () => {
    cloudinaryV2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    })

    return cloudinaryV2
}