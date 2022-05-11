// Display:       
// sensor_unique_id
// sensor_type
// accuracy
// precision
import classes from './row.module.css'

const Sensors = ({data}) => {
    return (
            <div className={classes.row}>
                <div>
                    <div>
                        Unique ID
                    </div>
                    <div>{data.sensor_unique_id}</div>

                </div>
                <div>
                    <div>
                        Sensor Type
                    </div>
                    <div>{data.sensor_type}</div>

                </div>
                <div>
                    <div>
                        Accuracy
                    </div>
                    <div>{data.accuracy}mm</div>

                </div>
                <div>
                    <div>
                        Precision
                    </div>
                    <div>{data.precision}mm</div>

                </div>
            </div>
    )
}

export default Sensors