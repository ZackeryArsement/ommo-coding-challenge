import { gql } from "@apollo/client";

export const QUERY_SENSOR_CALIBRATION_DATA = gql`
query sensorCalData {
    sensorCalData {
        _id
        file_name
        calibration_date
        sensors {
            _id
            sensor_unique_id
            sensor_type
            sensor_data
        }
    }
}
`
export const QUERY_BASE_CALIBRATION_DATA = gql`
query baseCalData {
    baseCalData {
        _id
        calibration_date
        base_station_unique_id
        sensors {
            _id
            sensor_unique_id
            sensor_type
            sensor_data
        }
    }
}
`

export const QUERY_SENSOR_CALIBRATION_OUTPUT = gql`
query sensorCalOutput {
    sensorCalOutput {
        _id
        calibration_file
        generation_date
        algorithm_version
        sensors {
            _id
            sensor_unique_id
            calibration_parameters
        }
    }
}
`

export const QUERY_PERFORMANCE_VALIDATION_OUTPUT = gql`
query performanceValOutput {
    performanceValOutput {
        _id
        validation_date
        algorithm_version
        base_station_unique_id
        sensors {
            _id
            sensor_unique_id
            accuracy
            precision
        }
    }
}
`

export const QUERY_SENSOR = gql`
query sensor {
    sensor {
        _id
        sensor_type
    }
}
`