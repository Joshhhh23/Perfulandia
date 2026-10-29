package com.perfulandia.backend.messaging.service;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.util.Map;

@Service
public class RabbitAdminService {
 private final RabbitAdmin rabbitAdmin;
 public RabbitAdminService(RabbitAdmin rabbitAdmin) { this.rabbitAdmin=rabbitAdmin; }
 public void crearCola(String nombre) { validarNombre(nombre,"cola"); rabbitAdmin.declareQueue(new Queue(nombre,true)); }
 public void eliminarCola(String nombre) { validarNombre(nombre,"cola"); rabbitAdmin.deleteQueue(nombre); }
 public void crearExchange(String nombre) { validarNombre(nombre,"exchange"); rabbitAdmin.declareExchange(new DirectExchange(nombre,true,false)); }
 public void crearTopicExchange(String nombre) { validarNombre(nombre,"exchange"); rabbitAdmin.declareExchange(new TopicExchange(nombre,true,false)); }
 public void eliminarExchange(String nombre) { validarNombre(nombre,"exchange"); rabbitAdmin.deleteExchange(nombre); }
 public void crearBinding(String cola,String exchange,String key) { validarNombre(cola,"cola"); validarNombre(exchange,"exchange"); validarRoutingKey(key); rabbitAdmin.declareBinding(new Binding(cola,Binding.DestinationType.QUEUE,exchange,key,null)); }
 public void eliminarBinding(String cola,String exchange,String key) { validarNombre(cola,"cola"); validarNombre(exchange,"exchange"); validarRoutingKey(key); rabbitAdmin.removeBinding(new Binding(cola,Binding.DestinationType.QUEUE,exchange,key,null)); }
 public Map<String,Object> estado() { return Map.of("colasConfiguradas",new String[]{"perfulandia.ordenes.queue","perfulandia.pagos.queue","perfulandia.inventario.queue"},"deadLetterQueues",new String[]{"perfulandia.ordenes.dlq","perfulandia.pagos.dlq","perfulandia.inventario.dlq"},"exchanges",new String[]{"perfulandia.ordenes.exchange","perfulandia.eventos.topic","perfulandia.dlx"}); }
 private void validarNombre(String n,String tipo) { if(!StringUtils.hasText(n)||n.length()>200||!n.matches("[a-zA-Z0-9._-]+")) throw new IllegalArgumentException("Nombre de "+tipo+" inválido"); }
 private void validarRoutingKey(String k) { if(!StringUtils.hasText(k)||k.length()>255||!k.matches("[a-zA-Z0-9._*#-]+")) throw new IllegalArgumentException("Routing key inválida"); }
}
