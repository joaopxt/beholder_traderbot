import React, { useMemo, useRef } from "react";

/**
 * props:
 * - id
 * - text
 * - wallet
 * - price
 * - symbol
 * - side
 * - onChange
 */

function QuantityInput(props) {
  const inputQuantity = useRef("");

  let qty;

  function onCalcClick(event) {
    if (!props.wallet || !Array.isArray(props.wallet)) return;

    if (props.side === "SELL") {
      const baseAsset = props.wallet.find(
        (w) => w.symbol === props.symbol.base
      );
      if (!baseAsset) return;
      qty = parseFloat(baseAsset.available);
    } else {
      const quoteAsset = props.wallet.find(
        (w) => w.symbol === props.symbol.quote
      );
      if (!quoteAsset) return;
      const quoteAmount = parseFloat(quoteAsset.available);
      if (!quoteAmount) return;

      qty = quoteAmount / parseFloat(props.price);
    }

    if (!qty) return;

    inputQuantity.current.value = `${qty}`.substring(0, 8);
    if (props.onChange)
      props.onChange({
        target: { id: props.id, value: inputQuantity.current.value },
      });
  }

  const quantityInput = useMemo(
    () => (
      <div className="form-group">
        <label htmlFor={props.id}>{props.text}</label>
        <div className="input-group">
          <button
            type="button"
            className="btn btn-secondary d-inline alignt-items-center"
            onClick={onCalcClick}
          >
            <svg
              className="icon icon-xs"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </button>
          <input
            type="number"
            id={props.id}
            ref={inputQuantity}
            className="form-control"
            placeholder={props.symbol.minLotSize}
            onChange={props.onChange}
          />
        </div>
      </div>
    ),
    [props.wallet, props.price, props.symbol, props.side]
  );

  return quantityInput;
}

export default QuantityInput;
