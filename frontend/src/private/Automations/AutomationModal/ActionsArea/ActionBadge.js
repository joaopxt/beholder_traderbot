import React from "react";
import SmartBadge from "../../../../components/SmartBadge/SmartBadge";

/**
 * props:
 * - action
 * - onClick
 */

function ActionBadge(props) {
  function renderBadge(actionType) {
    let image,
      text = "";

    if (actionType === "ALERT_EMAIL") {
      image = (
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
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (actionType === "ALERT_SMS") {
      image = (
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
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (actionType === "ORDER") {
      text = props.action.orderTemplateName || props.action.orderTemplate.name;
      image = (
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
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      );
    }

    return (
      <SmartBadge id={props.action.id} text={text} onClick={props.onClick}>
        {image}
      </SmartBadge>
    );
  }

  return renderBadge(props.action.type);
}

export default ActionBadge;
