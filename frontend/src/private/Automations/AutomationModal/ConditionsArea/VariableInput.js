import React, { useState, useEffect, useRef } from "react";

/**
 * props:
 * - selectedIndex
 * - indexes
 * - onAddClick
 */

function VariableInput(props) {
  const variableRef = useRef("");

  const [indexes, setIndexes] = useState({});
  const [index, setIndex] = useState({});
  const [variable, setVariable] = useState({});
  const [operator, setOperator] = useState("==");

  useEffect(() => {
    setIndex(props.selectedIndex);
    setVariable(props.selectedIndex.example);
    variableRef.current.value = "";
  }, [props.selectedIndex]);

  useEffect(() => {
    setIndexes(props.indexes);
  }, [props.indexes]);

  function onOperatorChange(event) {
    setOperator(event.target.value);
  }

  function onVariableChange(event) {
    const value = event.target.value;
    const index = props.indexes.find((k) => value.endsWith(k.variable));

    if (index && !value.endsWith("WALLET")) {
      setVariable(index.eval);
    } else {
      setVariable(value);
    }
  }

  function getOptionText(symbol, variable) {
    return variable === "WALLET" ? `${symbol}:${variable}` : variable;
  }

  function getExpressionText() {
    const value =
      typeof index.example === "string" ? `'${variable}'` : variable;
    return `${index.symbol}:${index.variable} ${operator.replace(
      "==",
      "="
    )} ${value}`;
  }

  function onAddClick(event) {
    const value =
      typeof index.example === "string" ? `'${variable}'` : variable;

    const condition = {
      eval: `${index.eval}${operator}${value}`,
      text: getExpressionText(),
    };
    props.onAddClick({ target: { id: "condition", value: condition } });
  }

  return (
    <div className="input-group input-group-merge mb-2">
      <span className="input-group-text bg-secondary">Is</span>
      <select id="operator" className="form-select" onChange={onOperatorChange}>
        {typeof index.example === "number" ? (
          <React.Fragment>
            <option value=">">Greater than</option>
            <option value=">=">Greater or equals</option>
            <option value="<">Less than</option>
            <option value="<=">Less or equals</option>
          </React.Fragment>
        ) : (
          <React.Fragment></React.Fragment>
        )}
        <option value="==">Equals</option>
        <option value="!=">Not equals</option>
      </select>
      <input
        type="text"
        ref={variableRef}
        id="variable"
        list="variables"
        className="form-select"
        onChange={onVariableChange}
        placeholder={`${index.example}`}
      />
      <datalist id="variables">
        {indexes && Array.isArray(indexes) ? (
          indexes
            .filter((i) => i.eval !== index.eval)
            .map((item) => (
              <option key={`${item.symbol}:${item.variable}`}>
                {getOptionText(item.symbol, item.variable)}
              </option>
            ))
        ) : (
          <option value="">NO INDEXES</option>
        )}
      </datalist>
      <button type="button" className="btn btn-secondary" onClick={onAddClick}>
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
  );
}

export default VariableInput;
