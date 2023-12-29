import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSpotDetails } from '../../store/spots'
import './SpotDetails.css'

const SpotDetails = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  const id = parseInt(spotId)
  let spot = useSelector((state) => state.spots.id)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(getSpotDetails())
      .then(() => setIsLoaded(true))
    if (isLoaded) console.log(spot)
  }, [dispatch, id])


  return (
    <div>
      <h1>
        Hello From Spot Details Component
      </h1>
      {/* <ul>
        <li>
          {spot.name}
          {spot.address}
          {spot.country}
          {spot.state}
          {spot.city}
          {spot.avgRating}
          {spot.description}
          {spot.price}
        </li>
      </ul> */}
    </div>
  )
}

export default SpotDetails
