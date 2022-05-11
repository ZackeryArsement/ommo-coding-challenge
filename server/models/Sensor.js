const { Schema, model } = require("mongoose");

const sensorSchema = new Schema({
    sensor_unique_id: {
        type: String,
        required: true
    },
    sensor_type: {
        type: String,
        required: true,
    },
    sensor_data: [{
        type: String,
        required: true,
    }],
    calibration_parameters: [{
        type: String,
        required: true
    }],
    accuracy: {
        type: Number,
        required: true
    },
    precision: {
        type: Number,
        required: true
    }
});

const Sensor = model("Sensor", sensorSchema);

module.exports = Sensor;