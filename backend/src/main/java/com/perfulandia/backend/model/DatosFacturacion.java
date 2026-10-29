package com.perfulandia.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DatosFacturacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String usuarioEmail;
    private String rut;
    private String giro;
    private String razonSocial;
}