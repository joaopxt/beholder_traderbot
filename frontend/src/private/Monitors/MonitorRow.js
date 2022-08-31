import React from "react";

/**
 * props:
 * - data
 * - onEditClick
 * - onStopClick
 * - onStartClick
 * - onDeleteClick
 */

function MonitorRow(props) {
  function getActiveClass(isActive) {
    return isActive ? "text-success" : "text-danger";
  }

  function getActiveText(isActive) {
    return isActive ? "RUNNING" : "STOPPED";
  }

  return (
    <tr>
      <td>{props.data.type}</td>
      <td>
        {props.data.symbol ? props.data.symbol : "*"}
        {props.data.interval ? `_${props.data.interval}` : ""}
      </td>
      <td>
        <span className={getActiveClass(props.data.isActive)}>
          {getActiveText(props.data.isActive)}
        </span>
      </td>
      <td>
        {!props.data.isSystemMon ? (
          <button
            id={"edit" + props.data.id}
            type="button"
            className="btn btn-secondary btn-xs ms-2"
            title="Edit this Monitor"
            data-bs-toggle="modal"
            data-bs-target="#modalMonitor"
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
        ) : (
          <React.Fragment></React.Fragment>
        )}
        {props.data.isActive && !props.data.isSystemMon ? (
          <button
            id={"stop" + props.data.id}
            type="button"
            className="btn btn-danger btn-xs ms-2"
            title="Stop this Monitor"
            onClick={props.onStopClick}
          >
            <svg
              className="icon icon-xs"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <React.Fragment></React.Fragment>
        )}
        {!props.data.isActive && !props.data.isSystemMon ? (
          <button
            id={"start" + props.data.id}
            type="button"
            className="btn btn-success btn-xs ms-2"
            title="Start this Monitor"
            onClick={props.onStartClick}
          >
            <svg
              className="icon icon-xs"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <React.Fragment></React.Fragment>
        )}
        {!props.data.isActive && !props.data.isSystemMon ? (
          <button
            id={"delete" + props.data.id}
            type="button"
            className="btn btn-danger btn-xs ms-2"
            title="Delete this Monitor"
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
        ) : (
          <React.Fragment></React.Fragment>
        )}
        {props.data.isSystemMon ? (
          <span
            className="badge bg-primary me-1 align-middle py-1"
            title="Can't do any action with system monitors"
          >
            SYSTEM
          </span>
        ) : (
          <React.Fragment></React.Fragment>
        )}
      </td>
    </tr>
  );
}

export default MonitorRow;
