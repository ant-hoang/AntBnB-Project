// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink, Switch, useHistory, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import GetSpots from '../GetSpots';
import SpotDetails from '../SpotDetails'
import CreateSpot from '../CreateSpot'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory()

  const handleHomeClick = () => {
    history.push("/")
  }

  return (
    <ul>
      <li>
        <NavLink exact to="/" onClick={handleHomeClick}>Home</NavLink>
      </li>
      {isLoaded && (
        <li>
          <NavLink to="/spots/new">
            <button>Create a New Spot</button>
          </NavLink>
        </li>
      )}
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      <Switch>
        <Route exact path="/">
          <GetSpots />
        </Route>
        <Route path={"/spots/new"}>
          <CreateSpot />
        </Route>
        <Route path={`/spots/:spotId`}>
          <SpotDetails />
        </Route>
      </Switch>
    </ul>
  );
}

// how to render just to Spot Details component?
export default Navigation;