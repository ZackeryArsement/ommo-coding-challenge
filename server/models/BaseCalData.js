const { Schema, model } = require("mongoose");
const Sensor = require('./Sensor')

const baseCalData = new Schema({
    calibration_date:{
        type: Date,
        required: true,
    },
    base_station_unique_id: {
        type: String,
        required: true
    },
    sensors: [{
        type: Schema.Types.ObjectId,
        ref: 'Sensor'
    }]
});

const BaseCalData = model("BaseCalData", baseCalData);

module.exports = BaseCalData;