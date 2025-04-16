package com.phat.infrastructure.configuration;

import com.phat.api.model.request.SendMailDto;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;


import java.util.HashMap;
import java.util.Map;

import static com.phat.app.helper.Constants.KAFKA_TOPIC_SEND_MAIL;

@Configuration
public class KafkaConfig {
    @Bean
    public NewTopic kafkaSendMailTopic() {
        return TopicBuilder.name(KAFKA_TOPIC_SEND_MAIL).build();
    }
}
