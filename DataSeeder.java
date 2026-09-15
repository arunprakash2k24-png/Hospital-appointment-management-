package com.college.smarthospital.config;

import com.college.smarthospital.model.*;
import com.college.smarthospital.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(UserRepository users, DoctorRepository doctors, PasswordEncoder encoder) {
        return args -> {
            if (users.findByEmail("admin@hospital.com").isEmpty())
                users.save(User.builder().name("System Admin").email("admin@hospital.com")
                        .password(encoder.encode("Admin@123")).role(Role.ADMIN).build());

            if (users.findByEmail("doctor@hospital.com").isEmpty())
                users.save(User.builder().name("Dr. Demo").email("doctor@hospital.com")
                        .password(encoder.encode("Doctor@123")).role(Role.DOCTOR).build());

            if (doctors.count() == 0) {
                doctors.save(Doctor.builder().name("Dr. Ananya Kumar").specialization("Cardiology")
                        .qualification("MBBS, MD").phone("9000000001")
                        .availableDays("Mon, Wed, Fri").availableTime("10:00-14:00").build());
                doctors.save(Doctor.builder().name("Dr. Ravi Kumar").specialization("Dermatology")
                        .qualification("MBBS, MD").phone("9000000002")
                        .availableDays("Tue, Thu, Sat").availableTime("09:00-13:00").build());
                doctors.save(Doctor.builder().name("Dr. Priya Sharma").specialization("General Medicine")
                        .qualification("MBBS, MD").phone("9000000003")
                        .availableDays("Mon-Sat").availableTime("16:00-20:00").build());
            }

            if (users.findByEmail("patient@hospital.com").isEmpty())
                users.save(User.builder().name("Demo Patient").email("patient@hospital.com")
                        .password(encoder.encode("Patient@123")).role(Role.PATIENT).build());
        };
    }
}
