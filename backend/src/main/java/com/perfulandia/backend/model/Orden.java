package com.perfulandia.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Entity
@Data
public class Orden {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuarioEmail;
    private Date fecha;
    private Double total;
    private String estado;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "orden")
    private List<DetalleOrden> detalles;
}