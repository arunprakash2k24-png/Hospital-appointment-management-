package com.college.smarthospital.dto;

import com.college.smarthospital.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}
