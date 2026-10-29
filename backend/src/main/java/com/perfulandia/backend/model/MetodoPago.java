package com.perfulandia.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MetodoPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String usuarioEmail;
    private String tipo;
    private String ultimosDigitos;
    private String expiracion;
}