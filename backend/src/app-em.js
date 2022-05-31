const crypto = require("./utils/crypto");
const WebSocket = require("ws");

module.exports = (settings, wss) => {
  if (!settings)
    throw new Error("Can't start Exchange Monitor without settings.");

  const exchange = require("./utils/exchange")(settings);

  function broadcast(jsonObject) {
    if (!wss || !wss.clients) return;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(jsonObject));
      }
    });
  }

  exchange.miniTickerStream((markets) => {
    broadcast({ miniTicker: markets });
  });

  let book = [];

  exchange.bookStream((order) => {
    if (book.length === 300) {
      broadcast({ book });

      book = [];
    } else book.push(order);
  });

  exchange.userDataStream(
    (balanceData) => {
      broadcast({ balance: balanceData });
    },
    (executionData) => {
      console.log(executionData);
    }
  );

  console.log("App Exchange Monitor is running");
};
