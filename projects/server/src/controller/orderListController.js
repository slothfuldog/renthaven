const {
  orderListModel,
  transactionModel,
  roomModel,
  propertyModel,
  userModel,
  typeModel,
  roomAvailModel,
  tenantModel,
} = require("../model");
const { Op, QueryTypes } = require("sequelize");
const { format, differenceInDays } = require("date-fns");
const schedule = require("node-schedule");
const { transport } = require("../config/nodemailer");
const { dbSequelize } = require("../config/db");

//ubah status setiap jam 2 pagi
schedule.scheduleJob("0 2 * * *", async () => {
  const today = new Date();
  const checkStatus = await orderListModel.findAll({
    include: [
      {
        model: transactionModel,
        as: "transaction",
        require: "true",
        where: {
          [Op.and]: [{ checkinDate: { [Op.lte]: today } }, { status: "Waiting for confirmation" }],
        },
      },
      {
        model: roomModel,
        as: "room",
        required: true,
        include: {
          model: propertyModel,
          as: "property",
          required: true,
        },
      },
    ],
  });

  checkStatus.forEach(async (val) => {
    const {
      transaction: { checkinDate },
      roomId,
    } = val;
    const tenantId = val.room.property.tenantId;
    const tenant = await tenantModel.findOne({
      where: {
        tenantId,
      },
    });

    const currentCreatedAt = new Date(tenant.createdAt).setFullYear(
      new Date(tenant.createdAt).getFullYear() - 1
    );
    const currentYear = new Date(currentCreatedAt);
    const updateRoomAvail = await roomAvailModel.update(
      { startDate: currentYear, endDate: currentYear },
      {
        where: { [Op.and]: [{ roomId }, { startDate: { [Op.eq]: new Date(checkinDate) } }] },
      }
    );
  });

  const updateStatus = await transactionModel.update(
    {
      status: "Cancelled",
    },
    {
      where: {
        [Op.and]: [{ checkinDate: { [Op.lte]: today } }, { status: "Waiting for confirmation" }],
      },
    }
  );
});

//untuk kirim email setiap jam 8 pagi
schedule.scheduleJob("0 8 * * *", async () => {
  const today = new Date();
  const data = await orderListModel.findAll({
    include: [
      {
        model: roomModel,
        as: "room",
        required: true,
        include: {
          model: propertyModel,
          as: "property",
          required: true,
        },
      },
      {
        model: transactionModel,
        as: "transaction",
        required: true,
        where: { [Op.and]: [{ status: "Confirmed" }, { emailSent: false }] },
        include: {
          model: userModel,
          as: "user",
          required: true,
        },
      },
    ],
  });
  data.forEach(async (val) => {
    const checkIn = new Date(val.transaction.checkinDate);
    if (differenceInDays(new Date(checkIn), today) === 1) {
      const emailContent = `<div>
      <span style="font-family: Arial, Helvetica, sans-serif">
        <div style="display: flex; align-items: center">
          <img width="100px" height="100px" src="cid:logo" />
          <h1>Renthaven</h1>
        </div>
        <br />
        <p>Dear, ${val.transaction.user.name}</p>
        <p>We would like to remind you about your booking:</p>
        <div style="padding: 12px; padding-left: 22px">
            <table>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Check in Date:</td>
                <td style="padding-bottom: 20px; padding-right: 76px">
                ${format(checkIn, "MMM dd, yyyy")}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Place:</td>
                <td style="padding-bottom: 20px; padding-right: 76px">
                ${val.room.property.name}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Address:</td>
                <td style="padding-bottom: 20px; padding-right: 76px">${
                  val.room.property.address
                }</td>
              </tr>
            </table>
          </div>
        <br />
        <p>If you have any questions please don't hesitate to contact us.</p>
        <p>We hope you enjoy your stay!</p>
        <br />
        <p>Best Regards,</p>
        <br />
        <p>Renthaven</p>
      </span>
    </div>`;
      const updateEmail = await transactionModel.update(
        {
          emailSent: true,
        },
        {
          where: { transactionId: val.transaction.transactionId },
        }
      );

      transport.sendMail(
        {
          from: "Renthaven Admin",
          to: val.transaction.user.email,
          subject: "Check-in Reminder",
          html: emailContent,
          attachments: [
            {
              filename: "logo.png",
              path: "./src/public/email/logo.png",
              cid: "logo",
            },
          ],
        },
        (error, info) => {
          if (error) {
            return res.status(500).send(error);
          }
        }
      );
    }
  });
});

module.exports = {
  getData: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 5;
      const offset = limit * page;
      const status = req.query.status ? { status: req.query.status } : null;
      const filterProperty = [{ tenantId: req.query.tenant }];
      if (req.query.property) {
        filterProperty.push({ name: { [Op.like]: "%" + req.query.property + "%" } });
      }
      const filterOrderId = req.query.orderId ? { orderId: req.query.orderId } : null;
      const data = await orderListModel.findAndCountAll({
        include: [
          {
            model: transactionModel,
            as: "transaction",
            required: true,
            include: {
              model: userModel,
              as: "user",
              required: true,
            },
            where: status,
          },
          {
            model: roomModel,
            as: "room",
            required: true,
            include: [
              {
                model: propertyModel,
                as: "property",
                required: true,
                where: { [Op.and]: filterProperty },
              },
              {
                model: typeModel,
                as: "type",
                required: true,
              },
            ],
          },
        ],
        where: filterOrderId,
        order: [["transaction", "status", "DESC"]],
        offset: offset,
        limit: limit,
      });
      const totalPage = Math.ceil(data.count / limit);
      if (data.count > 0) {
        return res.status(200).send({
          data: data.rows,
          page,
          limit,
          totalRows: data.count,
          totalPage,
        });
      } else {
        return res.status(404).send({
          message: `Data Not Found`,
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  update: async (req, res) => {
    try {
      const { status, transactionId, roomId } = req.body;
      if (status === "Confirmed") {
        const data = await orderListModel.findAll({
          include: [
            {
              model: transactionModel,
              as: "transaction",
              required: true,
              include: {
                model: userModel,
                as: "user",
                required: true,
              },
            },
            {
              model: roomModel,
              as: "room",
              required: true,
              include: [
                {
                  model: propertyModel,
                  as: "property",
                  required: true,
                },
                {
                  model: typeModel,
                  as: "type",
                  required: true,
                },
              ],
            },
          ],
          where: { transactionId },
        });
        const today = new Date();
        const { transaction, room } = data[0];
        const { user } = transaction;
        const { property, type } = room;
        const checkIn = new Date(transaction.checkinDate);
        const checkOut = new Date(transaction.checkoutDate);
        const numGuest = transaction.totalGuest;
        const userEmail = user.email;
        const userName = user.name;
        const price = data[0].price;
        const propertyName = property.name;
        const address = property.address;
        const roomName = type.name;

        const emailContent = `<div>
        <span style="font-family: Arial, Helvetica, sans-serif">
          <div style="display: flex; align-items: center">
            <img width="100px" height="100px" src="cid:logo" />
            <h1>Renthaven</h1>
          </div>
          <br />
          <p>Dear, ${userName}</p>
          <p>Thank you for booking your stay with Renthaven. We are looking forward to your visit.</p>
          <p>Your booking details are as follows:</p>
          <div style="padding: 12px; padding-left: 22px">
            <table>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Property</td>
                <td style="padding-bottom: 20px; padding-right: 76px">
                  ${propertyName}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Address</td>
                <td style="padding-bottom: 20px; padding-right: 76px">
                  ${address}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Check In</td>
                <td style="padding-bottom: 20px; padding-right: 76px; font-weight: bold">${format(
                  checkIn,
                  "MMM dd, yyyy"
                )}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Check Out</td>
                <td style="padding-bottom: 20px; padding-right: 76px; font-weight: bold">
                  ${format(checkOut, "MMM dd, yyyy")}
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Room</td>
                <td style="padding-bottom: 20px; padding-right: 76px">${roomName}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px"># of Guest</td>
                <td style="padding-bottom: 20px; padding-right: 76px">${numGuest}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 20px; padding-right: 76px">Booked by</td>
                <td style="padding-bottom: 20px; padding-right: 76px">${userName}</td>
              </tr>
              <tr>
                <td style="padding-right: 76px">Total</td>
                <td style="padding-right: 76px; font-weight: bold">Rp. ${parseInt(
                  price
                ).toLocaleString("id")}</td>
              </tr>
            </table>
          </div>
          <br />
          <p>If you have any questions please don't hesitate to contact us.</p>
          <p>We hope you enjoy your stay!</p>
          <br />
          <p>Best Regards,</p>
          <br />
          <p>Renthaven</p>
        </span>
      </div>`;

        const update = await transactionModel.update(
          {
            status,
          },
          {
            where: { transactionId },
          }
        );
        if (update) {
          transport.sendMail(
            {
              from: "Renthaven Admin",
              to: userEmail,
              subject: "Booking Confirmed",
              html: emailContent,
              attachments: [
                {
                  filename: "logo.png",
                  path: "./src/public/email/logo.png",
                  cid: "logo",
                },
              ],
            },
            (error, info) => {
              if (error) {
                return res.status(500).send(error);
              }
            }
          );

          if (differenceInDays(new Date(checkIn), today) <= 1) {
            const emailh1 = `
            <div>
              <span style="font-family: Arial, Helvetica, sans-serif">
                <div style="display: flex; align-items: center">
                  <img width="100px" height="100px" src="cid:logo" />
                  <h1>Renthaven</h1>
                </div>
                <br />
                <p>Dear, ${userName}</p>
                <p>We would like to remind you about your booking:</p>
                <div style="padding: 12px; padding-left: 22px">
                    <table>
                      <tr>
                        <td style="padding-bottom: 20px; padding-right: 76px">Check in Date:</td>
                        <td style="padding-bottom: 20px; padding-right: 76px">
                        ${format(checkIn, "MMM dd, yyyy")}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 20px; padding-right: 76px">Place:</td>
                        <td style="padding-bottom: 20px; padding-right: 76px">
                        ${propertyName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 20px; padding-right: 76px">Address:</td>
                        <td style="padding-bottom: 20px; padding-right: 76px">${address}</td>
                      </tr>
                    </table>
                  </div>
                <br />
                <p>If you have any questions please don't hesitate to contact us.</p>
                <p>We hope you enjoy your stay!</p>
                <br />
                <p>Best Regards,</p>
                <br />
                <p>Renthaven</p>
              </span>
            </div>`;
            const updateEmail = await transactionModel.update(
              {
                emailSent: true,
              },
              {
                where: { transactionId },
              }
            );
            transport.sendMail(
              {
                from: "Renthaven Admin",
                to: userEmail,
                subject: "Check-in Reminder",
                html: emailh1,
                attachments: [
                  {
                    filename: "logo.png",
                    path: "./src/public/email/logo.png",
                    cid: "logo",
                  },
                ],
              },
              (error, info) => {
                if (error) {
                  return res.status(500).send(error);
                }
              }
            );
          }

          return res.status(200).send({
            success: true,
            message: `Order has been updated`,
          });
        }
      } else if (status === "Waiting for payment") {
        const expired = new Date();
        expired.setHours(expired.getHours() + 2);
        const roomAvailData = await roomAvailModel.findAll({
          where: { roomId },
        });
        const updateRoom = await roomAvailModel.update(
          {
            endDate: roomAvailData[0].startDate,
          },
          {
            where: { roomId },
          }
        );
        const update = await transactionModel.update(
          {
            status,
            transactionExpired: expired,
          },
          {
            where: { transactionId },
          }
        );
        if (update) {
          return res.status(200).send({
            success: true,
            message: `Order has been updated`,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  cancelTenant: async (req, res) => {
    try {
      const transaction = await transactionModel.findAll({
        where: {
          transactionId: req.body.transactionId,
        },
      });
      const cancel = await transactionModel.update(
        {
          status: "Cancelled",
        },
        {
          where: {
            [Op.and]: [{ transactionId: req.body.transactionId, status: "Waiting for payment" }],
          },
        }
      );

      const orderList = await orderListModel.findAll({
        where: {
          transactionId: req.body.transactionId,
        },
      });
      const roomAvail = await roomAvailModel.findAll({
        where: {
          [Op.and]: [{ roomId: orderList[0].roomId, startDate: transaction[0].checkinDate }],
        },
      });
      const rooms = await roomModel.findAll({
        where: {
          roomId: orderList[0].roomId,
        },
      });
      const types = await typeModel.findAll({
        where: {
          typeId: rooms[0].typeId,
        },
      });
      const currentCreatedAt = new Date(types[0].createdAt).setFullYear(
        new Date(types[0].createdAt).getFullYear() - 1
      );
      const currentYear = new Date(currentCreatedAt);
      const updateRa = await roomAvailModel.update(
        {
          startDate: currentYear,
          endDate: currentYear,
        },
        {
          where: {
            raId: roomAvail[0].raId,
          },
        }
      );
      return res.status(200).send({
        success: true,
        message: "The transaction has been cancelled",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database error",
      });
    }
  },
  getTenantLineChart: async (req, res) => {
    try {
      const today = new Date().getDay();
      const startDateDiff = today == 0 || today == 1 ? today : 1 - today;
      const endDateDiff = 7 - today;
      const startDate = new Date(
        new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 86400000 * startDateDiff
      ).getTime();
      const endDate = new Date(
        new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 86400000 * endDateDiff
      ).getTime();
      const filterData = [
        {
          startDate: {
            [Op.and]: { [Op.gte]: startDate },
          },
        },
        {
          endDate: {
            [Op.lte]: endDate,
          },
        },
      ];
      const data = await dbSequelize.query(
        `
        SELECT DATE(o.createdAt) as orderDate, SUM(o.price) as price FROM orderlists as o
        INNER JOIN transactions as tran ON o.transactionId = tran.transactionId
        INNER JOIN rooms as r ON r.roomId = o.roomId
        INNER JOIN properties as p ON r.propertyId = p.propertyId
        INNER JOIN tenants as ten ON ten.tenantId = p.tenantId
        INNER JOIN users as u ON u.userId = ten.userId
        WHERE u.email = ${dbSequelize.escape(
          req.decrypt.email
        )} AND ((tran.createdAt >= ${dbSequelize.escape(
          new Date(startDate)
        )}) AND (tran.createdAt <= ${dbSequelize.escape(new Date(endDate))}))
        AND tran.status = "Confirmed"
        group by orderDate; 
      `,
        { type: QueryTypes.SELECT }
      );
      return res.status(200).send({
        success: true,
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Database Error.",
      });
    }
  },
  getDataForChart: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (req.query.type === "property") {
        const filterData = [];
        if (startDate) {
          filterData.push({
            createdAt: {
              [Op.gte]: startDate,
            },
          });
        }
        if (endDate) {
          filterData.push({
            createdAt: {
              [Op.lte]: endDate,
            },
          });
        }
        const data = await propertyModel.findAll({
          include: {
            model: roomModel,
            as: "roomProp",
            required: true,
            include: {
              model: orderListModel,
              as: "order",
              require: true,
              where: { [Op.and]: filterData },
              include: {
                model: transactionModel,
                as: "transaction",
                require: true,
                where: { status: "Confirmed" },
              },
            },
          },
          where: { [Op.and]: [{ tenantId: req.query.tenant }, { propertyId: req.query.property }] },
          order: [["createdAt", "ASC"]],
        });
        return res.status(200).send({
          data,
        });
      } else if (req.query.type === "transaction") {
        const filterData = [];
        if (startDate) {
          filterData.push({
            createdAt: {
              [Op.gte]: startDate,
            },
          });
        }
        if (endDate) {
          filterData.push({
            createdAt: {
              [Op.lte]: endDate,
            },
          });
        }
        const data = await orderListModel.findAll({
          include: [
            {
              model: transactionModel,
              as: "transaction",
              required: true,
              where: { status: "Confirmed" },
            },
            {
              model: roomModel,
              as: "room",
              required: true,
              include: [
                {
                  model: propertyModel,
                  as: "property",
                  required: true,
                  where: { tenantId: req.query.tenant },
                },
              ],
            },
          ],
          where: { [Op.and]: filterData },
          order: [["createdAt", "ASC"]],
        });
        return res.status(200).send({
          data,
        });
      } else if (req.query.type === "user") {
        const filterData = [];
        if (startDate) {
          filterData.push({
            createdAt: {
              [Op.gte]: startDate,
            },
          });
        }
        if (endDate) {
          filterData.push({
            createdAt: {
              [Op.lte]: endDate,
            },
          });
        }
        const data = await orderListModel.findAll({
          include: [
            {
              model: transactionModel,
              as: "transaction",
              required: true,
              where: { [Op.and]: [{ userId: req.query.user }, { status: "Confirmed" }] },
            },
            {
              model: roomModel,
              as: "room",
              required: true,
              include: [
                {
                  model: propertyModel,
                  as: "property",
                  required: true,
                  where: { tenantId: req.query.tenant },
                },
              ],
            },
          ],
          order: [["createdAt", "ASC"]],
          where: { [Op.and]: filterData },
        });
        return res.status(200).send({
          data,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getUserForChart: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      const tenant = await tenantModel.findAll({
        where: {
          userId: user[0].userId,
        },
      });
      if (tenant.length > 0) {
        const userData = await dbSequelize.query(
          `SELECT DISTINCT u.userId, u.name, u.email 
          FROM orderlists AS o
          INNER JOIN transactions AS t
          ON o.transactionId = t.transactionId
          INNER JOIN users AS u 
          ON t.userId = u.userId
          INNER JOIN rooms AS r
          ON o.roomId = r.roomId
          INNER JOIN properties AS p 
          ON r.propertyId = p.propertyId
          WHERE p.tenantId = ${tenant[0].tenantId}`,
          { type: QueryTypes.SELECT }
        );

        return res.status(200).send({
          success: true,
          result: userData,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      if (user.length > 0) {
        const transaction = await transactionModel.findAll({
          where: {
            transactionId: req.body.transactionId,
          },
        });
        const cancel = await transactionModel.update(
          {
            status: "Cancelled",
          },
          {
            where: {
              transactionId: req.body.transactionId,
            },
          }
        );
        const orderList = await orderListModel.findAll({
          where: {
            transactionId: req.body.transactionId,
          },
        });
        const roomAvail = await roomAvailModel.findAll({
          where: {
            [Op.and]: [{ roomId: orderList[0].roomId, startDate: transaction[0].checkinDate }],
          },
        });
        const rooms = await roomModel.findAll({
          where: {
            roomId: orderList[0].roomId,
          },
        });
        const types = await typeModel.findAll({
          where: {
            typeId: rooms[0].typeId,
          },
        });
        const currentCreatedAt = new Date(types[0].createdAt).setFullYear(
          new Date(types[0].createdAt).getFullYear() - 1
        );
        const currentYear = new Date(currentCreatedAt);
        const updateRa = await roomAvailModel.update(
          {
            startDate: currentYear,
            endDate: currentYear,
          },
          {
            where: {
              raId: roomAvail[0].raId,
            },
          }
        );
        return res.status(200).send({
          success: true,
          message: "Book cancelled!",
        });
      }
      return res.status(401).send({
        success: false,
        message: "Unauthorized Action",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database error",
      });
    }
  },
};
