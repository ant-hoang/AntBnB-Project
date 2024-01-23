import './GetSpots.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from "react-router-dom"
import { fetchGetSpots } from '../../store/spots'

const GetSpots = () => {

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)

  const spotState = useSelector((state) => state.spots.allSpots)
  const spots = Object.values(spotState)

  useEffect(() => {
    dispatch(fetchGetSpots())
  }, [])

  // function handleClick(e) {
  //   e.preventDefault()
  //   console.log('You clicked submit.')
  //   alert("CLICKED!");
  // }

  return (
    <div className="spot-container">
      <nav>
        {spots && spots.map((el) => {
          return (
            <div className="spot-block">
              <NavLink to={`/spots/${el.id}`}>
                <div key={el.id} className='spot'>
                  <img src={el.previewImage} alt="houses" className='spotImages'></img>
                  <div className='spot-description'>
                    <span>{el.city}, </span>
                    <span>{el.state}, </span>
                    <span>{el.avgRating ? el.avgRating : "New"}, </span>
                    <span>${el.price} per Night</span>
                  </div>
                  <span class="tooltiptext">{el.name}</span>
                </div>
                {/* <button onClick={handleClick}>
                Link
              </button> */}
              </NavLink>
            </div>
          )
        })}
        {/* <Switch>
          <Route path="/not-logged-in">
            <h1>You Must Be Logged In To Enter</h1>
          </Route>
          <Route path={`/spots/:spotId`}>
            <SpotDetails />
          </Route>
          <Route>
            <h1>Page Not Found</h1>
          </Route>
        </Switch> */}
      </nav>
    </div>
  )
}

export default GetSpots