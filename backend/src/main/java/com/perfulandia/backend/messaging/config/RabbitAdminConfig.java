package com.perfulandia.backend.messaging.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.amqp.rabbit.config.RetryInterceptorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.interceptor.RetryOperationsInterceptor;

@Configuration
public class RabbitAdminConfig {
 @Bean public RabbitAdmin rabbitAdmin(ConnectionFactory cf) { return new RabbitAdmin(cf); }
 @Bean public DirectExchange ordenesExchange() { return new DirectExchange("perfulandia.ordenes.exchange", true, false); }
 @Bean public TopicExchange eventosExchange() { return new TopicExchange("perfulandia.eventos.topic", true, false); }
 @Bean public DirectExchange deadLetterExchange() { return new DirectExchange("perfulandia.dlx", true, false); }
 @Bean public Queue ordenesQueue() { return QueueBuilder.durable("perfulandia.ordenes.queue").deadLetterExchange("perfulandia.dlx").deadLetterRoutingKey("ordenes.fallida").build(); }
 @Bean public Queue pagosQueue() { return QueueBuilder.durable("perfulandia.pagos.queue").deadLetterExchange("perfulandia.dlx").deadLetterRoutingKey("pagos.fallidos").build(); }
 @Bean public Queue inventarioQueue() { return QueueBuilder.durable("perfulandia.inventario.queue").deadLetterExchange("perfulandia.dlx").deadLetterRoutingKey("inventario.fallido").build(); }
 @Bean public Queue ordenesDlq() { return QueueBuilder.durable("perfulandia.ordenes.dlq").build(); }
 @Bean public Queue pagosDlq() { return QueueBuilder.durable("perfulandia.pagos.dlq").build(); }
 @Bean public Queue inventarioDlq() { return QueueBuilder.durable("perfulandia.inventario.dlq").build(); }
 @Bean public Binding ordenesBinding(Queue ordenesQueue, DirectExchange ordenesExchange) { return BindingBuilder.bind(ordenesQueue).to(ordenesExchange).with("ordenes.creada"); }
 @Bean public Binding pagosBinding(Queue pagosQueue, TopicExchange eventosExchange) { return BindingBuilder.bind(pagosQueue).to(eventosExchange).with("pagos.*"); }
 @Bean public Binding inventarioBinding(Queue inventarioQueue, TopicExchange eventosExchange) { return BindingBuilder.bind(inventarioQueue).to(eventosExchange).with("inventario.#"); }
 @Bean public Binding ordenesDlqBinding(Queue ordenesDlq, DirectExchange deadLetterExchange) { return BindingBuilder.bind(ordenesDlq).to(deadLetterExchange).with("ordenes.fallida"); }
 @Bean public Binding pagosDlqBinding(Queue pagosDlq, DirectExchange deadLetterExchange) { return BindingBuilder.bind(pagosDlq).to(deadLetterExchange).with("pagos.fallidos"); }
 @Bean public Binding inventarioDlqBinding(Queue inventarioDlq, DirectExchange deadLetterExchange) { return BindingBuilder.bind(inventarioDlq).to(deadLetterExchange).with("inventario.fallido"); }
 @Bean public RetryOperationsInterceptor rabbitRetryInterceptor() { return RetryInterceptorBuilder.stateless().maxAttempts(3).backOffOptions(1000,2.0,10000).recoverer(new RejectAndDontRequeueRecoverer()).build(); }
 @Bean public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory cf, RetryOperationsInterceptor retry) {
  SimpleRabbitListenerContainerFactory f=new SimpleRabbitListenerContainerFactory(); f.setConnectionFactory(cf); f.setDefaultRequeueRejected(false); f.setAdviceChain(retry); return f;
 }
}
