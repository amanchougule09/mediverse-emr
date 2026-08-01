# Mediverse EMR

A full-stack Electronic Medical Records (EMR) system for clinic management, featuring role-based access control, patient records, appointments, prescriptions, consultations, billing, laboratory, pharmacy, notifications, and audit logging.

## Screenshots

| Screenshot | Description |
| ---------- | ----------- |
| ![Registration](screenshots/register.png) | New user registration |
| ![Login](screenshots/login.png) | Login page |
| ![Roles & Permissions](screenshots/roles.png) | Admin: assign roles & permissions |
| ![User Management](screenshots/users.png) | Admin: manage users |
| ![Dashboard](screenshots/dashboard.png) | Dashboard with analytics |
| ![Patient Management](screenshots/patients.png) | Feature example: patient records |

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Backend | Java 21, Spring Boot 4.1, Spring Security, Spring Data JPA |
| Database | MySQL, Flyway migrations |
| Auth | JWT (JSON Web Tokens) |
| Frontend | React 19, Vite 8, Tailwind CSS 4, React Router, Recharts |
| Build | Maven (backend), npm (frontend) |

## Project Structure

```
mediverse-emr/
├── clinic-emr-backend/    # Spring Boot REST API
│   └── src/main/
│       ├── java/com/amanchougule/clinic_emr/   # Controllers, services, entities, security
│       └── resources/db/migration/             # Flyway SQL migrations
└── clinic-emr-frontend/   # React SPA
    └── src/
        ├── api/           # Axios API clients
        ├── auth/          # Login, register, password reset
        ├── components/    # Reusable UI components
        ├── pages/         # Feature pages (patients, appointments, billing, etc.)
        └── routes/        # Application routing
```

## Features

- Authentication & registration with JWT
- Role-based access control with granular permissions
- Patient management
- Doctor management & appointments
- Prescriptions & consultations
- Billing, laboratory, and pharmacy modules
- Patient file/document uploads
- Notifications & audit log
- Dashboard with analytics charts

## Backend Setup

**Prerequisites:** JDK 21, Maven, MySQL 8+

1. Create the database (Flyway will create tables automatically):
   ```sql
   CREATE DATABASE IF NOT EXISTS clinic_emr_db;
   ```

2. Set the environment variables (copy `clinic-emr-backend/.env.example`):
   ```
   DB_URL=jdbc:mysql://localhost:3306/clinic_emr_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Kolkata
   DB_USERNAME=root
   DB_PASSWORD=your_db_password_here
   JWT_SECRET=your_64_character_jwt_secret_here
   JWT_EXPIRATION=86400000
   ```

3. Run the API (default port `8080`):
   ```bash
   cd clinic-emr-backend
   ./mvnw spring-boot:run
   ```

> **Note:** `DB_PASSWORD` and `JWT_SECRET` are required — the app will not start without them. On Windows PowerShell, set them with `$env:DB_PASSWORD = "..."` before running.

## Frontend Setup

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   cd clinic-emr-frontend
   npm install
   ```

2. Configure the API URL — copy `.env.example` to `.env` and set:
   ```
   VITE_API_URL=http://localhost:8080
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Production build:
   ```bash
   npm run build
   ```
