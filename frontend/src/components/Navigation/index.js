// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink, Switch, useHistory, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import GetSpots from '../GetSpots';
import SpotDetails from '../SpotDetails'
import CreateSpot from '../CreateSpot'
import ManageSpots from '../ManageSpots';
import SpotUpdate from '../SpotUpdate';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const navigationClass = "navigation-" + (sessionUser ? "w-user" : "wo-user")
  const createSpotClassName = "create-spot" + (sessionUser ? "" : " hidden")

  return (
    <>
      <div className={navigationClass}>
        <div className="home-link">
          <NavLink exact to="/" >
            <i className="fa-solid fa-house" />
            <span>Ant-BnB</span>
          </NavLink>
        </div>

        {isLoaded && (
          <div className={createSpotClassName}>
            {<NavLink to="/spots/new">
              <button className='create-spot-button'>Create a New Spot</button>
            </NavLink>}
          </div>
        )}

        {isLoaded && (
          <div className='navigation-profile-button'>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
      <Switch>
        <Route exact path="/">
          <GetSpots />
        </Route>
        <Route path={"/spots/new"}>
          <CreateSpot />
        </Route>
        <Route path={"/spots/manage"}>
          <ManageSpots />
        </Route>
        <Route path={"/spots/:spotId/edit"}>
          <SpotUpdate />
        </Route>
        <Route path={"/spots/:spotId"}>
          <SpotDetails />
        </Route>
      </Switch>

    </>
  );
}

// how to render just to Spot Details component?
export default Navigation;