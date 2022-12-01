import React, { useEffect, useState } from "react";
import ActionType from "./ActionType";
import ActionBadge from "./ActionBadge";

/**
 * props:
 * - actions
 * - onChange
 */

function ActionsArea(props) {
  const DEFAULT_ACTION = {
    type: "ALERT_EMAIL",
  };

  const [newAction, setNewAction] = useState(DEFAULT_ACTION);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    setActions(props.actions ? props.actions : []);
    setNewAction(DEFAULT_ACTION);
  }, [props.actions]);

  function onInputChange(event) {
    setNewAction((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
    if (props.onChange) {
      props.onChange(event);
    }
  }

  function onAddClick(event) {
    const alreadyExists = actions.some((a) => a.type === newAction.type);
    if (alreadyExists) return;

    actions.push(newAction);
    setActions(actions);
    setNewAction(DEFAULT_ACTION);
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
