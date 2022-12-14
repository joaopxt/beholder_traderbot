const orderModel = require("../models/orderModel");
const Sequelize = require("sequelize");
const automationModel = require("../models/automationModel");

const PAGE_SIZE = 10;

function getOrders(symbol, page = 1) {
  const options = {
    where: {},
    order: [["updatedAt", "DESC"]],
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
  };

  if (symbol) {
    if (symbol.length < 6) {
      options.where = { symbol: { [Sequelize.Op.like]: `%${symbol}%` } };
    } else {
      options.where = { symbol };
    }
  }

  options.include = automationModel;

  return orderModel.findAndCountAll(options);
}

function insertOrder(newOrder) {
  return orderModel.create(newOrder);
}

function getOrderById(id) {
  return orderModel.findByPk(id);
}

function getOrder(orderId, clientOrderId) {
  return orderModel.findOne({
    where: { orderId, clientOrderId },
    include: automationModel,
  });
}

async function updateOrderById(id, newOrder) {
  const order = await getOrderById(id);
  return updateOrder(order, newOrder);
}

async function updateOrderByOrderId(orderId, clientOrderId, newOrder) {
  const order = await getOrder(orderId, clientOrderId);
  return updateOrder(order, newOrder);
}

async function getLastFilledOrders() {
  const idObjects = await orderModel.findAll({
    where: { status: "FILLED" },
    group: "symbol",
    attributes: [Sequelize.fn("max", Sequelize.col("id"))],
    raw: true,
  });
  const ids = idObjects.map((o) => Object.values(o)).flat();

  return orderModel.findAll({ where: { id: ids } });
}

async function updateOrder(currentOrder, newOrder) {
  if (newOrder.status && newOrder.status !== currentOrder.status)
    currentOrder.status = newOrder.status;

  if (newOrder.avgPrice && newOrder.avgPrice !== currentOrder.avgPrice)
    currentOrder.avgPrice = newOrder.avgPrice;

  if (newOrder.obs && newOrder.obs !== currentOrder.obs)
    currentOrder.obs = newOrder.obs;

  if (
    newOrder.transactTime &&
    newOrder.transactTime !== currentOrder.transactTime
  )
    currentOrder.transactTime = newOrder.transactTime;

  if (newOrder.commission && newOrder.commission !== currentOrder.commission)
    currentOrder.commission = newOrder.commission;

  if (newOrder.net && newOrder.net !== currentOrder.net)
    currentOrder.net = newOrder.net;

  if (
    newOrder.isMaker !== null &&
    newOrder.isMaker !== undefined &&
    newOrder.isMaker !== currentOrder.isMaker
  )
    currentOrder.isMaker = newOrder.isMaker;

  await currentOrder.save();
  return currentOrder;
}

const STOP_TYPES = [
  "STOP_LOSS",
  "STOP_LOSS_LIMIT",
  "TAKE_PROFIT",
  "TAKE_PROFIT_LIMIT",
];

const LIMIT_TYPES = ["LIMIT", "STOP_LOSS_LIMIT", "TAKE_PROFIT_LIMIT"];

module.exports = {
  STOP_TYPES,
  LIMIT_TYPES,
  getOrders,
  insertOrder,
  getOrderById,
  getOrder,
  updateOrderById,
  updateOrderByOrderId,
  getLastFilledOrders,
};
