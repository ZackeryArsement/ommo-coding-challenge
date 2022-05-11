// Displays:
// calibration_file
// generation_date
// algorithm_version
// sensors []

import classes from './row.module.css'

import { useState, useEffect } from 'react';

const SensorOutput = ({data}) =>{
        let date = new Date(data.generation_date*1);
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
    
        const [showSensors, setShowSensors] = useState(false);        
    
        let generationDate = month + '/' + day + '/' + year
        return (
            <div>
                <div className={classes.row}>
                    <div>
                        <div>
                            Calibration File
                        </div>
                        <div>{data.calibration_file}</div>
                    </div>
    
                    <div>
                        <div>
                            Generation Date
                        </div>
                        <div>{generationDate}</div>
    
                    </div>
    
                    <div>
                        <div>
                            Algorithm Version
                        </div>
                        <div>{data.algorithm_version}</div>
    
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
                {/* calibration_parameters */}
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
                                        Calibration Parameters
                                    </div>
                                    <div>
                                        [{sensor.calibration_parameters[0].split(':')[0]}]
                                    </div>
                                    <div>
                                        [{sensor.calibration_parameters[0].split(':')[1]}]
                                    </div>
                                    <div>
                                        [{sensor.calibration_parameters[0].split(':')[2]}]
                                    </div>
                                </div>
    
                            </div>
                        ))}
                    </div>
    
                ) : (null)}
            </div>
    )
}

export default SensorOutput