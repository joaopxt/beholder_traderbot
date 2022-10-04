import React, { useRef, useState, useEffect } from "react";
import SmartBadge from "../../../components/SmartBadge/SmartBadge";
import { getAnalysisIndexes } from "../../../services/BeholderService";

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

  const [analysis, setAnalysis] = useState({});
  useEffect(() => {
    const token = localStorage.getItem("token");
    getAnalysisIndexes(token)
      .then((result) => setAnalysis(result))
      .catch((err) =>
        console.error(err.response ? err.response.data : err.message)
      );
  }, []);

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
    if (event.target.value === "NONE") return;
    const { params } = analysis[event.target.value];
    inputPeriod.current.placeholder = params;
    if (params === "none") {
      inputPeriod.current.className = "d-none";
    } else {
      inputPeriod.current.className = "form-control";
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
                {analysis &&
                  Object.entries(analysis)
                    .sort((a, b) => {
                      if (a[0] > b[0]) return 1;
                      if (a[0] < b[0]) return -1;
                      return 0;
                    })
                    .map((props) => (
                      <option key={props[0]} value={props[0]}>
                        {props[1].name}
                      </option>
                    ))}
              </select>
              <input
                ref={inputPeriod}
                type="text"
                id="params"
                placeholder="params"
                className="d-none"
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
      <div className="divScrollBadges">
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
      </div>
    </React.Fragment>
  );
}

export default MonitorIndex;
