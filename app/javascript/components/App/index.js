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
import PitchDecksIndex from "../PitchDecksIndex";
import ShowPitchDeck from "../ShowPitchDeck";
import RouteNotFound from "../RouteNotFound";

const App = props => {
  return (
    <Router>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Pitch Deck Uploader</Link>
        </div>
      </nav>
      <div className="container route-content pt-4">
        <Switch>
          <Route exact path="/">
            <PitchDecksIndex />
          </Route>
          <Route path="/pitch_decks/new">
            <NewPitchDeck />
          </Route>
          <Route path="/pitch_decks/:id">
            <ShowPitchDeck />
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
