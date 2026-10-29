package com.perfulandia.backend.repository;
import com.perfulandia.backend.model.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    List<Direccion> findByUsuarioEmail(String usuarioEmail);
}