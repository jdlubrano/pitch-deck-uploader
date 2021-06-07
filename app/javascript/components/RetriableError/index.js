import React from "react";
import PropTypes from "prop-types";

const RetriableError = ({ error, onRetry }) => {
  return (
    <div className="alert alert-danger" role="alert">
      <span className="me-2">{error}</span>
      <a href="#" onClick={onRetry}>Retry</a>
    </div>
  );
};

RetriableError.propTypes = {
  error: PropTypes.node.isRequired,
  onRetry: PropTypes.func.isRequired
}

export default RetriableError;
