package com.college.smarthospital.controller;

import com.college.smarthospital.dto.*;
import com.college.smarthospital.model.Role;
import com.college.smarthospital.model.User;
import com.college.smarthospital.repository.UserRepository;
import com.college.smarthospital.security.JwtService;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users; this.encoder = encoder; this.jwt = jwt;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest r) {
        if (users.findByEmail(r.getEmail()).isPresent())
            return ResponseEntity.badRequest().body("Email already registered");

        Role role = r.getRole() == null ? Role.PATIENT : r.getRole();
        if (role == Role.ADMIN) role = Role.PATIENT; // admin is seeded, not self-registered

        User u = User.builder().name(r.getName()).email(r.getEmail())
                .password(encoder.encode(r.getPassword())).role(role).build();
        users.save(u);
        return ResponseEntity.ok("Registration successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest r) {
        return users.findByEmail(r.getEmail())
                .filter(u -> encoder.matches(r.getPassword(), u.getPassword()))
                .map(u -> ResponseEntity.ok(new LoginResponse(
                        jwt.generate(u.getEmail(), u.getRole().name()), u.getName(), u.getRole().name())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password"));
    }

    record LoginResponse(String token, String name, String role) {}
}
