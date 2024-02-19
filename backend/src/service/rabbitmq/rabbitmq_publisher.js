const amqp = require("amqplib");

const EXCHANGE = "deleteImage_exchange";
const QUEUE = "deleteImage_queue";
const ROUTINGKEY = "deleteImage_routingKey";

const CONNECTION = "amqp://guest:guest@localhost:5672";
const sendToRabbitMQ = async (topic, message) => {
    const connection = await amqp.connect(CONNECTION);
    const channel = await connection.createChannel();


    await channel.assertExchange(EXCHANGE, "topic", {durable: false});
    await channel.assertQueue(QUEUE, {durable: false});
    await channel.bindQueue(QUEUE, EXCHANGE, ROUTINGKEY);
    await channel.publish(EXCHANGE, ROUTINGKEY, Buffer.from(JSON.stringify(message)));

    console.log(`Message sent to RabbitMQ. Topic: ${topic}, Message: ${JSON.stringify(message)}`);

    await channel.close();
    await connection.close();
};

module.exports = {
    sendToRabbitMQ,
};