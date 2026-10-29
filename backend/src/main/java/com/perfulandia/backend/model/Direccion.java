package com.perfulandia.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String usuarioEmail; 
    private String alias; 
    private String direccion;
    private String ciudad;
    private boolean predeterminada;
}