package com.perfulandia.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class DetalleOrden {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long perfumeId;
    private String nombreProducto;
    private Double precioUnitario;
    private Integer cantidad;

    @ManyToOne
    @JoinColumn(name = "orden_id")
    @JsonIgnore // Evita bucles infinitos al convertir a JSON
    private Orden orden;
}