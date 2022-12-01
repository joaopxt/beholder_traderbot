const symbolModel = require("../models/symbolModel");
const Sequelize = require("sequelize");

function getSymbols() {
  return symbolModel.findAll();
}

function searchSymbols(search, onlyFavorites = false, page = 1) {
  const options = {
    where: {},
    order: [["symbol", "ASC"]],
    limit: 10,
    offset: 10 * (page - 1),
  };

  if (search) {
    if (search.length < 6)
      options.where = { symbol: { [Sequelize.Op.like]: `%${search}%` } };
    else options.where = { symbol: search };
  }

  if (onlyFavorites) options.where.isFavorit = true;

  return symbolModel.findAndCountAll(options);
}

function getSymbol(symbol) {
  return symbolModel.findOne({ where: { symbol } });
}

async function updateSymbol(symbol, newSymbol) {
  const currentSymbol = await getSymbol(symbol);

  if (
    newSymbol.basePrecision &&
    newSymbol.basePrecision !== currentSymbol.basePrecision
  )
    currentSymbol.basePrecision = newSymbol.basePrecision;

  if (
    newSymbol.quotePrecision &&
    newSymbol.quotePrecision !== currentSymbol.quotePrecision
  )
    currentSymbol.quotePrecision = newSymbol.quotePrecision;

  if (
    newSymbol.minNotional &&
    newSymbol.minNotional !== currentSymbol.minNotional
  )
    currentSymbol.minNotional = newSymbol.minNotional;

  if (newSymbol.minLotSize && newSymbol.minLotSize !== currentSymbol.minLotSize)
    currentSymbol.minLotSize = newSymbol.minLotSize;

  if (newSymbol.base && newSymbol.base !== currentSymbol.base)
    currentSymbol.base = newSymbol.base;

  if (newSymbol.quote && newSymbol.quote !== currentSymbol.quote)
    currentSymbol.quote = newSymbol.quote;

  if (newSymbol.stepSize && newSymbol.stepSize !== currentSymbol.stepSize)
    currentSymbol.stepSize = newSymbol.stepSize;

  if (newSymbol.tickSize && newSymbol.tickSize !== currentSymbol.tickSize)
    currentSymbol.tickSize = newSymbol.tickSize;

  if (
    newSymbol.isFavorit !== null &&
    newSymbol.isFavorit !== undefined &&
    newSymbol.isFavorit !== currentSymbol.isFavorit
  )
    currentSymbol.isFavorit = newSymbol.isFavorit;
  //se eu precisar escrever isso errado mais uma vez eu refaço

  await currentSymbol.save();
}

async function deleteAll() {
  return symbolModel.destroy({ truncate: true });
}

async function bulkInsert(symbols) {
  return symbolModel.bulkCreate(symbols);
}

module.exports = {
  getSymbols,
  getSymbol,
  updateSymbol,
  deleteAll,
  bulkInsert,
  searchSymbols,
};
