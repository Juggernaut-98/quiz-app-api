import db from './models/index.js';
import logger from '../logger.js';


const connectDB = async () => {
    try {
        await db.sequelize.sync();

        logger.info('db connected');
    } catch (err) {
        console.error(err);

        process.exit(1);
    }
};

export default connectDB;