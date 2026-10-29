package com.perfulandia.backend.repository;
import com.perfulandia.backend.model.SoporteTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SoporteTicketRepository extends JpaRepository<SoporteTicket, Long> {
    List<SoporteTicket> findByUsuarioEmail(String usuarioEmail);
}