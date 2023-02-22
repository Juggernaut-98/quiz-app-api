'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Option.belongsTo(models.Question, {
        foreignKey: 'questionId',
        as: 'option',
        onDelete: 'CASCADE',
      });
    }
  }
  Option.init({
    value: DataTypes.STRING,
    isCorrect: DataTypes.BOOLEAN,
    questionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Option',
  });
  return Option;
};