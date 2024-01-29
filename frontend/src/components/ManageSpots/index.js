import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './ManageSpots.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGetMySpots } from '../../store/spots'
import star from '../images/star-vector-icon.jpg'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteSpotModal from '../DeleteSpotModal'

function ManageSpots() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  const fetchMySpots = useSelector((state) => state.spots.allSpots) || {}
  const spots = Object.values(fetchMySpots)

  const handleUpdate = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("what does e have", e)

  }

  useEffect(() => {
    setIsLoading(true)
    dispatch(fetchGetMySpots()).then(() => setIsLoading(false))
  }, [dispatch])

  return (
    <div>

      {isLoading ? <h2>...Loading</h2> : <div>
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
                      <button onClick={handleUpdate} className="manage-buttons update">
                      {<NavLink to={`/spots/${el.id}/edit`}>
                          Update
                        </NavLink>}
                      </button>
                      <button className="manage-buttons delete">
                        <OpenModalMenuItem
                          itemText="Delete"
                          modalComponent={<DeleteSpotModal {...el} />}
                        />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>}
        </div>
      </div>}
    </div>
  )
}

export default ManageSpots