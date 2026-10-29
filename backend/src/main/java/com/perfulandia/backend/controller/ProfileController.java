package com.perfulandia.backend.controller;

import com.perfulandia.backend.model.*;
import com.perfulandia.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired private DireccionRepository direccionRepository;
    @Autowired private MetodoPagoRepository metodoPagoRepository;
    @Autowired private DatosFacturacionRepository datosFacturacionRepository;
    @Autowired private SoporteTicketRepository soporteTicketRepository;

    // --- DIRECCIONES ---
    @GetMapping("/direcciones")
    public List<Direccion> getDirecciones(@RequestParam String email) {
        return direccionRepository.findByUsuarioEmail(email);
    }

    @PostMapping("/direcciones")
    public Direccion addDireccion(@RequestBody Direccion direccion) {
        return direccionRepository.save(direccion);
    }

    @DeleteMapping("/direcciones/{id}")
    public void deleteDireccion(@PathVariable Long id) {
        direccionRepository.deleteById(id);
    }

    // --- PAGOS ---
    @GetMapping("/pagos")
    public List<MetodoPago> getPagos(@RequestParam String email) {
        return metodoPagoRepository.findByUsuarioEmail(email);
    }

    @PostMapping("/pagos")
    public MetodoPago addPago(@RequestBody MetodoPago pago) {
        return metodoPagoRepository.save(pago);
    }

    @DeleteMapping("/pagos/{id}")
    public void deletePago(@PathVariable Long id) {
        metodoPagoRepository.deleteById(id);
    }

    // --- FACTURACIÓN ---
    @GetMapping("/facturacion")
    public DatosFacturacion getFacturacion(@RequestParam String email) {
        return datosFacturacionRepository.findByUsuarioEmail(email).orElse(null);
    }

    @PostMapping("/facturacion")
    public DatosFacturacion saveFacturacion(@RequestBody DatosFacturacion datos) {
        // Si ya existe, actualizamos. Si no, creamos.
        DatosFacturacion existente = datosFacturacionRepository.findByUsuarioEmail(datos.getUsuarioEmail()).orElse(null);
        if (existente != null) {
            existente.setRut(datos.getRut());
            existente.setGiro(datos.getGiro());
            existente.setRazonSocial(datos.getRazonSocial());
            return datosFacturacionRepository.save(existente);
        }
        return datosFacturacionRepository.save(datos);
    }

    // --- SOPORTE ---
    @PostMapping("/soporte")
    public SoporteTicket crearTicket(@RequestBody SoporteTicket ticket) {
        ticket.setFecha(new Date());
        ticket.setEstado("Pendiente");
        return soporteTicketRepository.save(ticket);
    }

    @GetMapping("/soporte")
    public List<SoporteTicket> getTickets(@RequestParam String email) {
        return soporteTicketRepository.findByUsuarioEmail(email);
    }
}