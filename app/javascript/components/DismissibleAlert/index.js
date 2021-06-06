import React from "react";
import PropTypes from "prop-types";
import Alert from 'bootstrap/js/dist/alert';

const DismissibleAlert = ({ children, status }) => (
  <div className={`alert alert-${status} alert-dismissible fade show`} role="alert">
    {children}
    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" data-testid="test-close"></button>
  </div>
);

DismissibleAlert.propTypes = {
  children: PropTypes.node.isRequired,
  status: PropTypes.oneOf(["success", "danger"])
};

export default DismissibleAlert;
