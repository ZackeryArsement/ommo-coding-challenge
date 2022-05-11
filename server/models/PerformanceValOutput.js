const { Schema, model } = require("mongoose");
const Sensor = require('./Sensor')

const performanceValOutputSchema = new Schema({
    validation_date:{
        type: Date,
        required: true,
    },
    algorithm_version: {
        type: String,
        required: true
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

const PerformanceValOutput = model("PerformanceValOutput", performanceValOutputSchema);

module.exports = PerformanceValOutput;