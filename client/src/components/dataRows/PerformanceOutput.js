// Displays:
// validation_date
// algorithm_version
// base_station_unique_id
// sensors []

import classes from './row.module.css'

import { useState, useEffect } from 'react';

const PerformanceOutput = ({data}) =>{
    let date = new Date(data.validation_date*1);
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();

    const [showSensors, setShowSensors] = useState(false);

    let validationDate = month + '/' + day + '/' + year
    return (
        <div>
            <div className={classes.row}>
                <div>
                    <div>
                        Validation Date
                    </div>
                    <div>{validationDate}</div>
                </div>

                <div>
                    <div>
                        Algorithm Version
                    </div>
                    <div>{data.algorithm_version}</div>

                </div>

                <div>
                    <div>
                        Base Station ID
                    </div>
                    <div>{data.base_station_unique_id}</div>

                </div>

                <div>
                    <div>
                        Sensor List
                    </div>
                    <button onClick={() => setShowSensors(!showSensors)}>v</button>
                </div>
            </div>

            {/* Sensors should show: */}
            {/* unique_id */}
            {/* accuracy */}
            {/* precision */}
            {showSensors ? (
                <div className={classes.sensors}>
                    {data.sensors.map((sensor, index) => (
                        <div key={index} className={classes.row}>
                            <div>
                                <div>
                                    Unique ID
                                </div>
                                {sensor.sensor_unique_id}
                            </div>

                            <div>
                                <div>
                                    Accuracy
                                </div>
                                {sensor.accuracy}mm
                            </div>

                            <div>
                                <div>
                                    Precision
                                </div>
                                {sensor.precision}mm
                            </div>

                        </div>
                    ))}
                </div>

            ) : (null)}
        </div>

    )
}

export default PerformanceOutput