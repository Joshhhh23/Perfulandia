package com.perfulandia.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class SoporteTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String usuarioEmail;
    private String tipoProblema;

    @Column(length = 1000)
    private String detalle;

    private Date fecha;
    private String estado;
}