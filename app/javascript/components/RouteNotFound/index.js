import React from "react";
import { Link } from "react-router-dom";

const RouteNotFound = props => {
  return (
    <p className="lead text-center">
      Sorry but we couldn't find the page that you requested.  Your best bet
      is to go back to the <Link to="/">homepage</Link>.
    </p>
  );
};

export default RouteNotFound;
