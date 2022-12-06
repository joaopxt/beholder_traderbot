import React, { useEffect, useState } from "react";
import ActionType from "./ActionType";
import ActionBadge from "./ActionBadge";
import { getOrderTemplates } from "../../../../services/OrderTemplatesService";

/**
 * props:
 * - actions
 * - onChange
 * - symbol
 */

function ActionsArea(props) {
  const DEFAULT_ACTION = {
    type: "ALERT_EMAIL",
    orderTemplateId: null,
    orderTemplateName: "",
  };

  const [newAction, setNewAction] = useState(DEFAULT_ACTION);
  const [actions, setActions] = useState([]);
  const [orderTemplates, setOrderTemplates] = useState([]);

  useEffect(() => {
    setActions(props.actions ? props.actions : []);
    setNewAction(DEFAULT_ACTION);
  }, [props.actions]);

  useEffect(() => {
    if (!props.symbol) return;

    const token = localStorage.getItem("token");
    getOrderTemplates(props.symbol, 1, token)
      .then((result) => setOrderTemplates(result.rows))
      .catch((err) => (err.response ? err.response.data : err.message));
  }, [props.symbol]);

  function onInputChange(event) {
    if (event.target.id === "orderTemplateId") {
      const orderTemplateId = parseInt(event.target.value);
      const orderTemplate = orderTemplates.find(
        (ot) => ot.id === orderTemplateId
      );
      setNewAction((prevState) => ({
        ...prevState,
        orderTemplateName: orderTemplate.name,
        orderTemplateId,
      }));
    } else {
      setNewAction((prevState) => ({
        ...prevState,
        [event.target.id]: event.target.value,
      }));
      if (props.onChange) {
        props.onChange(event);
      }
    }
  }

  function onAddClick(event) {
    if (newAction.type === "ORDER") {
      if (!newAction.orderTemplateId) return;
      newAction.id = "ot" + newAction.orderTemplateId;

      const alreadyExists = actions.some((a) => a.id === newAction.id);
      if (alreadyExists) return;
    } else {
      const alreadyExists = actions.some((a) => a.type === newAction.type);
      if (alreadyExists) return;
    }

    actions.push(newAction);
    setActions(actions);
    if (props.onChange)
      props.onChange({ target: { id: "actions", value: actions } });
  }

  function onRemoveActionClick(event) {
    const index = actions.find((a) => a.id === event.target.id);
    actions.splice(index, 1);
    if (props.onChange)
      props.onChange({ target: { id: "actions", value: actions } });
  }

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12 my-3">
          <div className="input-group input-group-merge">
            <ActionType type={newAction.type} onChange={onInputChange} />
            {newAction.type === "ORDER" && orderTemplates ? (
              <select
                id="orderTemplateId"
                className="form-select"
                onChange={onInputChange}
              >
                <option value="0">Select one...</option>
                {orderTemplates.map((ot) => (
                  <option key={ot.id} value={ot.id}>
                    {ot.name}
                  </option>
                ))}
              </select>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onAddClick}
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {actions && actions.length > 0 ? (
        <div className="divScrollBadges">
          <div className="d-inline-flex flex-row align-content-start">
            {actions.map((action) => (
              <ActionBadge
                key={action.type + ":" + action.id}
                action={action}
                onClick={onRemoveActionClick}
              />
            ))}
          </div>
        </div>
      ) : (
        <React.Fragment></React.Fragment>
      )}
    </React.Fragment>
  );
}

export default ActionsArea;
