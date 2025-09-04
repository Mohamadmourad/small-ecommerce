package com.small_ecommerce.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaProducerService.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void send(String topic, Object payload) {
        try {
            var future = kafkaTemplate.send(topic, payload);
            future.whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("failed to send message to topic={}", topic, ex);
                } else if (result != null) {
                    var metadata = result.getRecordMetadata();
                    if (metadata != null) {
                        log.debug("sent message to topic={} partition={} offset={} payload={}",
                                topic, metadata.partition(), metadata.offset(), payload);
                    } else {
                        log.debug("sent message to topic={} payload={}", topic, payload);
                    }
                }
            });
        } catch (Exception ex) {
            log.error("exception while publishing kafka message to topic={}", topic, ex);
        }
    }
}
