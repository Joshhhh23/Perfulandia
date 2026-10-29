package com.perfulandia.backend.messaging.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class OrdenConsumer {
 private static final Logger log=LoggerFactory.getLogger(OrdenConsumer.class);
 @RabbitListener(queues="${app.rabbitmq.queue.ordenes}", containerFactory="rabbitListenerContainerFactory")
 public void recibirOrden(String mensaje) {
  if (!StringUtils.hasText(mensaje)) throw new IllegalArgumentException("El mensaje de la orden está vacío");
  log.info("Orden recibida desde RabbitMQ: {}", mensaje);
  // Sustituir este punto por la lógica de negocio transaccional antes de producción.
 }
}
