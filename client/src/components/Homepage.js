import classes from './Homepage.module.css';
import { useState, useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { QUERY_SENSOR_CALIBRATION_DATA } from './utils/queries';
import { QUERY_BASE_CALIBRATION_DATA } from './utils/queries';
import { QUERY_SENSOR_CALIBRATION_OUTPUT } from './utils/queries';
import { QUERY_PERFORMANCE_VALIDATION_OUTPUT } from './utils/queries';

const Homepage = () => {
    const [sensorCalData, setSensorCalData] = useState([]);
    const [baseCalData, setBaseCalData] = useState([]);
    const [sensorCalOutput, setSensorCalOutput] = useState([]);
    const [performanceValOutput, setPerformanceValOutput] = useState([]);


    const { loading: loadSensorCalData, data: dataSensorCalData, refetch: refetchSensorCalData } = useQuery(QUERY_SENSOR_CALIBRATION_DATA);
    const { loading: loadBaseCalData, data: dataBaseCalData, refetch: refetchBaseCalData } = useQuery(QUERY_BASE_CALIBRATION_DATA);
    const { loading: loadSensorCalOutput, data: dataSensorCalOutput, refetch: refetchSensorCalOutput } = useQuery(QUERY_SENSOR_CALIBRATION_OUTPUT);
    const { loading: loadPerformanceValOutput, data: dataPerformanceValOutput, refetch: refetchPerformanceValOutput } = useQuery(QUERY_PERFORMANCE_VALIDATION_OUTPUT);

    useEffect(() => {
        if(!loadSensorCalData){
            setSensorCalData(dataSensorCalData)
            console.log(sensorCalData)
        }
    }, [loadSensorCalData])

    useEffect(() => {
        if(!loadBaseCalData){
            setBaseCalData(dataBaseCalData)
            console.log(baseCalData)
        }
    }, [loadBaseCalData])

    useEffect(() => {
        if(!loadSensorCalOutput){
            setSensorCalOutput(dataSensorCalOutput)
            console.log(sensorCalOutput)
        }
    }, [loadSensorCalOutput])

    useEffect(() => {
        if(!loadPerformanceValOutput){
            setPerformanceValOutput(dataPerformanceValOutput)
            console.log(performanceValOutput)
        }
    }, [loadPerformanceValOutput])

    return (
        <div className={classes.main}>
            This is the homepage
            <button onClick={()=>console.log(sensorCalData)}>Click Me</button>
            <button onClick={()=>console.log(baseCalData)}>Click Me</button>
            <button onClick={()=>console.log(sensorCalOutput)}>Click Me</button>
            <button onClick={()=>console.log(performanceValOutput)}>Click Me</button>



        </div>
    )
}

export default Homepage