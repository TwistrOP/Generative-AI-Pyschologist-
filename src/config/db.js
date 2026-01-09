// src/config/db.js
const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

if (process.env.NODE_ENV === 'production' && process.env.INSTANCE_CONNECTION_NAME) {
    const dbUser = process.env.DB_USER; 
    const dbPass = process.env.DB_PASSWORD;  
    const dbName = process.env.DB_NAME;  
    const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME;  
    const dbSocketPath = `/cloudsql/${instanceConnectionName}`;

    sequelize = new Sequelize(dbName, dbUser, dbPass, {
        dialect: 'postgres',  
        host: dbSocketPath,
        dialectOptions: {
            socketPath: dbSocketPath,
        },
        logging: false,
    });
} else {
    console.log('Running in development mode, using SQLite.');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', '..', 'database.sqlite')
    });
}

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);  
    }
};

module.exports = { connectDB, sequelize };