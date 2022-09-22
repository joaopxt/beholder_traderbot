const ordersRepository = require("./repositories/ordersRepository");
const {
  getActiveMonitors,
  monitorTypes,
} = require("./repositories/monitorsRepository");
const {
  RSI,
  MACD,
  StochRSI,
  BollingerBands,
  SMA,
  EMA,
  indexKeys,
} = require("./utils/indexes");

let WSS, beholder, exchange;

function startMiniTickerMonitor(broadcastLabel, logs) {
  if (!exchange) return new Error("Exchange Monitor not initialized yet!");

  exchange.miniTickerStream((markets) => {
    if (logs) console.log(markets);

    Object.entries(markets).map((mkt) => {
      delete mkt[1].volume;
      delete mkt[1].quoteVolume;
      delete mkt[1].eventTime;
      const converted = {};
      Object.entries(mkt[1]).map(
        (prop) => (converted[prop[0]] = parseFloat(prop[1]))
      );
      beholder.updateMemory(mkt[0], indexKeys.MINI_TICKER, null, converted);
    });

    if (broadcastLabel && WSS) WSS.broadcast({ [broadcastLabel]: markets });
  });
  console.log(`MiniTicker Monitor has started at ${broadcastLabel}`);
}

let book = [];
async function startBookMonitor(broadcastLabel, logs) {
  if (!exchange) return new Error("Exchange Monitor not initialized yet!");

  exchange.bookStream((order) => {
    if (logs) console.log(order);

    if (book.length === 300) {
      if (broadcastLabel && WSS) {
        WSS.broadcast({ [broadcastLabel]: book });
      }

      book = [];
    } else book.push(order);

    const orderCopy = { ...order };
    delete orderCopy.symbol;
    delete orderCopy.updatedId;
    const converted = {};
    Object.entries(orderCopy).map((prop) => {
      converted[prop[0]] = parseFloat(prop[1]);
    });
    beholder.updateMemory(order.symbol, indexKeys.BOOK, null, converted);
  });
  console.log(`Book Monitor has started at ${broadcastLabel}`);
}

async function loadWallet() {
  if (!exchange) return new Error("Exchange Monitor not initialized yet!");
  const info = await exchange.balance();
  const wallet = Object.entries(info).map((item) => {
    beholder.updateMemory(
      item[0],
      indexKeys.WALLET,
      null,
      parseFloat(item[1].available)
    );

    //enviar para o Beholder
    return {
      symbol: item[0],
      available: item[1].available,
      onOrder: item[1].onOrder,
    };
  });
  return wallet;
}

function processExecutionData(executionData, broadcastLabel) {
  if (executionData.x === "NEW") return;

  const order = {
    symbol: executionData.s,
    orderId: executionData.i,
    clientOrderId:
      executionData.X === "CANCELED" ? executionData.C : executionData.c,
    side: executionData.S,
    type: executionData.o,
    status: executionData.X,
    isMaker: executionData.m,
    transactTime: executionData.T,
  };

  if (order.status === "FILLED") {
    const quoteAmount = parseFloat(executionData.Z);
    order.avgPrice = quoteAmount / parseFloat(executionData.z);
    order.commission = executionData.n;
    const isQuoteCommission =
      executionData.N && order.symbol.endsWith(executionData.N);
    order.net = isQuoteCommission
      ? quoteAmount - parseFloat(order.commission)
      : quoteAmount;
  }

  if (order.status === "REJECTED") order.obs = executionData.r;

  setTimeout(() => {
    ordersRepository
      .updateOrderByOrderId(order.orderId, order.clientOrderId, order)
      .then((order) => {
        if (order) {
          beholder.updateMemory(
            order.symbol,
            indexKeys.LAST_ORDER,
            null,
            order
          );
          //enviar para o Beholder
          if (broadcastLabel && WSS) WSS.broadcast({ [broadcastLabel]: order });
        }
      })
      .catch((err) => console.error(err));
  }, 3000);
}

function startUserDataMonitor(broadcastLabel, logs) {
  if (!exchange) return new Error("Exchange Monitor not initialized yet!");

  const [balanceBroadcast, executionBroadcast] = broadcastLabel
    ? broadcastLabel.split(",")
    : [null, null];

  loadWallet();

  exchange.userDataStream(
    (balanceData) => {
      if (logs) console.log(balanceData);
      const wallet = loadWallet();
      if (broadcastLabel && WSS) WSS.broadcast({ [balanceBroadcast]: wallet });
    },
    (executionData) => {
      if (logs) console.log(executionData);
      processExecutionData(executionData, executionBroadcast);
    }
  );

  console.log(`UserData Monitor has started at ${broadcastLabel}`);
}

function processChartData(symbol, indexes, interval, ohlc, logs) {
  if (typeof indexes === "string") indexes = indexes.split(",");
  if (indexes && indexes.length > 0) {
    indexes.map((index) => {
      const params = index.split("_");
      const indexName = params[0];
      params.splice(0, 1);

      let calc;
      switch (indexName) {
        case indexKeys.RSI:
          calc = RSI(ohlc.close, ...params);
          break;
        case indexKeys.MACD:
          calc = MACD(ohlc.close, ...params);
          break;
        case indexKeys.SMA:
          calc = SMA(ohlc.close, ...params);
          break;
        case indexKeys.EMA:
          calc = EMA(ohlc.close, ...params);
          break;
        case indexKeys.BOLLINGER_BANDS:
          calc = BollingerBands(ohlc.close, ...params);
          break;
        case indexKeys.STOCH_RSI:
          calc = StochRSI(ohlc.close, ...params);
          break;
        default:
          return;
      }

      if (logs)
        console.log(`${indexName} calculated: ${JSON.stringify(calc.current)}`);

      return beholder.updateMemory(symbol, index, interval, calc);
    });
  }
}

function startChartMonitor(symbol, interval, indexes, broadcastLabel, logs) {
  if (!symbol)
    return new Error(`You can't start a Chart Monitor without a symbol`);
  if (!exchange) return new Error("Exchange Monitor not initialized yet!");

  exchange.chartStream(symbol, interval || "1m", (ohlc) => {
    lastCandle = {
      open: ohlc.open[ohlc.open.length - 1],
      close: ohlc.close[ohlc.close.length - 1],
      high: ohlc.high[ohlc.high.length - 1],
      low: ohlc.low[ohlc.low.length - 1],
    };

    if (logs) console.log(lastCandle);

    beholder.updateMemory(symbol, indexKeys.LAST_CANDLE, interval, lastCandle);

    if (broadcastLabel && WSS) WSS.broadcast({ [broadcastLabel]: lastCandle });

    processChartData(symbol, indexes, interval, ohlc, logs);
  });
  console.log(`Chart Monitor has started at ${symbol}_${interval}`);
}

function stopChartMonitor(symbol, interval, indexes, logs) {
  if (!symbol)
    return new Error(`You can't stop a Chart Monitor without a symbol`);
  if (!exchange) return new Error("Exchange Monitor not initialized yet!");

  exchange.terminateChartStream(symbol, interval);
  if (logs) console.log(`Chart Monitor ${symbol}_${interval} stopped!`);

  beholder.deleteMemory(symbol, "LAST_CANDLE", interval);

  if (indexes && Array.isArray(indexes)) {
    indexes.map((ix) => beholder.deleteMemory(symbol, ix, interval));
  }
}

function getLightTicker(data) {
  delete data.eventType;
  delete data.eventTime;
  delete data.symbol;
  delete data.openTime;
  delete data.closeTime;
  delete data.firstTradeId;
  delete data.lastTradeId;
  delete data.numTrades;
  delete data.closeQty;
  delete data.bestBidQty;
  delete data.bestAskQty;

  data.volume = parseFloat(data.volume);
  data.quoteVolume = parseFloat(data.quoteVolume);
  data.priceChange = parseFloat(data.priceChange);
  data.percentChange = parseFloat(data.percentChange);
  data.averagePrice = parseFloat(data.averagePrice);
  data.prevClose = parseFloat(data.prevClose);
  data.high = parseFloat(data.high);
  data.low = parseFloat(data.low);
  data.open = parseFloat(data.open);
  data.close = parseFloat(data.close);
  data.bestBid = parseFloat(data.bestBid);
  data.bestAsk = parseFloat(data.bestAsk);

  return data;
}

function startTickerMonitor(symbol, broadcastLabel, logs) {
  if (!symbol) {
    return new Error(`You can't start a Ticker Monitor without a symbol`);
  }
  if (!exchange) return new Error("Exchange Monitor not initialized yet!");

  exchange.tickerStream(symbol, async (data) => {
    //if (logs) console.log(data); Console log dos dados da Ticker Stream

    try {
      const ticker = getLightTicker({ ...data });
      const currentMemory = beholder.getMemory(symbol, indexKeys.TICKER);

      const newMemory = {};
      newMemory.previous = currentMemory ? currentMemory.current : ticker;
      newMemory.current = ticker;

      beholder.updateMemory(data.symbol, indexKeys.TICKER, null, newMemory);

      if (WSS && broadcastLabel) WSS.broadcast({ [broadcastLabel]: data });
    } catch (err) {
      if (logs) console.error(err);
    }
  });
  console.log(`Ticker Monitor has started for ${symbol}`);
}

function stopTickerMonitor(symbol, logs) {
  if (!symbol)
    return new Error(`You can't stop a Ticker Monitor without a symbol`);

  if (!exchange) return new Error("Exchange Monitor not initialized yet!");

  exchange.terminateTickerStream(symbol);

  if (logs) console.log(`Ticker Monitor ${symbol} stopped!`);

  beholder.deleteMemory(symbol, indexKeys.TICKER);
}

async function init(settings, wssInstance, beholderInstance) {
  if (!settings || !beholderInstance)
    throw new Error(
      "Can't start Exchange Monitor without settings and/or Beholder Instance."
    );

  WSS = wssInstance;
  beholder = beholderInstance;
  exchange = require("./utils/exchange")(settings);

  const monitors = await getActiveMonitors();
  monitors.map((m) => {
    setTimeout(() => {
      switch (m.type) {
        case monitorTypes.MINI_TICKER:
          return startMiniTickerMonitor(m.broadcastLabel, m.logs);
        case monitorTypes.BOOK:
          return startBookMonitor(m.broadcastLabel, m.logs);
        case monitorTypes.USER_DATA:
          return startUserDataMonitor(m.broadcastLabel, m.logs);
        case monitorTypes.CANDLES:
          return startChartMonitor(
            m.symbol,
            m.interval,
            m.indexes ? m.indexes.split(",") : [],
            m.broadcastLabel,
            m.logs
          );
        case monitorTypes.TICKER:
          return startTickerMonitor(m.symbol, m.broadcastLabel, m.logs);
      }
    }, 250); //Binance only permits 5 commands / second
  });

  console.log("App Exchange Monitor is running!");
}

module.exports = {
  init,
  startChartMonitor,
  stopChartMonitor,
  startTickerMonitor,
  stopTickerMonitor,
};
