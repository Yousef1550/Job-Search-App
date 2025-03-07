import cron from 'node-cron';
import User from '../DB/models/user.model.js';



export const CRON_JOB = cron.schedule('0 */6 * * *', async () => {
    try {
        console.log('Running OTP Cleanup Job...');
        
        const now = new Date()

        const result = await User.updateMany(
            {},
            {
                $pull: {OTP: {expiresIn: {$lt: now}}}
            }
        )
        console.log(`OTP Cleanup Done. Modified Documents: ${result.modifiedCount}`);
    } catch (error) {
        console.error('Error in OTP Cleanup Job:', error);
    }
})

