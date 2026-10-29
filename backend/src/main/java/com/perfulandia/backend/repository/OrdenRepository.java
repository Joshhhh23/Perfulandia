package com.perfulandia.backend.repository;

import com.perfulandia.backend.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdenRepository extends JpaRepository<Orden, Long> {
    List<Orden> findByUsuarioEmail(String email); // Para el historial
}