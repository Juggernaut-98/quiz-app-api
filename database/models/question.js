'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Question.belongsTo(models.Quiz, {
        foreignKey: 'quizId',
        as: 'question',
        onDelete: 'CASCADE',
      });

      Question.hasMany(models.Option, {
        foreignKey: 'questionId',
        as: 'options',
        onDelete: 'CASCADE',
      });
    }
  }
  Question.init({
    description: DataTypes.STRING,
    isMandatory: DataTypes.BOOLEAN,
    quizId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};