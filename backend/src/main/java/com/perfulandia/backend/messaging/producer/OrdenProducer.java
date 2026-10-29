
package com.perfulandia.backend.messaging.producer;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OrdenProducer {

    private final RabbitTemplate rabbitTemplate;
    private final String exchange;
    private final String routingKey;

    public OrdenProducer(
            RabbitTemplate rabbitTemplate,
            @Value("${app.rabbitmq.exchange.ordenes}") String exchange,
            @Value("${app.rabbitmq.routing-key.ordenes}") String routingKey) {
        this.rabbitTemplate = rabbitTemplate;
        this.exchange = exchange;
        this.routingKey = routingKey;
    }

    public void enviarOrden(String mensaje) {
        rabbitTemplate.convertAndSend(exchange, routingKey, mensaje);
    }
}
