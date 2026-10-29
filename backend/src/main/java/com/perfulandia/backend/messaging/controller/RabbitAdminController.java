package com.perfulandia.backend.messaging.controller;

import com.perfulandia.backend.messaging.dto.BindingRequest;
import com.perfulandia.backend.messaging.dto.ExchangeRequest;
import com.perfulandia.backend.messaging.dto.QueueRequest;
import com.perfulandia.backend.messaging.service.RabbitAdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/rabbitmq")
public class RabbitAdminController {

    private final RabbitAdminService rabbitAdminService;

    public RabbitAdminController(RabbitAdminService rabbitAdminService) {
        this.rabbitAdminService = rabbitAdminService;
    }

    @PostMapping("/queues")
    public ResponseEntity<?> crearCola(@Valid @RequestBody QueueRequest request) {
        rabbitAdminService.crearCola(request.nombre());
        return ResponseEntity.ok(Map.of("mensaje", "Cola creada", "nombre", request.nombre()));
    }

    @DeleteMapping("/queues/{nombre}")
    public ResponseEntity<?> eliminarCola(@PathVariable String nombre) {
        rabbitAdminService.eliminarCola(nombre);
        return ResponseEntity.ok(Map.of("mensaje", "Cola eliminada", "nombre", nombre));
    }

    @GetMapping("/status")
    public ResponseEntity<?> estado() { return ResponseEntity.ok(rabbitAdminService.estado()); }

    @PostMapping("/exchanges/topic")
    public ResponseEntity<?> crearTopicExchange(@Valid @RequestBody ExchangeRequest request) {
        rabbitAdminService.crearTopicExchange(request.nombre());
        return ResponseEntity.ok(Map.of("mensaje", "Topic exchange creado", "nombre", request.nombre()));
    }

    @PostMapping("/exchanges")
    public ResponseEntity<?> crearExchange(@Valid @RequestBody ExchangeRequest request) {
        rabbitAdminService.crearExchange(request.nombre());
        return ResponseEntity.ok(Map.of("mensaje", "Exchange creado", "nombre", request.nombre()));
    }

    @DeleteMapping("/exchanges/{nombre}")
    public ResponseEntity<?> eliminarExchange(@PathVariable String nombre) {
        rabbitAdminService.eliminarExchange(nombre);
        return ResponseEntity.ok(Map.of("mensaje", "Exchange eliminado", "nombre", nombre));
    }

    @PostMapping("/bindings")
    public ResponseEntity<?> crearBinding(@Valid @RequestBody BindingRequest request) {
        rabbitAdminService.crearBinding(request.cola(), request.exchange(), request.routingKey());
        return ResponseEntity.ok(Map.of("mensaje", "Binding creado"));
    }

    @DeleteMapping("/bindings")
    public ResponseEntity<?> eliminarBinding(@Valid @RequestBody BindingRequest request) {
        rabbitAdminService.eliminarBinding(request.cola(), request.exchange(), request.routingKey());
        return ResponseEntity.ok(Map.of("mensaje", "Binding eliminado"));
    }
}
