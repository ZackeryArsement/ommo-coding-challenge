const { gql } = require("apollo-server-express");

const typeDefs = gql`
type Sensor {
    _id: ID
    sensor_unique_id: String
    sensor_type: String
    sensor_data: [String]
    calibration_parameters: [String]
    accuracy: Float
    precision: Float
}

type BaseCalData {
    _id: ID
    calibration_date: String
    base_station_unique_id: String
    sensors: [Sensor]
}

type PerformanceValOutput {
    _id: ID
    validation_date: String
    algorithm_version: String
    base_station_unique_id: String
    sensors: [Sensor]
}

type SensorCalData {
    _id: ID
    file_name: String
    calibration_date: String
    sensors: [Sensor]
}

type SensorCalOutput {
    _id: ID
    calibration_file: String
    generation_date: String
    algorithm_version: String
    sensors: [Sensor]
}

type Query {
    sensorCalData: [SensorCalData]
    baseCalData: [BaseCalData]
    sensorCalOutput: [SensorCalOutput]
    performanceValOutput: [PerformanceValOutput]
    sensor: [Sensor]
}
`

module.exports = typeDefs;