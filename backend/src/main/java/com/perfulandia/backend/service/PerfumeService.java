package com.perfulandia.backend.service;

import com.perfulandia.backend.model.Perfume;
import com.perfulandia.backend.repository.PerfumeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PerfumeService {

    private final PerfumeRepository perfumeRepository;

    public PerfumeService(PerfumeRepository perfumeRepository) {
        this.perfumeRepository = perfumeRepository;
    }

    public Perfume crearPerfume(Perfume perfume) {
        return perfumeRepository.save(perfume);
    }

    public List<Perfume> listarPerfumes() {
        return perfumeRepository.findAll();
    }

    // Método para eliminar por ID
    public void eliminarPerfume(Long id) {
        perfumeRepository.deleteById(id);
    }

    // --- NUEVO MÉTODO PARA ACTUALIZAR STOCK ---
    public Perfume actualizarStock(Long id, int nuevoStock) {
        // 1. Buscamos el perfume, si no existe lanzamos error
        Perfume perfume = perfumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfume no encontrado con ID: " + id));
        
        // 2. Actualizamos el valor del stock
        perfume.setStock(nuevoStock);
        
        // 3. Guardamos los cambios en la base de datos
        return perfumeRepository.save(perfume);
    }
}