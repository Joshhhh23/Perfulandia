package com.perfulandia.backend.repository;

import com.perfulandia.backend.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
}