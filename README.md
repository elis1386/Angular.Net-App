# Angular.Net-App

## Description

**Angular.Net-App** is a dating web application built using Angular for the frontend and ASP.NET Core for the backend. The project provides user registration, profile creation, messaging, and photo management functionalities.

## Project Structure

- **client/**: Contains the frontend application built with Angular.
- **DatingApp/**: Contains the backend application built with ASP.NET Core.
- **.github/workflows/**: Contains GitHub Actions configuration for CI/CD.

## Features

- **User Registration & Authentication**: Users can sign up and log in.
- **User Profiles**: View and edit user profiles.
- **Messaging System**: Users can send and receive messages.
- **Photo Management**: Upload, display, and delete photos.

## Deployment

The project is deployed on Azure and configured for automatic deployment using GitHub Actions. For local deployment:

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/elis1386/Angular.Net-App.git
   ```
2. Navigate to the `DatingApp` directory.
3. Configure the database connection in `appsettings.json`.
4. Apply database migrations:
   ```bash
   dotnet ef database update
   ```
5. Run the application:
   ```bash
   dotnet run
   ```

### Frontend Setup

1. Navigate to the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   ng serve
   ```

## CI/CD

The project uses GitHub Actions for automated testing and deployment. Configurations are located in `.github/workflows/`. On push to the main branch, the application is automatically built and deployed to Azure.

## Contribution

To contribute to the project:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m 'Added a new feature'
   ```
4. Push your branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Create a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
