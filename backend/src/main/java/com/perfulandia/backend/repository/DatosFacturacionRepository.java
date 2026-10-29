package com.perfulandia.backend.repository;
import com.perfulandia.backend.model.DatosFacturacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DatosFacturacionRepository extends JpaRepository<DatosFacturacion, Long> {
    Optional<DatosFacturacion> findByUsuarioEmail(String usuarioEmail);
}