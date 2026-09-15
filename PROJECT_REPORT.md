# Smart Hospital Appointment System — Project Report

## 1. Abstract
The Smart Hospital Appointment System is a full-stack web application that digitizes hospital appointment booking. Patients can register, log in, search doctors, view availability information, book appointments and cancel bookings. Administrators can view dashboard counts and add doctors. The backend exposes REST APIs using Spring Boot and stores application data in MySQL. A simple HTML/CSS/JavaScript frontend consumes the APIs, while Postman can be used for API testing.

## 2. Objectives
- Reduce manual appointment scheduling.
- Prevent double-booking of a doctor at the same date and time.
- Provide a simple patient appointment history.
- Demonstrate REST API development with Spring Boot.
- Demonstrate relational database integration using MySQL.
- Demonstrate authentication using JWT.

## 3. Technologies
Java 17, Spring Boot 3, Spring Data JPA, Spring Security, JWT, MySQL 8, HTML, CSS, JavaScript, Eclipse/VS Code, Postman and Maven.

## 4. Modules
1. Authentication and registration
2. Doctor management
3. Doctor search
4. Appointment booking
5. Appointment cancellation
6. Patient appointment history
7. Admin dashboard

## 5. Database Design
### users
id, name, email, password, role

### doctors
id, name, specialization, qualification, phone, available_days, available_time

### appointments
id, patient_id, doctor_id, appointment_date, appointment_time, status, reason

Relationships:
- One patient can have many appointments.
- One doctor can have many appointments.
- Each appointment belongs to one patient and one doctor.

## 6. System Flow
Patient -> Frontend -> REST API -> Spring Security/JWT -> Service/Repository -> MySQL

## 7. Future Enhancements
- Email/SMS reminders
- Doctor login dashboard
- Payment integration
- Prescription upload
- Hospital departments
- Appointment rescheduling
- Analytics and reports

## 8. Conclusion
The project demonstrates how Java, Spring Boot, SQL and a web frontend can be combined to build a practical appointment-management application suitable for an academic full-stack project.
