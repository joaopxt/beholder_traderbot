import React, { useRef, useState, useEffect } from "react";
import SmartBadge from "../../../components/SmartBadge/SmartBadge";

/**
 * props:
 * - indexes
 * - onChange
 */

function MonitorIndex(props) {
  const btnAddIndex = useRef("");
  const selectIndex = useRef("");
  const inputPeriod = useRef("");

  const [indexes, setIndexes] = useState([]);

  useEffect(() => {
    if (props.indexes) {
      setIndexes(props.indexes.split(","));
    } else {
      setIndexes([]);
    }
  }, [props.indexes]);

  function onAddIndexClick(event) {
    const value = selectIndex.current.value;
    if (value !== "NONE" && indexes.indexOf(value) === -1) {
      inputPeriod.current.value =
        inputPeriod.current.value === "Params" ? "" : inputPeriod.current.value;
      indexes.push(
        value + "_" + inputPeriod.current.value.split(",").join("_")
      );

      selectIndex.current.value = "NONE";
      inputPeriod.current.value = "";

      setIndexes(indexes);
      if (props.onChange)
        props.onChange({ target: { id: "indexes", value: indexes.join(",") } });
    }
  }

  function onRemoveIndex(event) {
    const id = event.target.id.replace("ix", "");
    const pos = indexes.findIndex((ix) => ix === id);
    indexes.splice(pos, 1);
    setIndexes(indexes);
    if (props.onChange)
      props.onChange({ target: { id: "indexes", value: indexes.join(",") } });
  }

  function onIndexChange(event) {
    switch (event.target.value) {
      case "EMA":
      case "SMA":
      case "RSI":
        inputPeriod.current.placeholder = "period";
        break;
      case "BB":
        inputPeriod.current.placeholder = "period, stdDev";
        break;
      case "SRSI":
        inputPeriod.current.placeholder = "d, k, rsi, stoch";
        break;
      case "MACD":
        inputPeriod.current.placeholder = "fast, slow, signal";
        break;
      default:
        break;
    }
  }

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12 mb-3">
          <div className="form-group">
            <label htmlFor="indexes">
              Indexes:{" "}
              <span
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="The index params in parenthesis must be provided"
                className="badge bg-warning py-1"
              >
                ?
              </span>
            </label>
            <div className="input-group input-group-merge">
              <select
                id="indexes"
                ref={selectIndex}
                className="form-select"
                defaultValue="NONE"
                onChange={onIndexChange}
              >
                <option value="NONE">None</option>
                <option value="BB">
                  Bollinger Bands (period and std. dev.)
                </option>
                <option value="EMA">EMA (period)</option>
                <option value="MACD">
                  MACD (fast, slow and signal periods)
                </option>
                <option value="RSI">RSI (period)</option>
                <option value="SMA">SMA (period)</option>
                <option value="SRSI">
                  Stoch RSI (d, k, rsi and stochastic periods)
                </option>
              </select>
              <input
                ref={inputPeriod}
                type="text"
                id="params"
                placeholder="Params"
                className="form-control"
                required={true}
              />
              <button
                type="button"
                className="btn btn-secondary"
                ref={btnAddIndex}
                onClick={onAddIndexClick}
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
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="d-inline-flex align-content-start">
        {indexes.map((ix) => (
          <SmartBadge
            key={ix}
            id={"ix" + ix}
            text={ix}
            onClick={onRemoveIndex}
          />
        ))}
      </div>
    </React.Fragment>
  );
}

export default MonitorIndex;
