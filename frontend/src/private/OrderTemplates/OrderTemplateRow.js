import React from "react";

/**
 * props:
 * - data
 * - onEditClick
 * - onDeleteClick
 */

function OrderTemplateRow(props) {
  return (
    <tr>
      <td>{props.data.symbol}</td>
      <td>{props.data.name}</td>
      <td>{props.data.side}</td>
      <td>{props.data.type}</td>
      <td>
        <button
          id={"edit" + props.data.id}
          type="button"
          className="btn btn-secondary btn-xs ms-2"
          title="Edit this OrderTemplate"
          data-bs-toggle="modal"
          data-bs-target="#modalOrderTemplate"
          onClick={props.onEditClick}
        >
          <svg
            className="icon icon-xs"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          id={"delete" + props.data.id}
          type="button"
          className="btn btn-danger btn-xs ms-2"
          title="Delete this OrderTemplate"
          onClick={props.onDeleteClick}
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>{" "}
        </button>
      </td>
    </tr>
  );
}

export default OrderTemplateRow;
