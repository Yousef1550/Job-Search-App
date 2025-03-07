

export const HTML_TEMPLATE_confirmEmail = (otp) => {
    return `
            <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                h2 {
                    color: #333;
                }
                p {
                    font-size: 16px;
                    color: #555;
                }
                .otp {
                    font-size: 24px;
                    font-weight: bold;
                    color: #007bff;
                    margin: 20px 0;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #007bff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Email Verification</h2>
                <p>Your One-Time Password (OTP) for email verification is:</p>
                <div class="otp">${otp}</div>
                <p>Enter this OTP to verify your email address. This code is valid for 10 minutes.</p>
                <p class="footer">If you didn't request this, please ignore this email.</p>
            </div>
        </body>
        </html>
        `
}

export const HTML_TEMPLATE_forgetPassword = (otp) => {
    return `
            <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                h2 {
                    color: #333;
                }
                p {
                    font-size: 16px;
                    color: #555;
                }
                .otp {
                    font-size: 24px;
                    font-weight: bold;
                    color: #007bff;
                    margin: 20px 0;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #007bff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Email Verification</h2>
                <p>Your One-Time Password (OTP) for password reset is:</p>
                <div class="otp">${otp}</div>
                <p>Enter this OTP to reset your password. This code is valid for 10 minutes.</p>
                <p class="footer">If you didn't request this, please ignore this email.</p>
            </div>
        </body>
        </html>
        `
}



export const HTML_TEMPLATE_Application_Accept = (applicantName) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Job Application Status</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    text-align: center;
                    padding: 20px;
                }
                .container {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                    margin: auto;
                }
                .success {
                    color: green;
                    font-weight: bold;
                }
                .failure {
                    color: red;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Job Application Result</h2>
                <p>Dear <strong>${applicantName}</strong>,</p>
                
                <!-- Use this section if accepted -->
                <p class="success">We are pleased to inform you that you have been accepted for the job!</p>
                <p>We will be in touch with you soon to discuss the next steps.</p>
                
                <p>Best regards,</p>
                <p>The Hiring Team</p>
            </div>
        </body>
        </html>
`
}




export const HTML_TEMPLATE_Application_Reject = (applicantName) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Job Application Status</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    text-align: center;
                    padding: 20px;
                }
                .container {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                    margin: auto;
                }
                .success {
                    color: green;
                    font-weight: bold;
                }
                .failure {
                    color: red;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Job Application Result</h2>
                <p>Dear <strong>${applicantName}</strong>,</p>
                
                <!-- Use this section if rejected -->
                <p class="failure">We regret to inform you that you have not been selected for this position.</p>
                <p>We wish you the best of luck in your future opportunities.</p> 
                
                <p>Best regards,</p>
                <p>The Hiring Team</p>
            </div>
        </body>
        </html>
`
}