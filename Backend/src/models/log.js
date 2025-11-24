'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Log.init({
    organisation_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    action: DataTypes.STRING,
    meta: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Log',
  });
  return Log;
};