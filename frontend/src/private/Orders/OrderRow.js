import React from "react";

/**
 * props:
 * - data
 * - onClick
 */

function OrderRow(props) {
  function getDate(timestamp) {
    const date = new Date(timestamp);
    return Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  }

  function getStatus(status) {
    let className;
    switch (status) {
      case "PARTIALLY_FILLED":
        className = "badge bg-info py-1";
        break;
      case "FILLED":
        className = "badge bg-success py-1";
        break;
      case "REJECTED":
      case "CANCELED":
      case "EXPIRED":
        className = "badge bg-danger py-1";
        break;
      default:
        className = "badge bg-warning py-1";
    }
    return <span className={className}>{status.split("_")[0]}</span>;
  }

  return (
    <tr>
      <td>
        {props.data.automationId ? (
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ) : (
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
              d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
            />
          </svg>
        )}
        {<span className="badge bg-warning py-1 me-2">{props.data.side}</span>}
        {props.data.symbol}
      </td>
      <td>
        <span className="fw-normal">{getDate(props.data.transactTime)}</span>
      </td>
      <td>
        <span className="fw-normal">{props.data.quantity}</span>
      </td>
      <td>
        <span className="fw-bold">{props.data.avgPrice}</span>
      </td>
      <td>{getStatus(props.data.status)}</td>
      <td>
        <button
          id={"view" + props.data.id}
          type="button"
          className="btn btn-info btn-xs"
          data-bs-toggle="modal"
          data-bs-target="#modalViewOrder"
          onClick={props.onClick}
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}

export default OrderRow;
