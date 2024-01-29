import { useEffect } from 'react'
import './ManageSpots.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGetMySpots } from '../../store/spots'
import { NavLink } from 'react-router-dom'
import star from '../images/star-vector-icon.jpg'

function ManageSpots() {
  const dispatch = useDispatch()

  const fetchMySpots = useSelector((state) => state.spots.allSpots) || {}
  const spots = Object.values(fetchMySpots)

  useEffect(() => {
    dispatch(fetchGetMySpots())
  }, [dispatch])
  return (
    <div>
      <h1>Manage Spots</h1>
      <div>
        {!spots.length ?
          <NavLink to='/spots/new'>
            <button>Create a New Spot</button>
          </NavLink>
          : <div className="manage-spot-block">
            {spots.map((el) => {
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
                      <span class="tooltiptext">{el.name}</span>
                    </div>
                  </NavLink>
                  <div className="manage-buttons-container">
                    <button className="manage-buttons update">Update</button>
                    <button className="manage-buttons delete">Delete</button>
                  </div>
                </div>
              )
            })}
          </div>}
      </div>
    </div>
  )
}

export default ManageSpots