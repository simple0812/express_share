var db = require("./db");
var Sequelize = require("sequelize");
var common = require("../utils/common");

class Blog extends Sequelize.Model {}

Blog.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(100),
    },
    summary: {
      type: Sequelize.TEXT,
    },
    content: {
      type: Sequelize.TEXT,
    },
    remark: {
      type: Sequelize.TEXT,
    },
    author: {
      type: Sequelize.STRING(100),
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    createdAt: {
      type: Sequelize.BIGINT(13),
      allowNull: false,
      defaultValue: () => {
        return Date.now()
      }
    },
  },
  {
    sequelize:db,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    tableName: "blog",
  }
);

module.exports = Blog;
