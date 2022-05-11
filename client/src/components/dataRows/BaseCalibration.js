// Displays
// calibration_date
// base_station_unique_id
// sensors []

import classes from './row.module.css'

import { useState, useEffect } from 'react';

const BaseCalibration = ({data}) =>{
    let date = new Date(data.calibration_date*1);
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear();

    const [showSensors, setShowSensors] = useState(false);
    const [showData, setShowData] = useState();

    let calibrationDate = month + '/' + day + '/' + year
    return (
        <div>
            <div className={classes.row}>
                <div>
                    <div>
                        Calibration Date
                    </div>
                    <div>{calibrationDate}</div>

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
            {/* sensor_type */}
            {/* data */}
            {showSensors ? (
                <div className={classes.sensors}>
                    {data.sensors.map((sensor, index) => (
                        <div key={index}>
                            <div className={classes.row}>
                                <div>
                                    <div>
                                        Unique ID
                                    </div>
                                    {sensor.sensor_unique_id}
                                </div>
                                <div>
                                    <div>
                                        Sensor Type
                                    </div>
                                    {sensor.sensor_type}
                                </div>
                                <div>
                                    <div>
                                        Data
                                    </div>
                                    <button onClick={() => showData === index ? setShowData('') : setShowData(index)}>v</button>
                                </div>
                            </div>

                            {showData === index ? (
                                    <div className={classes.sensorData}>
                                        {sensor.sensor_data.map((data,index)=>(
                                            <div key={index}>{index}: [{data}]</div>
                                        ))}
                                    </div>
                                ): (null)}
                        </div>
                    ))}
                </div>

            ) : (null)}
        </div>
    )
}

export default BaseCalibration