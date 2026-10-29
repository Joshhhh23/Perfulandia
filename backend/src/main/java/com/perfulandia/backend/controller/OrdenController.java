package com.perfulandia.backend.controller;

import com.perfulandia.backend.model.*;
import com.perfulandia.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/ordenes")
@CrossOrigin(origins = "http://localhost:3000")
public class OrdenController {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private PerfumeRepository perfumeRepository;

    //Ver historial de un usuario
    @GetMapping("/mis-compras")
    public List<Orden> misCompras(@RequestParam String email) {
        return ordenRepository.findByUsuarioEmail(email);
    }
   
    @GetMapping("/todas")
    public List<Orden> todasLasOrdenes() {
        
        return ordenRepository.findAll();
    }

    //nueva compra//
    @PostMapping
    public Orden crearOrden(@RequestBody Orden orden) {
        orden.setFecha(new Date());
        orden.setEstado("Pagado");

        
        for (DetalleOrden detalle : orden.getDetalles()) {
            detalle.setOrden(orden);
            
            Perfume p = perfumeRepository.findById(detalle.getPerfumeId()).orElse(null);
            if (p != null) {
                int nuevoStock = p.getStock() - detalle.getCantidad();
                p.setStock(Math.max(0, nuevoStock)); // Evitar negativos
                perfumeRepository.save(p);
            }
        }

        return ordenRepository.save(orden);
    }
}