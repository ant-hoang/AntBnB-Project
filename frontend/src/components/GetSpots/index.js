import './GetSpots.css'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, NavLink, useParams } from "react-router-dom"
import { getSpots } from '../../store/spots'
import SpotDetails from '../SpotDetails'

const GetSpots = () => {

  const dispatch = useDispatch();

  const spotState = useSelector((state) => Object.values(state.spots))

  let { spotId } = useParams()

  useEffect(() => {
    dispatch(getSpots())
  }, [dispatch])

  function handleClick(e) {
    e.preventDefault()
    console.log('You clicked submit.')
    alert("CLICKED!");
  }

  // where to set up NavLink or Link and Switch?

  return (
    <div>
      <nav>
        <ul>
          {spotState.map((el) => {
            return (
                <NavLink to={`/spots/${el.id}`} /*is this the right route? */>
                  <li key={el.id}>
                    <img src={el.previewImage} alt="houses"></img>
                    {el.name}
                    {el.description}
                  </li>
                  <button onClick={handleClick}>
                    Link
                  </button>
                </NavLink>
            )
          })}
        <Switch>
          <Route path="/not-logged-in">
            <h1>You Must Be Logged In To Enter</h1>
          </Route>
          <Route path={`/spots/:spotId`}>
            <SpotDetails />
          </Route>
          <Route>
            <h1>Page Not Found</h1>
          </Route>
        </Switch>
        </ul>
      </nav>
    </div>
  )
}

export default GetSpots