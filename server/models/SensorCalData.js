const { Schema, model } = require("mongoose");
const Sensor = require('./Sensor')

const sensorCalDataSchema = new Schema({
    file_name: {
        type: String,
        required: true
    },
    calibration_date:{
        type: Date,
        required: true,
    },
    sensors: [{
        type: Schema.Types.ObjectId,
        ref: 'Sensor'
    }]
});

const SensorCalData = model("SensorCalData", sensorCalDataSchema);

module.exports = SensorCalData;