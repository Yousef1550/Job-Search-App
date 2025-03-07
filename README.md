# Job Search App

## Overview
The **Job Search App** is a modern and efficient platform designed to streamline the job search process for users. It provides an intuitive interface, advanced filtering options, and a seamless experience for both job seekers and employers.

## Features

- **Advanced Job Filtering**: Users can search for jobs based on location, industry, job type, and salary range.
- **User Authentication**: Secure registration and login functionalities with role-based access control.
- **Profile Management**: Users can create, update, and manage their profiles, including resumes and skills.
- **Job Applications**: Allows users to apply for jobs, track application status, and receive notifications.
- **Company Management**: Employers can create and manage job postings, review applications, and communicate with candidates.
- **Admin Dashboard**: Provides an overview of platform activity, including user and job listing statistics.
- **Messaging System**: Enables direct communication between employers and job seekers.
- **Error Handling & Validation**: Ensures smooth user experience with informative error messages and form validation.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose) 
- **Authentication**: JWT-based authentication
- **Storage**: Cloudinary for resume and profile image uploads
- **Email Notifications**: Nodemailer for job alerts and application status updates


## Getting Started

### Prerequisites
- Node.js (Latest LTS Version)
- MongoDB or PostgreSQL
- Cloudinary Account (for image storage)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/job-search-app.git
   cd job-search-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_URL=your_cloudinary_url
   ```
4. Start the application:
   ```sh
   npm start
   ```


