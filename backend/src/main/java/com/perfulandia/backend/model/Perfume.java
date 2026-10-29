package com.perfulandia.backend.model;



import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "perfumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Perfume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private Integer precio;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private String imagenUrl;

    @Column(nullable = false)
    private String genero;

    @Column(nullable = false)
    private String aroma;
}
