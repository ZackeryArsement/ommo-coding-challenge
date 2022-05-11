const { Schema, model } = require("mongoose");
const Sensor = require('./Sensor')

const sensorCalOutputSchema = new Schema({
    calibration_file:{
        type: String,
        required: true,
    },
    generation_date: {
        type: Date,
        required: true
    },
    algorithm_version: {
        type: String,
        required: true
    },
    sensors: [{
        type: Schema.Types.ObjectId,
        ref: 'Sensor'
    }]
});

const SensorCalOutput = model("SensorCalOutput", sensorCalOutputSchema);

module.exports = SensorCalOutput;