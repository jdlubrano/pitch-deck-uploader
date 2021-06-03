import React from "react";
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import NewPitchDeck from "../NewPitchDeck";
import RouteNotFound from "../RouteNotFound";

const App = props => {
  return (
    <Router>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Pitch Deck Uploader</Link>
        </div>
      </nav>
      <div className="container route-content">
        <Switch>
          <Route path="/pitch_decks/new">
            <NewPitchDeck />
          </Route>
          <Route path="*">
            <RouteNotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
