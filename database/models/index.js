import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../config/config.js';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

const basename = path.basename(__filename);
const __dirname = path.dirname(__filename);
const db = {};

const sequelize = new Sequelize(config.url, config);

const files = fs.readdirSync(__dirname).filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1;
});

await Promise.all(
    files.map(async (file) => {
        const klass = await import(path.join(__dirname, file));
        const model = klass.default(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    }),
);


Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
