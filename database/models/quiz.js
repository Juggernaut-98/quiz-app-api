import { Model } from 'sequelize';
import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Quiz.hasMany(models.Question, {
        foreignKey: 'quizId',
        as: 'questions',
        onDelete: 'CASCADE',
      });
    }
  }
  Quiz.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    isPublished: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Quiz',
  });
  return Quiz;
};

