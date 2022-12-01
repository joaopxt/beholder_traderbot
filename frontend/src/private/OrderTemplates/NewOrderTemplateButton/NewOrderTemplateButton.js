import React from "react";

/**
 * props:
 * - onClick
 */

function NewOrderTemplateButton(props) {
  return (
    <button
      id="btnNewOrderTemplate"
      type="button"
      className="btn btn-primary animate-up-2"
      data-bs-toggle="modal"
      data-bs-target="#modalOrderTemplate"
      onClick={props.onClick}
    >
      <svg
        className="icon icon-xs me-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      New Order Template
    </button>
  );
}

export default NewOrderTemplateButton;
