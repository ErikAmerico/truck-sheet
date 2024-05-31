# Truck-Sheets Web Application

## Overview

This project is a web application designed for ABC Moving Services. The application provides different functionalities and pages for employees based on their roles (office vs driver). The primary goal is to implement role-based access control (RBAC) to ensure that only authorized employees can access specific pages and perform certain actions.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **Prisma**: An ORM for interacting with the PostgreSQL database.
- **NextAuth.js**: For handling authentication and session management.
- **PostgreSQL**: The relational database used for storing employee data.
- **TypeScript**: For type-safe JavaScript development.

## Features

### Role-Based Access Control (RBAC)

- Employees with the role of "office" have access to certain administrative pages.
- Employees with the role of "driver" have access to a different set of pages tailored to their role.

### Authentication and Authorization

- Secure login using credentials-based authentication.
- Session management with user roles stored in JSON Web Tokens (JWT).

### Protected Routes and API Endpoints

- Middleware to enforce role-based access control on both pages and API routes.
- Conditional rendering of components based on user roles.

## Project Structure

The project structure is organized to maintain a clear separation of concerns and ensure scalability:

- **Components**: Reusable UI components such as navigation bars, modals, and tables.
- **Lib**: Utility functions and Prisma client configuration.
- **Pages**: Next.js pages including protected routes and authentication pages.
- **API**: Server-side API routes for handling CRUD operations and authentication.
- **Middleware**: Middleware functions for handling request interception and authorization.
- **Prisma**: Prisma schema and client setup for database interactions.

## Key Components and Pages

- **NavBar**: A navigation bar that conditionally renders buttons and links based on the user's role.
- **DriverTable**: A table displaying a list of drivers, accessible only to employees with the "office" role.
- **AddDriverModal**: A modal for adding new drivers, available only to authorized users.
- **EditDriverModal**: A modal for editing driver details, ensuring that only authorized changes are made.
- **Login Page**: A secure login page for user authentication.
- **Unauthorized Page**: A page displayed to users who attempt to access restricted areas without proper authorization.

## Middleware and Security

- **Authentication Middleware**: Intercepts requests to check for valid sessions and appropriate user roles before granting access to protected routes.
- **Role-Based Access Middleware**: Ensures that only users with the "office" role can access the `/drivers` routes and related API endpoints.

## Environment Variables

- **DATABASE_URL**: Connection string for the PostgreSQL database.
- **NEXTAUTH_SECRET**: Secret key used for signing JWT tokens.
- **AUTH_SECRET**: Additional secret for enhancing security in authentication processes.

## Getting Started

1. **Clone the Repository**: Download the project files from the repository.
2. **Install Dependencies**: Run `npm install` to install all required dependencies.
3. **Set Up Environment Variables**: Create a `.env.local` file and set the necessary environment variables.
4. **Run Database Migrations**: Use Prisma to set up the database schema.
5. **Start the Development Server**: Run `npm run dev` to start the Next.js development server.
6. **Access the Application**: Open your browser and navigate to `http://localhost:3000` to access the application.

## Future Enhancements

- **Enhanced Security**: Implement additional security measures such as rate limiting and IP whitelisting.
- **Improved UI/UX**: Enhance the user interface and user experience for both office and driver roles.
- **Advanced Reporting**: Drivers will submit daily reports that users with office roles can review and monitor.
- **Track History**: Drivers will be able to track their history, while office roles can track all driver and truck histories.
- **End Of Year Reports**: At the end of the fiscal year, a summary of each truck will be presented to office roles for tax purposes.
