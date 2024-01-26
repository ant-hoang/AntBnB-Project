// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink, Switch, useHistory, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import GetSpots from '../GetSpots';
import SpotDetails from '../SpotDetails'
import CreateSpot from '../CreateSpot'
import './Navigation.css';
import FavIcon from '../images/FavIcon.PNG'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory()

  console.log("sessionUser: ", sessionUser)
  return (
    <ul>
      <li>
        <NavLink exact to="/" >
          <img
            style={{ height: 15, width: 25 }}
            src={FavIcon}
            alt='favIcon' />
          <span>Ant-BnB</span>
        </NavLink>
      </li>
      {isLoaded && sessionUser && (
        <li>
          {<NavLink to="/spots/new">
            <button>Create a New Spot</button>
          </NavLink>}
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