// src/models/index.js

const { sequelize } = require('../config/db');
const User = require('./User');
const Conversation = require('./Conversation');
const Message = require('./Message');

User.hasMany(Conversation, { foreignKey: 'userId', onDelete: 'CASCADE' });
Conversation.belongsTo(User, { foreignKey: 'userId' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

module.exports = {
  sequelize,
  User,
  Conversation,
  Message,
};