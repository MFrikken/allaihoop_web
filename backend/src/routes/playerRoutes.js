const express = require('express');
const multer = require('./multerConfig');
const service = require('../service/playerService');
const rabbitmqService = require("../service/rabbitmq/rabbitmq_publisher");

const router = express.Router();

router.post('/interpretation', multer.upload.single('image'), async (req, res) => {
    if (req.file) {
        const { filename } = req.file;
        const responseBody = await service.interpretImage(req.file);


        await rabbitmqService.sendToRabbitMQ_delete("delete", filename);
        res.status(200).send(responseBody);
    } else {
        res.status(500).send("Image could not be received.");
    }
});

router.post("/saveImageLongtime", async(req, res) => {
    const { filename, feedback } = req.body;
    console.log(filename + " " + feedback);

    if(await service.checkImage(filename) && (feedback || !feedback)) {
        const message = {
            filename,
            feedback,
        };
        await rabbitmqService.sendToRabbitMQ_save("save", message);
        res.status(200).send("Image sent to long time storage.");
    } else {
        res.status(500).send("Image could not be saved.");
    }
});

module.exports = router;