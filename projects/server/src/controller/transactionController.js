const { encryptPassword, createToken } = require("../config/encrypt");
const {
  userModel,
  transactionModel,
  orderListModel,
  roomAvailModel,
  specialPriceModel,
  tenantModel,
} = require("../model");
const bcrypt = require("bcrypt");
const { transport } = require("../config/nodemailer");
const { dbSequelize } = require("../config/db");
const { QueryTypes, Op } = require("sequelize");
const { format, addHours, addDays } = require("date-fns");
const cron = require("cron");
const moment = require("moment-timezone");
module.exports = {
  getNecessaryData: async (req, res) => {
    try {
      //get neccessary data for transaction page
      console.log(new Date(req.body.startDate), new Date(req.body.endDate));
      const data = await dbSequelize.query(
        `select p.image, t.typeImg, p.name, t.name as typeName, t.capacity, pay.bankId, pay.bankName, pay.bankLogo, ten.bankAccountNum as accountNum, t.price, (SELECT sp.nominal from specialprices as sp where sp.typeId = t.typeId 
        AND (${dbSequelize.escape(
          new Date(req.body.startDate)
        )} BETWEEN sp.startDate AND sp.endDate) AND (${dbSequelize.escape(
          new Date(req.body.endDate)
        )} BETWEEN sp.startDate AND sp.endDate)) as nominal from properties as p INNER JOIN rooms as r on p.propertyId = r.propertyId
            INNER JOIN types as t on r.typeId = t.typeId INNER JOIN tenants as ten on p.tenantId = ten.tenantId INNER JOIN paymentmethods as pay on ten.bankId = pay.bankId where p.propertyId = ${
              req.query.id
            } and t.typeId = ${req.body.typeId}`,
        {
          type: QueryTypes.SELECT,
        }
      );
      // const data1 = await specialPriceModel.findAll()
      return res.status(200).send({
        success: true,
        result: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Database Error",
      });
    }
  },
  createTransaction: async (req, res) => {
    try {
      const {
        specialReq,
        totalGuest,
        checkinDate,
        checkoutDate,
        price,
        bankId,
        bankAccountNum,
        propertyId,
        typeId,
      } = req.body;
      const { userId } = req.decrypt;
      //check available rooms with selected property
      const data = await dbSequelize.query(
        `
        SELECT * from rooms as r WHERE r.propertyId = ${propertyId} AND r.typeId = ${typeId} AND
        r.roomId NOT IN (
          SELECT ra.roomId 
          FROM roomavailabilities AS ra
          WHERE 
          ra.startDate >= ${dbSequelize.escape(new Date(checkinDate))}
          AND ra.endDate <= ${dbSequelize.escape(new Date(checkoutDate))}
          )
        `,
        {
          type: QueryTypes.SELECT,
        }
      );
      if (data.length < 1) {
        return res.status(401).send({
          success: false,
          message: "The room has already been booked",
        });
      }
      //randomly take 1 of available rooms in current property
      let randomRoomId = Math.floor(Math.random() * data.length);
      const createTransactions = await dbSequelize.query(
        `INSERT INTO transactions (userId, specialReq, totalGuest, checkinDate, checkoutDate, bankId, bankAccountNum, transactionExpired, createdAt, updatedAt)
      VALUES (${dbSequelize.escape(userId)}, ${dbSequelize.escape(
          specialReq
        )}, ${dbSequelize.escape(totalGuest)}, ${dbSequelize.escape(
          new Date(checkinDate)
        )}, ${dbSequelize.escape(new Date(checkoutDate))}, ${dbSequelize.escape(
          bankId
        )}, ${dbSequelize.escape(bankAccountNum)}, ${dbSequelize.escape(
          new Date(format(addHours(new Date(), 2), "yyyy-MM-dd HH:mm:ss"))
        )}, ${dbSequelize.escape(new Date(checkinDate))}, ${dbSequelize.escape(
          new Date(checkinDate)
        )})`,
        {
          type: QueryTypes.INSERT,
        }
      );
      console.log(createTransactions);
      const trans = await transactionModel.findAll({
        where: {
          [Op.and]: [
            {
              userId,
              checkinDate: new Date(checkinDate),
              checkoutDate: new Date(checkoutDate),
            },
          ],
        },
      });
      const transactionId = trans[trans.length - 1].transactionId;
      const data1 = await orderListModel.create({
        transactionId,
        roomId: data[randomRoomId].roomId,
        price,
      });
      const data2 = await roomAvailModel.create({
        roomId: data[randomRoomId].roomId,
        startDate: new Date(checkinDate),
        endDate: new Date(checkoutDate),
      });
      res.status(200).send({
        success: true,
        result: transactionId,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "database error",
      });
    }
  },
  getBankData: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      const transaction = await transactionModel.findAll({
        where: {
          [Op.and]: [
            {
              userId: user[0].userId,
              transactionId: req.query.id,
            },
          ],
        },
      });
      //get data if the status cancelled or less than transactionExpired
      if (transaction.length > 0 && transaction[0].status !== "Cancelled") {
        const data = await dbSequelize.query(
          `SELECT o.price, t.status, t.payProofImg, t.bankId, t.transactionExpired, t.checkinDate, pay.bankName, t.bankAccountNum
        FROM orderlists AS o
        INNER JOIN transactions AS t ON o.transactionId = t.transactionId
        INNER JOIN paymentmethods as pay ON t.bankId = pay.bankId
        WHERE t.transactionId = ${req.query.id}
        `,
          {
            type: QueryTypes.SELECT,
          }
        );
        return res.status(200).send({
          success: true,
          result: data,
        });
      } else if (transaction.length > 0 && transaction[0].status == "Cancelled") {
        return res.status(404).send({
          success: false,
          message: "Transaction Expired",
        });
      } else {
        return res.status(401).send({
          success: false,
          message: "Not Authorized",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database error",
      });
    }
  },
  uploadProof: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          userId: req.decrypt.userId,
        },
      });
      const order = await orderListModel.findAll({
        where: {
          transactionId: req.body.transactionId,
        },
      });
      if (user.length > 0) {
        const data = await transactionModel.update(
          {
            payProofImg: `/proofImg/${req.files[0].filename}`,
            status: "Waiting for confirmation",
          },
          {
            where: {
              transactionId: req.body.transactionId,
            },
          }
        );
        const transactions = await transactionModel.findAll({
          where: {
            transactionId: req.body.transactionId,
          },
        });
        res.status(200).send({
          success: true,
          message: "Proof Payment Image Uploaded",
        });
      } else {
        return res.status(401).send({
          success: false,
          message: "You are not allowed to do this transaction",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database error.",
      });
    }
  },
  changeStatus: () => {
    //create the job and filter which data to be updated
    const job = new cron.CronJob("*/5 * * * * *", async function () {
      const transactions = await dbSequelize.query(
        `
      SELECT * from transactions where status = "Waiting for payment"
      GROUP BY transactionId`,
        { type: QueryTypes.SELECT }
      );
      // const transactions = await transactionModel.findAll({
      //   where: {
      //     status: "Waiting for payment",
      //   }, group: "transactionId", type: QueryTypes.SELECT
      // });
      const checkIn = transactions.map((val) => {
        return `ra.startDate = ${dbSequelize.escape(new Date(val.checkinDate))}`;
      });
      const checkout = transactions.map((val) => {
        return `ra.endDate = ${dbSequelize.escape(new Date(val.checkoutDate))}`;
      });

      const orderLists = transactions.map((val) => {
        return { transactionId: val.transactionId };
      });
      const getOrderLists = await orderListModel.findAll({
        where: {
          [Op.or]: orderLists,
        },
      });
      const roomAvail = getOrderLists.map((val, idx) => {
        return `ra.roomId = ${dbSequelize.escape(val.roomId)}`;
      });
      const filteredRoom = roomAvail.filter((val, index, self) => {
        return index === self.findIndex((t) => t.typeId === val.typeId);
      });
      const room = getOrderLists.map((val, idx) => {
        return `roomId = ${dbSequelize.escape(val.roomId)}`;
      });
      const getRoom = room.join(" OR ");
      const rooms = roomAvail.join(" OR ");
      const times = checkIn.map((val, idx) => {
        return `(${checkIn[idx]})`;
      });
      const getTimes = times.join(" OR ");

      const getRooms =
        getRoom.length > 0
          ? await dbSequelize.query(
              `
        SELECT * FROM rooms ${getRoom.length > 0 ? "WHERE" : ""} ${getRoom}
      `,
              { type: QueryTypes.SELECT }
            )
          : [];
      const type =
        getRooms.length > 0
          ? getRooms.map((val) => {
              return `typeId = ${val.typeId}`;
            })
          : [];
      const getTypes = type != null ? type.join(" OR ") : null;
      const getType =
        type.length > 0
          ? await dbSequelize.query(
              `
          SELECT * FROM types ${type.length > 0 || type != null ? "WHERE" : ""} ${getTypes}
          `,
              { type: QueryTypes.SELECT }
            )
          : [];

      const getRoomAvail = await dbSequelize.query(
        `
        SELECT * FROM roomavailabilities AS ra 
        INNER JOIN orderlists as o ON ra.roomId = o.roomId
        INNER JOIN transactions as t ON o.transactionId = t.transactionId
        WHERE t.status = 'Waiting for payment' ${
          rooms.length > 0 ? `AND (${rooms}) AND ${getTimes}` : ""
        }
        group by ra.raId
      `,
        { type: QueryTypes.SELECT }
      );
      const getTime =
        getType.length > 0
          ? getType.map((val) => {
              const currentCreatedAt = new Date(val.createdAt).setFullYear(
                new Date(val.createdAt).getFullYear() - 1
              );
              const currentYear = new Date(currentCreatedAt);
              return `SET startDate = ${dbSequelize.escape(
                currentYear
              )}, endDate = ${dbSequelize.escape(currentYear)}`;
            })
          : null;
      console.log("Current Database Time", new Date());
      // update the status
      transactions.map(async (val, index) => {
        const transactionExpired = moment(val.transactionExpired);
        const now = moment();
        const currentCreatedAt = new Date(val.checkinDate).setFullYear(
          new Date(val.checkinDate).getFullYear() - 1
        );
        const currentYear = new Date(currentCreatedAt);
        if (new Date().getTime() > new Date(val.transactionExpired).getTime()) {
          await dbSequelize.query(
            `UPDATE transactions SET status = "Cancelled" WHERE transactionId = ${val.transactionId}`
          );
          if (getRoomAvail.length > 0) {
            getRoomAvail.map(async (value, idx) => {
              await dbSequelize.query(`UPDATE roomavailabilities ${getTime[idx]}
              WHERE raId = ${value.raId}`);
            });
          }
        }
      });
    });
    job.start();
  },
};
