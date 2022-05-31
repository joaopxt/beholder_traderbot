const symbolModel = require("../models/symbolModel");

function getSymbols() {
  return symbolModel.findAll();
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
};
