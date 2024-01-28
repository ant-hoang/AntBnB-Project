import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSpotDetails } from '../../store/spots'
import { fetchSpotReviews } from '../../store/reviews'
import GetSpotReviews from '../GetSpotReviews/GetSpotReviews'
import './SpotDetails.css'
import star from '../images/star-vector-icon.jpg'

const SpotDetails = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  let session = useSelector((state) => state.session)
  let spot = useSelector((state) => state.spots.spotDetails)
  let reviews = useSelector((state) => state.reviews.spotReviews)
  let props = { session, spot, reviews }



  // const reviewArr = Object.values(reviews).reverse() || []
  // // checks if user has submitted a review
  // const checkUser = session.user ? reviewArr.find((obj) => obj.userId == session.user.id) : false

  // // checks if user owns the spot
  // const checkOwner = (session.user && session.user.id == spot.ownerId) ? true : false

  // const monthNames = ['January', 'February', 'March,', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']



  const handleReserve = (e) => {
    e.preventDefault()
    alert("Feature coming soon")
  }

  useEffect(() => {
    setIsLoading(true)
    dispatch(getSpotDetails(spotId))
      .then(() => dispatch(fetchSpotReviews(spotId)))
      .then(() => setIsLoading(false))
  }, [dispatch, spotId])

  return (
    <div>
      <div>{isLoading ? <h2>...Loading</h2> :
        <div className="heading">
          <h1>{spot.name}</h1>
          <h2>Location: {spot.city}, {spot.state}, {spot.country}</h2>
          <img className="previewImage" src={spot.previewImage}></img>
          {/*imaging smaller images here coming soon */}
          <div className='summary-container'>
            <div className='description-container'>
              <span>Hosted by: {spot.Owner.firstName}, {spot.Owner.lastName}</span>
              <p>{spot.description}</p>
            </div>
            <div className='callout-container'>
              <div className='callout-info'>
                <span>${spot.price.toFixed(2)} night</span>
                <img
                  className='star'
                  style={{ height: 14, width: 14 }}
                  src={star}
                  alt='star'
                />
                <span>{spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : "New"}</span>
                {!spot.numReviews ? null : spot.numReviews > 1 ? <span>{spot.numReviews} reviews</span> : <span>{spot.numReviews} review</span>}
              </div>
              <div className='reserve-button'>
                <button onClick={handleReserve}>
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      </div>
      <div>
        {reviews && <GetSpotReviews {...props} />}
      </div>
    </div>
  )
}

export default SpotDetails
