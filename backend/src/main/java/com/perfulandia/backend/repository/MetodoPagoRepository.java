package com.perfulandia.backend.repository;
import com.perfulandia.backend.model.MetodoPago;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MetodoPagoRepository extends JpaRepository<MetodoPago, Long> {
    List<MetodoPago> findByUsuarioEmail(String usuarioEmail);
}