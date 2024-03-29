import './GetSpots.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from "react-router-dom"
import { fetchGetSpots } from '../../store/spots'
import star from '../images/star-vector-icon.jpg'

const GetSpots = () => {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchGetSpots())
      .then(() => setIsLoading(false))
  }, [dispatch])

  const spotState = useSelector((state) => state.spots.allSpots) || {}
  const spots = Object.values(spotState)

  return (
    <div className="spot-container">
      <nav>
        {isLoading ? <h2>...Loading</h2> : spots.map((el) => {
          return (
            <div className="spot-block" key={el.id}>
              <NavLink to={`/spots/${el.id}`}>
                <div className='spot'>
                  <img src={el.previewImage} alt="houses" className='spotImages'></img>
                  <div className='spot-description'>
                    <div className="location-rating-container">
                      <span>{el.city}, {el.state}</span>
                      <div className='star-rating-container'>
                        {el.avgRating ? <img
                          className='star'
                          style={{ height: 14, width: 14 }}
                          src={star}
                          alt='star'
                        /> : ''}
                        <span>{el.avgRating ? parseFloat(el.avgRating).toFixed(1) : "New"}</span>
                      </div>
                    </div>
                    <span>${el.price} night</span>
                  </div>
                  <span className="tooltiptext">{el.name}</span>
                </div>
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