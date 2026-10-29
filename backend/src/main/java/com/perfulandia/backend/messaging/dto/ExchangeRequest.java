package com.perfulandia.backend.messaging.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ExchangeRequest(
        @NotBlank(message = "El nombre del exchange es obligatorio")
        @Size(max = 200, message = "El nombre admite máximo 200 caracteres")
        @Pattern(regexp = "[a-zA-Z0-9._-]+", message = "El nombre solo admite letras, números, punto, guion y guion bajo")
        String nombre
) {}
