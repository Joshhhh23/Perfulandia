package com.perfulandia.backend.controller;

import com.perfulandia.backend.model.Mensaje;
import com.perfulandia.backend.repository.MensajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/mensajes")
@CrossOrigin(origins = "http://localhost:3000") // Permite conexión desde React
public class MensajeController {

    @Autowired
    private MensajeRepository mensajeRepository;

    // Guardar mensaje (Para el formulario de contacto)
    @PostMapping
    public Mensaje crearMensaje(@RequestBody Mensaje mensaje) {
        mensaje.setFecha(new Date()); // Pone la fecha actual automáticamente
        return mensajeRepository.save(mensaje);
    }

    // Listar mensajes (Para el panel de admin)
    @GetMapping
    public List<Mensaje> listarMensajes() {
        return mensajeRepository.findAll();
    }

    // Borrar mensaje
    @DeleteMapping("/{id}")
    public void borrarMensaje(@PathVariable Long id) {
        mensajeRepository.deleteById(id);
    }
}