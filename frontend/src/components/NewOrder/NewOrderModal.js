import React, { useRef, useState, useEffect } from "react";
import { getSymbol } from "../../services/SymbolsService";
import SelectSymbol from "./SelectSymbol";
import SymbolPrice from "./SymbolPrice";
import WalletSummary from "./WalletSummary";

/**
 * props:
 * - wallet
 */

function NewOrderModal(props) {
  const [error, setError] = useState("");
  const [symbol, setSymbol] = useState({});
  const DEFAULT_ORDER = {
    symbol: "",
    price: "0",
    stopPrice: "0",
    quantity: "0",
    icebergQty: "0",
    side: "BUY",
    type: "LIMIT",
  };
  const [order, setOrder] = useState(DEFAULT_ORDER);

  const btnClose = useRef("");
  const btnSend = useRef("");

  function onSubmit(event) {
    console.log("click");
  }

  function onInputChange(event) {
    setOrder((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  }

  useEffect(() => {
    if (!order.symbol) return;
    const token = localStorage.getItem("token");
    getSymbol(order.symbol, token)
      .then((symbolObject) => setSymbol(symbolObject))
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data : err.message);
      });
  }, [order.symbol]);

  return (
    <div
      className="modal fade"
      id="modalOrder"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="modalTitleNotify"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <p className="modal-title" id="modalTitleNotify">
              New Order
            </p>
            <button
              ref={btnClose}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <SelectSymbol onChange={onInputChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <SymbolPrice symbol={order.symbol} />
                </div>
              </div>
              <div className="row">
                <label>You have:</label>
              </div>
              <WalletSummary wallet={props.wallet} symbol={symbol} />
              <div className="row">
                <div className="col-md-6 mb-3"></div>
                <div className="col-md-6 mb-3"></div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            {error ? (
              <div className="alert alert-danger mt-1 col-9 py-1">{error}</div>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            <button
              ref={btnSend}
              type="button"
              className="btn btn-sm btn-primary"
              onClick={onSubmit}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewOrderModal;
