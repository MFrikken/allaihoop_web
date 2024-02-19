const express = require('express');
const multer = require('./multerConfig');
const service = require('../service/playerService');
const rabbitmqService = require("../service/rabbitmq/rabbitmq_publisher");

const router = express.Router();

router.post('/interpretation', multer.upload.single('image'), async (req, res) => {
    if (req.file) {
        const responseBody = await service.interpretImage(req.file);

        const { filename } = req.file;
        await rabbitmqService.sendToRabbitMQ("delete", filename);
        res.status(200).send(responseBody);
    } else {
        res.status(500).send("Image could not be received.");
    }
});

router.get("/test", async (req, res) => {
    await rabbitmqService.sendToRabbitMQ("delete", "Test");
    res.status(200).send("Hello World!");
})

module.exports = router;