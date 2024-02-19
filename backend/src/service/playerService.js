const repo = require('../repository/playerRepository');
const tf = require('@tensorflow/tfjs-node');


function getImageFromShortTime(filename) {
    const image = repo.getImageFromShortTime(filename);

    if (image) return image;
    console.log("No image found for id = " + filename);
}

async function interpretImage(file) {
    try {
        const { filename } = file;

        const values = await loadAndPredict(filename);
        values[0][0] = values[0][0].toFixed(2);
        values[0][1] = values[0][1].toFixed(2);

        return {
            id: filename,
            values: [values[0][0], values[0][1]]
        };
    } catch (e) {
        console.log("Error interpreting the image: " + e);
    }
}

// implement trained model and predict prepared image
async function loadAndPredict(fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            const imageTensor = await prepareImage(fileName);
            tf.loadLayersModel('file:///home/mfrikken/WebstormProjects/allaihoop/backend/model/model.json')
                .then(model => {
                    const prediction = model.predict(imageTensor);
                    return prediction.array();
                })
                .then(values => {
                    resolve(values);
                })
                .catch(e => {
                    reject(e);
                });
        } catch (e) {
            reject(e);
        }
    });
}

async function prepareImage(filename) {

    const buffer = await getImageFromShortTime(filename);

    let imageTensor = tf.node.decodeImage(buffer)
        .resizeNearestNeighbor([96, 96])
        .toFloat()
        .div(tf.scalar(255.0));

    if (imageTensor.shape[2] !== 3) {
        imageTensor = imageTensor.slice([0, 0, 0], [96, 96, 3]);
    }

    if (imageTensor.size > 0) {
        imageTensor = imageTensor.expandDims(0);
        return imageTensor;
    } else {
        console.log("Error preparing the image.")
    }
}


module.exports = { interpretImage };