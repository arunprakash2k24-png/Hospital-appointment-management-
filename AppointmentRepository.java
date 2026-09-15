package com.college.smarthospital.repository;

import com.college.smarthospital.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(Long patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(Long doctorId);
    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTime(Long doctorId, java.time.LocalDate date, java.time.LocalTime time);
}
