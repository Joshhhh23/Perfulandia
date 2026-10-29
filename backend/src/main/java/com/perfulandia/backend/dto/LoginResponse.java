package com.perfulandia.backend.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private UserDto user;

    @Data
    public static class UserDto {
        private String email;
        private String role;
    }
}