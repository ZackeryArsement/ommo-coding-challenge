const Homepage = () => {

    const generateSensorCalibrationData = () => {
        
    }

    // populate random sensor data
    const sensorData = (dataPoints) => {
        // data is a 3 dimensional time series array
        let data = [];

        // accuracy of the sensor is typically between 0.2-1mm
        // this gives a slight chance for accuracy to be a little below or above that general region
        let accuracy = 0.1+Math.random();
        let precision = 0.05+Math.random()*0.6;        

        // give a 5% chance that a sensor can be an outlier of 5mm+ of accuracy
        // if the sensor is an outlier than change its accuracy
        if(Math.random()*100 <= 5){
            // add a value between 3-6 to the accuracy
            accuracy = accuracy + 3 + Math.random()*3
        }

        // round the accuracy and precision values to the thousands place...
        accuracy = Math.floor(accuracy*1000)/1000;
        precision = Math.floor(precision*1000)/1000;

        // get unique accuracies and precisions for each dimension
        let dimAccuracy = getAccuracy(accuracy);
        let dimPrecision = getPrecision(precision);

        for(let i=0; i<dataPoints; i++){
            // the final precision and accuracy will most likely not line up with these values but this is a rough estimate of values derived from them

            // the value can be either negative or positive from the accuracy point
            let precNeg =  Math.random() < 0.5 ? -1 : 1;

            // we set the distances for each dimension to the accuracy and then plus minus a number based on the precision value
            let x = dimAccuracy[0] + Math.random()*dimPrecision[0]*2*precNeg;

            precNeg =  Math.random() < 0.5 ? -1 : 1;
            let y = dimAccuracy[1] + Math.random()*dimPrecision[1]*2*precNeg;

            precNeg =  Math.random() < 0.5 ? -1 : 1;
            let z = dimAccuracy[2] + Math.random()*dimPrecision[2]*2*precNeg;

            data.push([x,y,z]);
        }

        // console.log(data)

        return data
    }

    const getAccuracy = (accuracy) => {
        // the distance formula is given by distance^2 = squareRoot((x2-x1)^2 + (y2-y1)^2 + (z2-z1)^2)
        // we define our accuracy as the error distance from the desired location
        // with our calibration location as (0,0,0) we can create accuracies for each dimension

        // if we manipulate the prior equation we can get (x2-x1)^2 = distance^2 - ((y2-y1)^2 + (z2-z1)^2)
        // so we give the option for (y2-y1)^2 + (z2-z1)^2 to sum to 80% of the distance^2
        // this could give instances where certain dimensions could be more/less accurate
        let zySquaredSum = Math.pow(Math.random()*accuracy, 2)

        // we start by propogating a random xAccuracy by subtracting a r
        let xAccuracy = Math.sqrt(Math.pow(accuracy, 2) - zySquaredSum);
        let yAccuracy = Math.sqrt(zySquaredSum - Math.random()*zySquaredSum)

        // finally, the accuracy for z is determined by the now established x and y accuracy
        let zAccuracy = Math.sqrt(Math.pow(accuracy, 2) - (Math.pow(xAccuracy, 2) + Math.pow(yAccuracy, 2)))

        ///////////////////////////////////////////////

        // if we log we can verify we get unique data
        // console.log(xAccuracy, yAccuracy, zAccuracy)

        // we can also check to see if the unique accuracy intialized equals the sum accuracy of the individual dimensions
        // console.log(accuracy)
        // console.log(Math.sqrt(Math.pow(xAccuracy, 2) + Math.pow(yAccuracy, 2) + Math.pow(zAccuracy, 2)))

        return [xAccuracy, yAccuracy, zAccuracy]
    }

    const getPrecision = (precision) => {
        // we perform the same action for precision
        let zySquaredSum = Math.pow(Math.random()*precision, 2)

        let xPrecision = Math.sqrt(Math.pow(precision, 2) - zySquaredSum);
        let yPrecision = Math.sqrt(zySquaredSum - Math.random()*zySquaredSum)
        let zPrecision = Math.sqrt(Math.pow(precision, 2) - (Math.pow(xPrecision, 2) + Math.pow(yPrecision, 2)))

        /////////////////////////////////////////////////

        // console.log(xPrecision, yPrecision, zPrecision)

        // console.log(precision)
        // console.log(Math.sqrt(Math.pow(xPrecision, 2) + Math.pow(yPrecision, 2) + Math.pow(zPrecision, 2)))

        return [xPrecision, yPrecision, zPrecision]
    }

    const generateBaseStationData = () => {

    }


    return (
        <div>
            This is the homepage
            <button onClick={() => sensorData(10000)}>Click Me</button>
        </div>
    )
}

export default Homepage