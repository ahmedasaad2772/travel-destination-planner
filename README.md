# Travel Destination Planner

A full-stack web application for managing travel destinations, featuring an Admin dashboard for curation and a User interface for building "Want to Visit" lists.

## Technology Stack

- **Backend**: Java 17, Spring Boot 3.2.2, Spring Security (JWT), Spring Data JPA, H2 Database (In-Memory).
- **Frontend**: TypeScript, Angular 17, CSS.
- **Tools**: Maven, npm, Postman.

## Project Structure

```
travel-destination-planner/
├── backend/            # Spring Boot application
├── frontend/           # Angular application
└── README.md
```

## Setup Instructions

### Prerequisites

- Java 17+ (JDK)
- Node.js (v18+ recommended) & npm
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and run the application:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start on `http://localhost:8080`.
4. **Database**: The app uses an H2 in-memory database.
   - Console: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:traveldb`
   - User: `sa`
   - Password: (empty)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. Open your browser to `http://localhost:4200`.

## Usage

### Access and Credentials

- **Backend API**: `http://localhost:8080`
- **Frontend App**: `http://localhost:4200`

#### Login
- **Admin**:
  - Username: `admin`
  - Password: `admin`
- **User**:
  - Click "Register" on the login page to create a new account.

### Features
- **Admin**:
  - View all destinations.
  - Search for countries via external API.
  - Add destinations to the platform.
- **User**:
  - Browse destinations.
  - Search destinations.
  - Add destinations to "Want to Visit" list.

