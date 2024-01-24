import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSpotDetails } from '../../store/spots'
import './SpotDetails.css'

const SpotDetails = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  let spot = useSelector((state) => state.spots.spotDetails)

  const handleReserve = (e) => {
    e.preventDefault()
    alert("Feature coming soon")
  }

  useEffect(() => {
    setIsLoading(true)
    dispatch(getSpotDetails(spotId)).then(() => setIsLoading(false))
  }, [dispatch, spotId])

  console.log("SPOT DETAILS:", spot)

  return (
    <div>
      <div>
        <h1>
          Hello From Spots Components
        </h1>
      </div>
      <div>{isLoading ? <h2>...Loading</h2> :
        <div className="heading">
          <h1>{spot.name}</h1>
          <h2>Location: {spot.city}, {spot.state}, {spot.country}</h2>
          <img src={spot.previewImage}></img>
          {/*imaging smaller images here coming soon */}
          <div>
            <span>Hosted by: {spot.Owner.firstName}, {spot.Owner.lastName}</span>
            <p>{spot.description}</p>
          </div>
          <button onClick={handleReserve}>
            Reserve
          </button>
        </div>
      }
      </div>
    </div>
  )
}

export default SpotDetails
