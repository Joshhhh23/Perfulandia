package com.perfulandia.backend.controller;

import com.perfulandia.backend.model.Perfume;
import com.perfulandia.backend.service.PerfumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/perfumes")
@CrossOrigin(origins = "http://localhost:3000")
public class PerfumeController {

    private final PerfumeService perfumeService;

    public PerfumeController(PerfumeService perfumeService) {
        this.perfumeService = perfumeService;
    }

    // Crear producto
    @PostMapping
    public ResponseEntity<Perfume> crear(@RequestBody Perfume perfume) {
        return ResponseEntity.ok(perfumeService.crearPerfume(perfume));
    }

    // Listar productos
    @GetMapping
    public ResponseEntity<List<Perfume>> listar() {
        return ResponseEntity.ok(perfumeService.listarPerfumes());
    }

    // Actualizar Stock (NUEVO)
    @PutMapping("/{id}/stock")
    public ResponseEntity<?> actualizarStock(@PathVariable Long id, @RequestParam int cantidad) {
        try {
            Perfume actualizado = perfumeService.actualizarStock(id, cantidad);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar stock: " + e.getMessage());
        }
    }

    // Eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        perfumeService.eliminarPerfume(id);
        return ResponseEntity.noContent().build();
    }
}