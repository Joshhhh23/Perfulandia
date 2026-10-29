package com.perfulandia.backend.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class LoginRequest {
    @NotBlank @Email private String email;
    @NotBlank @Size(min=1,max=72) private String password;
}
