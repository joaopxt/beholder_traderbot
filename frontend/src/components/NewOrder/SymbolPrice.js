import React, { useState } from "react";
import useWebSocket from "react-use-websocket";

/**
 * props:
 * - symbol
 */

function SymbolPrice(props) {
  const [book, setBook] = useState({ bid: "0", ask: "0" });

  function getBinanceWSUrl() {
    return `${
      process.env.REACT_APP_BWS_URL
    }/${props.symbol.toLowerCase()}@bookTicker`;
  }

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(getBinanceWSUrl(), {
    onOpen: () => {
      console.log(`Connected to Binance Stream ${props.symbol}`);
      sendJsonMessage({
        method: "SUBSCRIBE",
        params: [`${props.symbol.toLowerCase()}@bookTicker`],
        id: 1,
      });
    },
    onMessage: () => {
      if (lastJsonMessage) {
        setBook({ bid: lastJsonMessage.b, ask: lastJsonMessage.a });
      }
    },
    onError: (event) => console.error(event),
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 3000,
  });

  return (
    <div className="form-group">
      <label>Market Price</label>
      <br />
      BID: {book.bid}
      <br />
      ASK: {book.ask}
    </div>
  );
}

export default SymbolPrice;
