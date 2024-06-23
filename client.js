const {Kafka} = require('kafkajs');

exports.kafka=new Kafka({
    clientId:'app',
    brokers:['192.168.29.55:9092']
});
