package com.college.smarthospital.controller;

import com.college.smarthospital.model.Doctor;
import com.college.smarthospital.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    private final DoctorRepository doctors;

    public DoctorController(DoctorRepository doctors) { this.doctors = doctors; }

    @GetMapping
    public List<Doctor> all(@RequestParam(required=false) String specialization) {
        if (specialization == null || specialization.isBlank()) return doctors.findAll();
        return doctors.findBySpecializationContainingIgnoreCase(specialization);
    }

    @GetMapping("/{id}")
    public Doctor one(@PathVariable Long id) {
        return doctors.findById(id).orElseThrow();
    }
}
