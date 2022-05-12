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

    let dataSliceIndexArray = [];
    let columnNumb = 3

    if(data.sensors.length > 2){
        console.log(data.sensors[0])
        for(let i = 0; i<columnNumb; i++){
            let columnLength = Math.round((data.sensors[0].sensor_data.length/3));
            let endSliceIndex = columnLength*(i+1) + 1
    
            // We create an array of where to slice the sensor data for when we create multiple columns of data
            dataSliceIndexArray[i] = [i*columnLength,endSliceIndex];
        }
    }

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
                                    {/* We create multiple columns to display our data */}
                                    {dataSliceIndexArray.map((sliceData, columnIndex) =>(
                                        <div key={columnIndex} className={classes.dataColumn}>
                                            <div className={classes.dataHeader}>
                                                <div className={classes.dataIndex}>
                                                    Index
                                                </div>
                                                <div className={classes.dataPosHeader}>
                                                    X
                                                </div>
                                                <div className={classes.dataPosHeader}>
                                                    Y
                                                </div>
                                                <div className={classes.dataPosHeader}>
                                                    Z
                                                </div>
                                            </div>

                                            {/* Every column will loop through all of that */}
                                            {sensor.sensor_data.slice(sliceData[0], sliceData[1]).map((data,dataIndex)=>(
                                                <div key={dataIndex} className={classes.dataPoint}>
                                                    <div className={classes.dataIndex}>
                                                        {sliceData[0]+(dataIndex+1)}:
                                                    </div>
                                                    <div className={classes.dataData}>
                                                        <div className={classes.dataPosValue}>
                                                            {data.split(',')[0]}
                                                        </div>
                                                        <div className={classes.dataPosValue}>
                                                            {data.split(',')[1]}
                                                        </div>
                                                        <div className={classes.dataPosValue}>
                                                            {data.split(',')[2]}
                                                        </div>
                                                    </div>  
                                                </div>
                                            ))}
                                        </div>
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