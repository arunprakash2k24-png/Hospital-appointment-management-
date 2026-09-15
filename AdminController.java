package com.college.smarthospital.controller;

import com.college.smarthospital.model.*;
import com.college.smarthospital.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository users;
    private final DoctorRepository doctors;
    private final AppointmentRepository appointments;

    public AdminController(UserRepository users, DoctorRepository doctors, AppointmentRepository appointments) {
        this.users=users; this.doctors=doctors; this.appointments=appointments;
    }

    @GetMapping("/dashboard")
    public Dashboard dashboard() {
        return new Dashboard(users.count(), doctors.count(), appointments.count());
    }

    @PostMapping("/doctors")
    public Doctor addDoctor(@RequestBody Doctor d) { return doctors.save(d); }

    @GetMapping("/appointments")
    public List<Appointment> appointments() { return appointments.findAll(); }

    record Dashboard(long users, long doctors, long appointments) {}
}
