// src/models/Message.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Message = sequelize.define('Message', {
    sender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    emotionData: {
        type: DataTypes.JSON,
        allowNull: true,
    }
}, {
    timestamps: true,  
});

module.exports = Message;