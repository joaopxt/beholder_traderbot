import React, { useState, useEffect } from "react";
import IndexSelect from "./IndexSelect";
import VariableInput from "./VariableInput";

/**
 * props:
 * - indexes
 * - symbol
 * - conditions
 * - onChange
 */

function ConditionsArea(props) {
  const [indexes, setIndexes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState({ example: 0 });
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    setIndexes(props.indexes);
  }, [props.indexes]);

  useEffect(() => {
    setConditions(parseConditions(props.conditions));
  }, [props.conditions]);

  function onKeySelectChange(event) {
    const item = props.indexes.find((k) => k.eval === event.target.value);
    if (item) setSelectedIndex(item);
  }

  function parseConditions(conditionsText) {
    if (!conditionsText) return [];

    const split = conditionsText.split("&&");
    return split.map((item) => {
      const text = item
        .replaceAll("MEMORY['", "")
        .replaceAll("']", "")
        .replaceAll("==", "=")
        .replaceAll(props.symbol + ":", "")
        .trim();

      return {
        eval: item.trim(),
        text,
      };
    });
  }

  function parseIndexes(conditionsArr) {
    const indexesStr = conditionsArr
      .map((condition) => {
        const memoryIndexes = condition.eval
          .split(/[=><!]/)
          .filter((str) => str.startsWith("MEMORY"))
          .map((str) => str.split(".")[0]);

        return memoryIndexes.join(",");
      })
      .join(",");
    return [
      ...new Set(
        indexesStr.replaceAll("MEMORY['", "").replaceAll("']", "").split(",")
      ),
    ].join(",");
  }

  function onAddConditionClick(event) {
    const parsedCondition = parseConditions(event.target.value.eval)[0];
    if (conditions.some((c) => c.eval === parsedCondition.eval)) return;

    conditions.push(parsedCondition);
    props.onChange({
      target: {
        id: "conditions",
        value: conditions.map((c) => c.eval).join(" && "),
      },
    });

    const conditionIndexes = parseIndexes(conditions);
    props.onChange({ target: { id: "indexes", value: conditionIndexes } });
  }

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12 mb-3">
          <IndexSelect indexes={indexes} onChange={onKeySelectChange} />
          <VariableInput
            indexes={indexes}
            onAddClick={onAddConditionClick}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default ConditionsArea;
