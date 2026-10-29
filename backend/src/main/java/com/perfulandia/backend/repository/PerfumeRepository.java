package com.perfulandia.backend.repository;



import com.perfulandia.backend.model.Perfume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PerfumeRepository extends JpaRepository<Perfume, Long> {
}
