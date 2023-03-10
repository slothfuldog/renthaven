const { categoryModel } = require("../model");

module.exports = {
  regis: async (req, res) => {
    try {
      const data = await categoryModel.create(req.body);
      return res.status(200).send({
        success: true,
        message: "New Category Added",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getData: async (req, res) => {
    try {
      const data = await categoryModel.findAll({
        order: ["province"],
      });
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
