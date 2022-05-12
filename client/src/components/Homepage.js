import classes from './Homepage.module.css';
import { useState, useEffect } from 'react';

import * as moment from 'moment';

//import specific rows depending on data type
import BaseCalibration from './dataRows/BaseCalibration.js'
import PerformanceOutput from './dataRows/PerformanceOutput'
import SensorData from './dataRows/SensorData.js'
import SensorOutput from './dataRows/SensorOutput.js'
import Sensors from './dataRows/Sensors';

import { useQuery } from '@apollo/client';
import { QUERY_SENSOR_CALIBRATION_DATA } from './utils/queries';
import { QUERY_BASE_CALIBRATION_DATA } from './utils/queries';
import { QUERY_SENSOR_CALIBRATION_OUTPUT } from './utils/queries';
import { QUERY_PERFORMANCE_VALIDATION_OUTPUT } from './utils/queries';
import { QUERY_SENSOR } from './utils/queries';


const Homepage = () => {
    // store data sets
    const [sensorCalData, setSensorCalData] = useState([]);
    const [baseCalData, setBaseCalData] = useState([]);
    const [sensorCalOutput, setSensorCalOutput] = useState([]);
    const [performanceValOutput, setPerformanceValOutput] = useState([]);
    const [sensors, setSensors] = useState([])

    // query parameters
    const [filterDataSet, setFilterDataSet] = useState('Sensor Calibration Data')
    const [dataSet, setDataSet] = useState('Sensor Calibration Data')
    const [sensorTypeString, setSensorTypeString] = useState('All')
    const [sensorTypeNumber, setSensorTypeNumber] = useState('')
    const [baseID, setBaseID] = useState('')
    const [startDay, setStartDay] = useState('')
    const [endDay, setEndDay] = useState('')
    const [algVersion, setAlgVersion] = useState('')
    const [calFile, setCalFile] = useState('')
    const [accuracy, setAccuracy] = useState(2)
    const [precision, setPrecision] = useState(2)

    // filtered data
    const [filteredData, setFilteredData] = useState([])

    const { loading: loadSensorCalData, data: dataSensorCalData, refetch: refetchSensorCalData } = useQuery(QUERY_SENSOR_CALIBRATION_DATA);
    const { loading: loadBaseCalData, data: dataBaseCalData, refetch: refetchBaseCalData } = useQuery(QUERY_BASE_CALIBRATION_DATA);
    const { loading: loadSensorCalOutput, data: dataSensorCalOutput, refetch: refetchSensorCalOutput } = useQuery(QUERY_SENSOR_CALIBRATION_OUTPUT);
    const { loading: loadPerformanceValOutput, data: dataPerformanceValOutput, refetch: refetchPerformanceValOutput } = useQuery(QUERY_PERFORMANCE_VALIDATION_OUTPUT);
    const { loading: loadSensors, data: dataSensors, refetch: refetchSensors } = useQuery(QUERY_SENSOR);

    useEffect(() => {
        if(!loadSensorCalData){
            setSensorCalData(dataSensorCalData.sensorCalData)
        }
    }, [loadSensorCalData])

    useEffect(() => {
        if(!loadBaseCalData){
            setBaseCalData(dataBaseCalData.baseCalData)
        }
    }, [loadBaseCalData])

    useEffect(() => {
        if(!loadSensorCalOutput){
            setSensorCalOutput(dataSensorCalOutput.sensorCalOutput)
        }
    }, [loadSensorCalOutput])

    useEffect(() => {
        if(!loadPerformanceValOutput){
            setPerformanceValOutput(dataPerformanceValOutput.performanceValOutput)
        }
    }, [loadPerformanceValOutput])

    useEffect(() => {
        if(!loadSensors){
            setSensors(dataSensors.sensor)
        }
    }, [loadSensors])

    console.log(sensorCalData)

    const searchData = () => {
        let tempFiltered;

        // First we do an intial filter to see what data type we want to pull
        if(filterDataSet === 'Sensor Calibration Data'){
            setDataSet('Sensor Calibration Data')
            tempFiltered = sensorCalData;
        } else if (filterDataSet === 'Base Station Calibration Data'){
            setDataSet('Base Station Calibration Data')
            tempFiltered = baseCalData;
        } else if (filterDataSet === 'Sensor Calibration Output'){
            setDataSet('Sensor Calibration Output')
            tempFiltered = sensorCalOutput;
        } else if (filterDataSet === 'Performance Validation Output'){
            setDataSet('Performance Validation Output')
            tempFiltered = performanceValOutput;
        } else if (filterDataSet === 'All'){
            setDataSet('All')
            tempFiltered = sensors;
        }

        // filter this data type with the variuos other filters
        setFilteredData(filterData(tempFiltered))
    }

    const filterData = (dataToFilter) => {
        // Filter

        // As we go through the filters we have to check and make sure there is still 1 array value in the data we are parsing... this prevents an error from occuring when we try to retrieve data from an empty array
        
        // if the data type has a date then check if the user has a date filter
        if(('calibration_date' in dataToFilter[0]) || ('generation_date' in dataToFilter[0]) || ('validation_date' in dataToFilter[0])){
            // filter by date if it is selected
            if('calibration_date' in dataToFilter[0]){
                if(moment((startDay), 'MM/DD/YYYY', true).isValid()){
                    dataToFilter = dataToFilter.filter((dataPoint) => {
                        let date = new Date(dataPoint.calibration_date*1);
                        let day = date.getDate();
                        let month = date.getMonth()+1;
                        let year = date.getFullYear();
    
                        if(day.length < 2){
                            day = '0' + day;
                        }
                        if(month.length < 2){
                            month = '0' + month;
                        }
        
                        let calibrationDate = month + '/' + day + '/' + year
                        // only return the values that happened after the start date
                        return (moment(calibrationDate, "MM/DD/YYYY") > moment((startDay), 'MM/DD/YYYY'))
                    })
                }

                if(moment((endDay), 'MM/DD/YYYY', true).isValid()){
                    dataToFilter = dataToFilter.filter((dataPoint) => {
                        let date = new Date(dataPoint.calibration_date*1);
                        let day = date.getDate();
                        let month = date.getMonth()+1;
                        let year = date.getFullYear();
    
                        if(day.length < 2){
                            day = '0' + day;
                        }
                        if(month.length < 2){
                            month = '0' + month;
                        }
        
                        let calibrationDate = month + '/' + day + '/' + year
                        // only return the values that happened after the start date
                        return (moment(calibrationDate, "MM/DD/YYYY") < moment((endDay), 'MM/DD/YYYY'))
                    })
                }
            } else if ('generation_date' in dataToFilter[0]){
                if(moment((startDay), 'MM/DD/YYYY', true).isValid()){
                    dataToFilter = dataToFilter.filter((dataPoint) => {
                        let date = new Date(dataPoint.generation_date*1);
                        let day = date.getDate();
                        let month = date.getMonth()+1;
                        let year = date.getFullYear();
    
                        if(day.length < 2){
                            day = '0' + day;
                        }
                        if(month.length < 2){
                            month = '0' + month;
                        }
        
                        let calibrationDate = month + '/' + day + '/' + year
                        // only return the values that happened after the start date
                        return (moment(calibrationDate, "MM/DD/YYYY") > moment((startDay), 'MM/DD/YYYY'))
                    })
                }

                if(moment((endDay), 'MM/DD/YYYY', true).isValid()){
                    dataToFilter = dataToFilter.filter((dataPoint) => {
                        let date = new Date(dataPoint.generation_date*1);
                        let day = date.getDate();
                        let month = date.getMonth()+1;
                        let year = date.getFullYear();
    
                        if(day.length < 2){
                            day = '0' + day;
                        }
                        if(month.length < 2){
                            month = '0' + month;
                        }
        
                        let calibrationDate = month + '/' + day + '/' + year
                        // only return the values that happened after the start date
                        return (moment(calibrationDate, "MM/DD/YYYY") < moment((endDay), 'MM/DD/YYYY'))
                    })
                }
            } else if ('validation_date' in dataToFilter[0]){
                if(moment((startDay), 'MM/DD/YYYY', true).isValid()){
                    dataToFilter = dataToFilter.filter((dataPoint) => {
                        let date = new Date(dataPoint.validation_date*1);
                        let day = date.getDate();
                        let month = date.getMonth()+1;
                        let year = date.getFullYear();
    
                        if(day.length < 2){
                            day = '0' + day;
                        }
                        if(month.length < 2){
                            month = '0' + month;
                        }
        
                        let calibrationDate = month + '/' + day + '/' + year
                        // only return the values that happened after the start date
                        return (moment(calibrationDate, "MM/DD/YYYY") > moment((startDay), 'MM/DD/YYYY'))
                    })
                }

                if(moment((endDay), 'MM/DD/YYYY', true).isValid()){
                    dataToFilter = dataToFilter.filter((dataPoint) => {
                        let date = new Date(dataPoint.validation_date*1);
                        let day = date.getDate();
                        let month = date.getMonth()+1;
                        let year = date.getFullYear();
    
                        if(day.length < 2){
                            day = '0' + day;
                        }
                        if(month.length < 2){
                            month = '0' + month;
                        }
        
                        let calibrationDate = month + '/' + day + '/' + year
                        // only return the values that happened after the start date
                        return (moment(calibrationDate, "MM/DD/YYYY") < moment((endDay), 'MM/DD/YYYY'))
                    })
                }
            }

        }

        // if the datatype has an algorithm version then filter for that version
        if(dataToFilter.length > 0){
            if('algorithm_version' in dataToFilter[0]){

                if(algVersion.split('.').length >= 3){
                    dataToFilter = dataToFilter.filter((dataPoint) => {
                        return dataPoint.algorithm_version === algVersion
                    })
                }
            }
        }

        // if the datatype has a calibration file linked to it then filter for that file
        if(dataToFilter.length > 0){
            if('calibration_file' in dataToFilter[0]){
                if(calFile.length > 0 && !isNaN(calFile[0])){
                    dataToFilter = dataToFilter.filter((dataPoint) => dataPoint.calibration_file.split('-')[1] === calFile)
                }
            }
        }

        // filter data by their associated sensor types / accuracy / precision
        if(dataToFilter.length > 0){
            if('sensors' in dataToFilter[0]){
                // filter sensor types
                if(dataToFilter.length > 0){
                    if('sensor_type' in dataToFilter[0].sensors[0]){
                        // filter by their part type
                        if(sensorTypeString !== 'All' && !(sensorTypeNumber.length > 0 && !isNaN(sensorTypeNumber[0]))){
                            dataToFilter = dataToFilter.filter((dataPoint) => {
                                let containsString;
    
                                // if any of the sensors contain that kind of part then return this data file
                                dataPoint.sensors.map((sensor) => {
                                    if(sensor.sensor_type.split('-')[0] === sensorTypeString){
                                        containsString = true;
                                    }
                                })
    
                                return containsString
                            })
                        }
    
                        // filter by their part index
                        if((sensorTypeNumber.length > 0 && !isNaN(sensorTypeNumber[0])) && !(sensorTypeString !== 'All')){
                            dataToFilter = dataToFilter.filter((dataPoint) => {
                                let containsIndex;
    
                                // if any of the sensors contain that kind of part then return this data file
                                dataPoint.sensors.map((sensor) => {
                                    if(sensor.sensor_type.split('-')[1] === sensorTypeNumber){
                                        containsIndex = true;
                                    }
                                })
                                
                                return containsIndex
                            })
                        }
    
                        // if type and index are selected then look for that specific item
                        if(sensorTypeString !== 'All' && sensorTypeNumber.length > 0 && !isNaN(sensorTypeNumber[0])){
                            dataToFilter = dataToFilter.filter((dataPoint) => {
                                let containsType;
    
                                // if any of the sensors contain that kind of part then return this data file
                                dataPoint.sensors.map((sensor) => {
                                    if(sensor.sensor_type === sensorTypeString + '-' + sensorTypeNumber){
                                        containsType = true;
                                    }
                                })
                                
                                return containsType
                            })
                        }
                    }
                }

                // filter sensors accuracy
                if(dataToFilter.length > 0){
                    if('accuracy' in dataToFilter[0].sensors[0]){
                        let updateAccuracy = Math.round(accuracy*1000)

                        if(accuracy.length > 1 && !isNaN(updateAccuracy)){
                            dataToFilter = dataToFilter.filter((dataPoint) =>{
                                let isWithinAccuracy = true;

                                dataPoint.sensors.map((sensor) => {
                                    if(Math.round(sensor.accuracy*1000) >= updateAccuracy){
                                        isWithinAccuracy = false;
                                    }
                                })

                                return isWithinAccuracy
                            })
                        }
                    }
                }

                // filter sensors precision
                if(dataToFilter.length > 0){
                    if('precision' in dataToFilter[0].sensors[0]){
                        let updatePrecision = Math.round(precision*1000)

                        if(precision.length > 1 && !isNaN(updatePrecision)){
                            dataToFilter = dataToFilter.filter((dataPoint) =>{
                                let isWithinPrecision = true;

                                dataPoint.sensors.map((sensor) => {
                                    if(Math.round(sensor.precision*1000) >= updatePrecision){
                                        isWithinPrecision = false;
                                    }
                                })

                                return isWithinPrecision
                            })
                        }
                    } 
                }
            }
        }

        // filter all sensors by their type
        if(dataToFilter.length > 0){
            if('sensor_type' in dataToFilter[0]){
                // filter by their part type
                if(sensorTypeString !== 'All' && !(sensorTypeNumber.length > 0 && !isNaN(sensorTypeNumber[0]))){
                    dataToFilter = dataToFilter.filter((dataPoint) => {
                        return dataPoint.sensor_type.split('-')[0] === sensorTypeString
                    })
                }

                // filter by their part index
                if((sensorTypeNumber.length > 0 && !isNaN(sensorTypeNumber[0])) && !(sensorTypeString !== 'All')){
                    dataToFilter = dataToFilter.filter((dataPoint) => {
                        return dataPoint.sensor_type.split('-')[1] === sensorTypeNumber
                    })
                }

                // if type and index are selected then look for that specific item
                if(sensorTypeString !== 'All' && sensorTypeNumber.length > 0 && !isNaN(sensorTypeNumber[0])){
                    dataToFilter = dataToFilter.filter((dataPoint) => {
                        return dataPoint.sensor_type === sensorTypeString + '-' + sensorTypeNumber
                    })
                }
            }
        }

        // if the datatype has a basestation id filter by the user input
        if(dataToFilter.length > 0){
            if('base_station_unique_id' in dataToFilter[0]){
                if(baseID.length > 0 && !isNaN(baseID)){
                    dataToFilter = dataToFilter.filter((dataPoint) => {
                        return dataPoint.base_station_unique_id === baseID
                    })
                }
            }
        }

        // if we are searching all sensors then filter them by their accuracy
        if(dataToFilter.length >0){
            if('accuracy' in dataToFilter[0]){
                let updateAccuracy = Math.round(accuracy*1000)

                if(accuracy.length > 1 && !isNaN(updateAccuracy)){
                    dataToFilter = dataToFilter.filter((sensor) =>{
                        return sensor.accuracy*1000 <= updateAccuracy
                    })
                }
            }
        }

        // if we are searching all sensors then filter them by their precision
        if(dataToFilter.length >0){
            if('precision' in dataToFilter[0]){
                let updatePrecision = Math.round(precision*1000)

                if(precision.length > 1 && !isNaN(updatePrecision)){
                    dataToFilter = dataToFilter.filter((sensor) =>{
                        return sensor.precision*1000 <= updatePrecision
                    })
                }
            }
        }

        return dataToFilter
    }

    return (
        <div className={classes.main}>

            {(!dataSensorCalData || !dataBaseCalData || !dataSensorCalOutput || !dataPerformanceValOutput || !dataSensors) ? (
                <div className={classes.loading}>Loading... Please Wait Before Searching Data</div>
            ): (null)}

            <div className={classes.inputCollection}>
                <div className={classes.inputs}>
                    <div className={classes.inputParam}>
                        <div>
                            Data set
                        </div>
                        <select onChange={(e) =>setFilterDataSet(e.target.value)}>
                            <option value='Sensor Calibration Data'>Sensor Calibration Data</option>
                            <option value='Base Station Calibration Data'>Base Station Calibration Data</option>
                            <option value='Sensor Calibration Output'>Sensor Calibration Output</option>
                            <option value='Performance Validation Output'>Performance Validation Output</option>
                            <option value='All'>All Sensors</option>
                        </select>
                    </div>

                    <div className={classes.inputParam}>
                        <div>
                            Sensor Type
                        </div>

                        <select onChange={(e) =>setSensorTypeString(e.target.value)}>
                        <option value='All'>All</option>
                        <option value='thumb'>Thumb</option>
                        <option value='pointer'>Pointer</option>
                        <option value='middle'>Middle</option>
                        <option value='index'>Index</option>
                        <option value='pinky'>Pinky</option>
                        <option value='base'>Base</option>
                    </select>
                    </div>

                    <div className={classes.inputParam}>
                        <div>Type Index</div>

                        <input style={{width:'30px'}} type='text' onChange={(e) =>setSensorTypeNumber(e.target.value)}/>
                    </div>
                    <div className={classes.inputParam}>
                        <div>Base ID</div>

                        <input style={{width:'30px'}} type='text' onChange={(e) =>setBaseID(e.target.value)}/>
                    </div>

                    <div className={classes.inputParam}>
                        <div>Start Date(MM/DD/YYYY)</div>
                        <input style={{width:'80px'}} type='text' onChange={(e) =>setStartDay(e.target.value)}/>
                    </div>
                    <div className={classes.inputParam}>
                        <div>End Date(MM/DD/YYYY)</div>
                        <input style={{width:'80px'}} type='text' onChange={(e) =>setEndDay(e.target.value)}/>
                    </div>
                    <div className={classes.inputParam}>
                        <div>Algorithm Version (#.#.#)</div>
                        <input style={{width:'80px'}} type='text' onChange={(e) =>setAlgVersion(e.target.value)}/>
                    </div>
                    <div className={classes.inputParam}>
                        <div>Cali. File Index</div>
                        <input style={{width:'30px'}} type='numeric' onChange={(e) =>setCalFile(e.target.value)}/>
                    </div>
                    <div className={classes.inputParam}>
                        <div>Min Accuracy</div>
                        <input style={{width:'30px'}} type='numeric' onChange={(e) =>setAccuracy(e.target.value)}/>
                    </div>
                    <div className={classes.inputParam}>
                        <div>Min Precision</div>
                        <input style={{width:'30px'}} type='numeric' onChange={(e) =>setPrecision(e.target.value)}/>
                    </div>
                </div>

                <button className={classes.button} onClick={() => searchData()}>Search</button>
            </div>

            <div className={classes.dataTable}>
                <div className={classes.filterTitle}>Filtered Data</div>
                {filteredData.length > 0 ? (
                <div>
                    {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}
                    {dataSet === 'Sensor Calibration Data' ? (
                        filteredData.map((dataFile, index) => (
                            <div key={index} className={classes.transitionHeight}>
                                <SensorData data={dataFile}/>
                            </div>
                        ))
                    ) : (null)}
                    {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}
                    {dataSet === 'Base Station Calibration Data' ? (
                        filteredData.map((dataFile, index) => (
                            <div key={index} className={classes.transitionHeight}>
                                <BaseCalibration data={dataFile}/>
                            </div>
                        ))
                    ) : (null)}
                    {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}
                    {dataSet === 'Sensor Calibration Output' ? (
                        filteredData.map((dataFile, index) => (
                            <div key={index} className={classes.transitionHeight}>
                                <SensorOutput data={dataFile}/>
                            </div>
                        ))
                    ) : (null)}
                    {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}
                    {dataSet === 'Performance Validation Output' ? (
                        filteredData.map((dataFile, index) => (
                            <div key={index} className={classes.transitionHeight}>
                                <PerformanceOutput data={dataFile}/>
                            </div>
                        ))
                    ) : (null)}
                    {/* ////////////////////////////////////////////////////////////////////////////////////////////// */}
                    {dataSet === 'All' ? (
                        filteredData.map((dataFile, index) => (
                            <div key={index} className={classes.transitionHeight}>
                                <Sensors data={dataFile}/>
                            </div>
                        ))
                    ) : (null)}
                </div>
                ): ( null )}

            </div>
        </div>
    )
}

export default Homepage