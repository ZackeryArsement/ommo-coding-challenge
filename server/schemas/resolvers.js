const { AuthenticationError } = require("apollo-server-express");
const { Sensor, BaseCalData, PerformanceValOutput, SensorCalData, SensorCalOutput } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        sensorCalData: async () => {
            return SensorCalData.find()
            .populate({
                path: 'sensors',
                model: 'Sensor'
            });
        },
        baseCalData: async () => {
            return BaseCalData.find()
            .populate({
                path: 'sensors',
                model: 'Sensor'
            });
        },
        sensorCalOutput: async () => {
            return SensorCalOutput.find()
            .populate({
                path: 'sensors',
                model: 'Sensor'
            });
        },
        performanceValOutput: async () => {
            return PerformanceValOutput.find()
            .populate({
                path: 'sensors',
                model: 'Sensor'
            });
        },        
        sensor: async () => {
            return Sensor.find();
        },
    },
    
};

module.exports = resolvers;