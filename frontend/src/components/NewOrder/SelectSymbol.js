import React, { useState, useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { getSymbols } from "../../services/SymbolsService";

/**
 * props:
 * - onChange
 * - symbol
 * - disabled
 * - onlyFavourites
 */

function SelectSymbol(props) {
  const history = useHistory();

  const [symbols, setSymbols] = useState(["LOADING"]);
  const [onlyFavourites, setOnlyFavourites] = useState(
    props.onlyFavourites === null || props.onlyFavourites === undefined
      ? true
      : props.onlyFavourites
  );

  const selectRef = useRef("");
  const buttonRef = useRef("");

  function onFavouriteClick(event) {
    setOnlyFavourites(!onlyFavourites);
  }

  function getStarFillColor() {
    return onlyFavourites ? "yellow" : "white";
  }

  useEffect(() => {
    selectRef.current.value = props.symbol || "BTCUSDT";
    buttonRef.current.disabled = buttonRef.current.disabled = props.disabled;
  }, [props.symbol]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    getSymbols(token)
      .then((symbolObjects) => {
        const symbolNames = onlyFavourites
          ? symbolObjects.filter((s) => s.isFavorit).map((s) => s.symbol)
          : symbolObjects.map((s) => s.symbol);

        if (symbolNames.length) {
          setSymbols(symbolNames);
          props.onChange({ target: { id: "symbol", value: symbolNames[0] } });
        } else setSymbols(["NO SYMBOLS"]);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401)
          return history.push("/");
        console.error(err);
        setSymbols(["ERROR"]);
      });
  }, [onlyFavourites]);

  const selectSymbol = useMemo(() => {
    return (
      <div className="form-group mb-4">
        <label htmlFor="symbol">Symbol</label>
        <div className="input-group">
          <button
            ref={buttonRef}
            type="button"
            className="btn btn-secondary d-inline-flex align-items-center"
            onClick={onFavouriteClick}
          >
            <svg
              className="icon icon-xs"
              fill={getStarFillColor()}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
          <select
            ref={selectRef}
            id="symbol"
            className="form-select"
            onChange={props.onChange}
          >
            {symbols.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }, [symbols]);

  return selectSymbol;
}

export default SelectSymbol;
