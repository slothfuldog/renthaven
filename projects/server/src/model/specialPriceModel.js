const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const specialPriceModel = dbSequelize.define("specialprices", {
  spId: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  //fk
  typeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nominal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  percentage: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = { specialPriceModel };
