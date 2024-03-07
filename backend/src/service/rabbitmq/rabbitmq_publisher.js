const amqp = require("amqplib");

const EXCHANGE = "image_exchange";

const DELETE_IMAGE_QUEUE = "deleteImage_queue";
const SAVE_IMAGE_QUEUE = "saveImage_queue";

const DELETE_IMAGE_ROUTINGKEY = "deleteImage_routingKey";
const SAVE_IMAGE_ROUTINGKEY = "saveImage_routingKey";

const CONNECTION = "amqp://guest:guest@localhost:5672";
const sendToRabbitMQ_delete = async (topic, message) => {
    const connection = await amqp.connect(CONNECTION);
    const channel = await connection.createChannel();


    await channel.assertExchange(EXCHANGE, "topic", {durable: false});
    await channel.assertQueue(DELETE_IMAGE_QUEUE, {durable: false});
    await channel.bindQueue(DELETE_IMAGE_QUEUE, EXCHANGE, DELETE_IMAGE_ROUTINGKEY);
    await channel.publish(EXCHANGE, DELETE_IMAGE_ROUTINGKEY, Buffer.from(JSON.stringify(message)));

    console.log(`Message sent to RabbitMQ. Topic: ${topic}, Message: ${JSON.stringify(message)}`);

    await channel.close();
    await connection.close();
};

const sendToRabbitMQ_save = async (topic, message) => {
    const connection = await amqp.connect(CONNECTION);
    const channel = await connection.createChannel();


    await channel.assertExchange(EXCHANGE, "topic", {durable: false});
    await channel.assertQueue(SAVE_IMAGE_QUEUE, {durable: false});
    await channel.bindQueue(SAVE_IMAGE_QUEUE, EXCHANGE, SAVE_IMAGE_ROUTINGKEY);
    await channel.publish(EXCHANGE, SAVE_IMAGE_ROUTINGKEY, Buffer.from(JSON.stringify(message)));

    console.log(`Message sent to RabbitMQ. Topic: ${topic}, Message: ${JSON.stringify(message)}`);

    await channel.close();
    await connection.close();
};

module.exports = {
    sendToRabbitMQ_delete,
    sendToRabbitMQ_save,
};