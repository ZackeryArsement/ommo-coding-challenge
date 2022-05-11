const db = require('../config/connection');
const { Sensor, SensorCalData, SensorCalOutput, BaseCalData, PerformanceValOutput } = require('../models');

let sensorIdMap = {
  'thumb': 0,
  'pointer': 0,
  'middle': 0,
  'index': 0,
  'pinky': 0,
  'base': 0
}

// populate random sensor data
const sensorData = (dataPoints) => {
    const getAccuracy = (acc) => {
      // the distance formula is given by distance^2 = squareRoot((x2-x1)^2 + (y2-y1)^2 + (z2-z1)^2)
      // we define our accuracy as the error distance from the desired location
      // with our calibration location as (0,0,0) we can create accuracies for each dimension

      // if we manipulate the prior equation we can get (x2-x1)^2 = distance^2 - ((y2-y1)^2 + (z2-z1)^2)
      // so we give the option for (y2-y1)^2 + (z2-z1)^2 to sum to 80% of the distance^2
      // this could give instances where certain dimensions could be more/less accurate
      let zySquaredSum = Math.pow(Math.random()*acc, 2)

      // we start by propogating a random xAccuracy by subtracting a r
      let xAccuracy = Math.sqrt(Math.pow(acc, 2) - zySquaredSum);
      let yAccuracy = Math.sqrt(zySquaredSum - Math.random()*zySquaredSum)

      // finally, the accuracy for z is determined by the now established x and y accuracy
      let zAccuracy = Math.sqrt(Math.pow(acc, 2) - (Math.pow(xAccuracy, 2) + Math.pow(yAccuracy, 2)))

      ///////////////////////////////////////////////

      // if we log we can verify we get unique data
      // console.log(xAccuracy, yAccuracy, zAccuracy)

      // we can also check to see if the unique accuracy intialized equals the sum accuracy of the individual dimensions
      // console.log(acc)
      // console.log(Math.sqrt(Math.pow(xAccuracy, 2) + Math.pow(yAccuracy, 2) + Math.pow(zAccuracy, 2)))

      return [xAccuracy, yAccuracy, zAccuracy]
    }

    const getPrecision = (prec) => {
        // we perform the same action for precision
        let zySquaredSum = Math.pow(Math.random()*prec, 2)

        let xPrecision = Math.sqrt(Math.pow(prec, 2) - zySquaredSum);
        let yPrecision = Math.sqrt(zySquaredSum - Math.random()*zySquaredSum)
        let zPrecision = Math.sqrt(Math.pow(prec, 2) - (Math.pow(xPrecision, 2) + Math.pow(yPrecision, 2)))

        /////////////////////////////////////////////////

        // console.log(xPrecision, yPrecision, zPrecision)

        // console.log(prec)
        // console.log(Math.sqrt(Math.pow(xPrecision, 2) + Math.pow(yPrecision, 2) + Math.pow(zPrecision, 2)))

        return [xPrecision, yPrecision, zPrecision]
    }

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
        x = Math.round(x*1000)/1000;

        precNeg =  Math.random() < 0.5 ? -1 : 1;
        let y = dimAccuracy[1] + Math.random()*dimPrecision[1]*2*precNeg;
        y = Math.round(x*1000)/1000;

        precNeg =  Math.random() < 0.5 ? -1 : 1;
        let z = dimAccuracy[2] + Math.random()*dimPrecision[2]*2*precNeg;
        z = Math.round(x*1000)/1000;

        data.push(`${x},${y},${z}`);
    }



    // console.log(data)
    let calibrationParamters = [`${0},${0},${0}:${dimAccuracy[0]},${dimAccuracy[1]},${dimAccuracy[2]}:${accuracy},${precision},${1000}`]

    return [data, accuracy, precision, calibrationParamters]
}

// server crashes when seeding... have to implement pauses to reduce serge
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

db.once('open', async () => {
  try {
    await Sensor.deleteMany({});
    await SensorCalData.deleteMany({});
    await BaseCalData.deleteMany({});
    await SensorCalOutput.deleteMany({});
    await PerformanceValOutput.deleteMany({});

    // create an array of non-base sensors that we will later pull from for our sensor calibration data
    let nonBaseSensor = [];
    let baseSensorArray = [];

    let sensorCalDataArray = [];
    let baseCalDataArray = [];

    // we will create 200 non-base sensors... these will be pulled into the sensor calibration data
    for(let i=0; i<200; i++){
      let data = sensorData(10000);

      let sensorType = Object.keys(sensorIdMap)[Math.floor(Math.random()*(Object.keys(sensorIdMap).length-1))];
      sensorIdMap[sensorType] = sensorIdMap[sensorType] + 1 || 1

      let sensorNumb = sensorIdMap[sensorType];
      let sensorId = sensorType + "-" + sensorNumb;
  
      const sensor = await Sensor.create({
        sensor_unique_id: i,
        sensor_type: sensorId,
        sensor_data: data[0],
        accuracy: data[1],
        precision: data[2],
        calibration_parameters: data[3]
      });
      sleep(100)

      nonBaseSensor.push(sensor);
    }

    // we will create 55 sensor calibration data points
    for(let i=0; i<55; i++){
      let randomDate = new Date(new Date(2012, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2012, 0, 1).getTime()));
      let sensorArray = [];

      // every sensor calibration file will have a minimum of four sensor data points
      for(let index=0; index<4; index++){
        sensorArray.push(nonBaseSensor[(i*4)+index])
      }

      // there is a chance to gain an additional 8 sensor data points in this calibration file
      for(let i=0; i<Math.floor(Math.random()*8); i++){
        sensorArray.push(nonBaseSensor[Math.floor(Math.random()*200)])
      }

      let sensorCalData = await SensorCalData.create({
        file_name: `calibration-${i}`,
        calibration_date: randomDate,
        sensors: sensorArray
      })
      sleep(100)


      sensorCalDataArray.push(sensorCalData);
    }

    // we will create a minimum of 20 sets of base calibration data files
    for(let i=0; i<20; i++){
      let baseStationUniqueId = i+1;
      let baseSensor = [];

      let sensorType = 'base';
      sensorIdMap[sensorType] = sensorIdMap[sensorType] + 1 || 1

      // 66% of the bases will only have 1 calibration data file assigned to them
      if(Math.floor(Math.random()*100)<66){
        let randomDate = new Date(new Date(2012, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2012, 0, 1).getTime()));

        for(let index=0; index<3; index++){
          let data = sensorData(100000);
  
          let sensorNumb = sensorIdMap[sensorType];
          let sensorId = sensorType + "-" + sensorNumb;
      
          const sensor = await Sensor.create({
            sensor_unique_id: (i*3)+index+1,
            sensor_type: sensorId,
            sensor_data: data[0],
            accuracy: data[1],
            precision: data[2],
            calibration_parameters: data[3]
          });
          sleep(100)

    
          baseSensor.push(sensor);
          baseSensorArray.push(sensor);
        }
  
        let baseCalData = await BaseCalData.create({
          calibration_date: randomDate,
          base_station_unique_id: baseStationUniqueId,
          sensors: baseSensor
        })
        sleep(100)


        baseCalDataArray.push(baseCalData);
      } 
      // the other 33% of the base calibrations could have multiple data files from different times
      else {
        for(let ind=0; ind<Math.floor(Math.random()*3); ind++){
          let randomDate = new Date(new Date(2012, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2012, 0, 1).getTime()));

          for(let index=0; index<3; index++){
            let data = sensorData(100000);
  
            let sensorNumb = sensorIdMap[sensorType];
            let sensorId = sensorType + "-" + sensorNumb;
        
            const sensor = await Sensor.create({
              sensor_unique_id: i+index+1,
              sensor_type: sensorId,
              sensor_data: data[0],
              accuracy: data[1],
              precision: data[2],
              calibration_parameters: data[3]
            });
            sleep(100)
      
            baseSensor.push(sensor);
          }
    
          let baseCalData = await BaseCalData.create({
            calibration_date: randomDate,
            base_station_unique_id: baseStationUniqueId,
            sensors: baseSensor
          })
          sleep(100)

          baseCalDataArray.push(baseCalData);

          baseSensor = []
        }

      }

    }

    ///////////////////////////////////////
    // Output Data

    // we will create sensor calibration output data using 80% of the sensor calibration
    for(let i=0; i<Math.ceil(sensorCalDataArray.length*0.8); i++){
      let calibrationName = sensorCalDataArray[i].file_name;

      // create a random date between now and when the calibration data was created
      let randomDate = new Date(sensorCalDataArray[i].calibration_date.getTime() + Math.random() * (new Date() - sensorCalDataArray[i].calibration_date.getTime()));
      
      let sensorsUsed = [];

      for(let index=0; index<sensorCalDataArray[i].sensors.length; index++){
        sensorsUsed.push(sensorCalDataArray[i].sensors[index])
      }

      // 75% of sensor calibration output data only uses 1 algorithm_version
      if(Math.floor(Math.random()*100) < 75){
        let sensorCalOutput = await SensorCalOutput.create({
          calibration_file: calibrationName,
          generation_date: randomDate,
          algorithm_version: `${Math.floor(Math.random())+1}.${Math.floor(Math.random()*3)}.${Math.floor(Math.random()*5)}`,
          sensors: sensorsUsed
        })
        sleep(100)
      }
      // the remainder 25% use up to 4 algorithm versions
      else{
        for(let index=0; index<(Math.floor(Math.random()*3)+1); index++){
          randomDate = new Date(sensorCalDataArray[i].calibration_date.getTime() + Math.random() * (new Date() - sensorCalDataArray[i].calibration_date.getTime()));

          let sensorCalOutput = await SensorCalOutput.create({
            calibration_file: calibrationName,
            generation_date: randomDate,
            algorithm_version: `${Math.floor(Math.random())+1}.${Math.floor(Math.random()*3)}.${Math.floor(Math.random()*5)}`,
            sensors: sensorsUsed
          })
          sleep(100)

        }
      }
    }

    // we will create 55 performance validation outputs
    for(let i=0; i<55; i++){
      let currentBaseStation = baseSensorArray[Math.floor(Math.random()*baseSensorArray.length)];
      let baseId = currentBaseStation.sensor_type.split('-')[1];
      let randomDate = new Date(new Date(2022, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2022, 0, 1).getTime()));

      let comboSensors = [];

      // there can be up to 8 sensors in combination to the base sensor and a minimum of 3 additional sensors
      for(let sensorCount=0; sensorCount<(Math.floor(Math.random()*3)+5); sensorCount++){
        let currentSensor = nonBaseSensor[Math.floor(Math.random()*200)];

        comboSensors.push(currentSensor);
      }

      let performanceValOutput = await PerformanceValOutput.create({
        validation_date: randomDate,
        algorithm_version: `${Math.floor(Math.random())+1}.${Math.floor(Math.random()*3)}.${Math.floor(Math.random()*5)}`,
        base_station_unique_id: baseId,
        sensors: comboSensors
      })
      sleep(100)

      comboSensors = [];
    }

  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});

