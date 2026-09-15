package com.college.smarthospital.controller;

import com.college.smarthospital.dto.AppointmentRequest;
import com.college.smarthospital.model.*;
import com.college.smarthospital.repository.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentRepository appointments;
    private final UserRepository users;
    private final DoctorRepository doctors;

    public AppointmentController(AppointmentRepository appointments, UserRepository users, DoctorRepository doctors) {
        this.appointments=appointments; this.users=users; this.doctors=doctors;
    }

    @PostMapping
    public ResponseEntity<?> book(@RequestBody AppointmentRequest r,
                                   java.security.Principal principal) {
        User patient = users.findByEmail(principal.getName()).orElseThrow();
        Doctor doctor = doctors.findById(r.getDoctorId()).orElseThrow();

        if (appointments.existsByDoctorIdAndAppointmentDateAndAppointmentTime(
                doctor.getId(), r.getAppointmentDate(), r.getAppointmentTime()))
            return ResponseEntity.badRequest().body("Doctor is already booked for this time.");

        Appointment a = Appointment.builder()
                .patient(patient).doctor(doctor)
                .appointmentDate(r.getAppointmentDate())
                .appointmentTime(r.getAppointmentTime())
                .reason(r.getReason()).status(AppointmentStatus.BOOKED).build();
        return ResponseEntity.ok(appointments.save(a));
    }

    @GetMapping("/my")
    public List<Appointment> my(java.security.Principal principal) {
        User patient = users.findByEmail(principal.getName()).orElseThrow();
        return appointments.findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(patient.getId());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id, java.security.Principal principal) {
        Appointment a = appointments.findById(id).orElseThrow();
        if (!a.getPatient().getEmail().equals(principal.getName()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your appointment");
        a.setStatus(AppointmentStatus.CANCELLED);
        return ResponseEntity.ok(appointments.save(a));
    }
}
