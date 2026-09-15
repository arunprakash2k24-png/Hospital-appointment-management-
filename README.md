# Smart Hospital Appointment System

College end-semester full-stack project.

## Stack
- Backend: Java 17, Spring Boot 3, Spring Data JPA, Spring Security, REST API
- Database: MySQL 8
- Frontend: HTML5, CSS3, JavaScript (runs in VS Code)
- Testing: Postman
- IDE: Eclipse or VS Code

## Main modules
- Patient registration/login
- Doctor management
- Doctor search/filter
- Appointment booking
- Appointment status management
- Patient appointment history
- Admin dashboard APIs
- Role-based authentication using JWT

## Run
1. Create MySQL database using `database/schema.sql`.
2. Open the `backend` folder in Eclipse as a Maven project.
3. Update `backend/src/main/resources/application.properties` with your MySQL username/password.
4. Run `SmartHospitalApplication.java`.
5. Open `frontend/index.html` with VS Code Live Server.
6. Backend default URL: http://localhost:8080
7. Frontend default URL: http://localhost:5500

Demo accounts are created automatically:
- Admin: admin@hospital.com / Admin@123
- Doctor: doctor@hospital.com / Doctor@123
- Patient: patient@hospital.com / Patient@123

## Important
This is an academic/demo project. Do not use it for real patient data or clinical decisions without production-grade security, privacy, audit, and compliance work.
