package com.perfulandia.backend.messaging.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record BindingRequest(
        @NotBlank(message = "El nombre de la cola es obligatorio")
        @Size(max = 200)
        @Pattern(regexp = "[a-zA-Z0-9._-]+", message = "Nombre de cola inválido")
        String cola,

        @NotBlank(message = "El nombre del exchange es obligatorio")
        @Size(max = 200)
        @Pattern(regexp = "[a-zA-Z0-9._-]+", message = "Nombre de exchange inválido")
        String exchange,

        @NotBlank(message = "La routing key es obligatoria")
        @Size(max = 255)
        @Pattern(regexp = "[a-zA-Z0-9._*#-]+", message = "Routing key inválida")
        String routingKey
) {}
