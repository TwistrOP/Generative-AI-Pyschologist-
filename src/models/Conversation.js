// src/models/Conversation.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Conversation = sequelize.define('Conversation', {
}, {
    timestamps: true,
});

module.exports = Conversation;