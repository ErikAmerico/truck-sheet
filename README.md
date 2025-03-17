# Trucksheets Web Application | [trucksheets.today](https://trucksheets.today)

## Overview

This project is a web application designed for ABC Moving Services. The application provides different functionalities and pages for employees based on their roles (office vs driver). The primary goal is to implement role-based access control to ensure that only authorized employees can access specific pages and perform certain actions.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **Prisma**: An ORM for interacting with the PostgreSQL database.
- **NextAuth.js**: For handling authentication and session management.
- **PostgreSQL**: The relational database used for storing employee data.
- **TypeScript**: For type-safe JavaScript development.

## Features

### Role-Based Access Control

- Employees with the role of "office" have access to certain administrative pages.
- Employees with the role of "driver" have access to a different set of pages tailored to their role.

### Authentication and Authorization

- Secure login using credentials-based authentication.
- Session management is handled by NextAuth.js using encrypted session cookies. Internally, NextAuth uses JWTs for session storage, but they are not used as API tokens or client-side authentication.

## Project Structure

The project follows the **Next.js App Router** structure, here are some examples:

- **(home)**: Groups files and folder related to the home layout
- **(login)**: Groups files and folder related to login layout.
- **app/**: Contains the App Router structure with server and client components.
- **app/(home)/components**: Reusable UI components such as navigation bars and modals.
- **app/(home)/api/**: Server-side API routes for handling CRUD operations and authentication.
- **prisma/**: Prisma schema and client setup for database interactions.

## Key Components and Pages

- **Login Page**: A secure login page for user authentication.
- **NavBar**: A navigation bar that conditionally renders buttons and links based on the user's role.
- **DriverTable**: A table displaying a list of drivers, accessible only to employees with the "office" role.
- **AddModals**: Modals for adding new drivers, trucks or office employees, available only to authorized users.
- **EditModals**: Modals for editing driver, trucks or office employee details, available only to authorized users.

## Environment Variables

- **DATABASE_URL**: Connection string for the PostgreSQL database.
- **NEXTAUTH_SECRET**: Secret key used by NextAuth.js to encrypt session data stored in cookies.
- **AUTH_SECRET**: Additional secret for enhancing security in authentication processes.
- **NEXTAUTH_URL**: In development, it's typically http://localhost:3000, and in production, it should be your deployed app's URL.
- **AUTH_TRUST_HOST**: Set to true in development, should not be used in production.
- **NEXT_PUBLIC_BASEURL**: It should point to your Next.js server, whether in development (http://localhost:3000) or production (https://yourdomain.com).

## Getting Started

1. **Clone the Repository**: Download the project files from the repository.
2. **Install Dependencies**: Run `npm install` to install all required dependencies.
3. **Set Up Environment Variables**: Create a `.env.local` file and set the necessary environment variables.
4. **Run Database Migrations**: Use Prisma to set up the database schema.
5. **Start the Development Server**: Run `npm run dev` to start the Next.js development server.
6. **Access the Application**: Open your browser and navigate to `http://localhost:3000` to access the application.

## Future Enhancements

- **Improved UI/UX**: Enhance the user interface and user experience for both office and driver roles.
- **Track History**: Drivers will be able to track their history, while office roles can track all driver and truck histories.
- **End Of Year Reports**: At the end of the fiscal year, a summary of each truck will be presented to office roles for tax purposes.
