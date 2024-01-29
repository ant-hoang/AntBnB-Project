import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSpotDetails } from '../../store/spots'
import { fetchSpotReviews } from '../../store/reviews'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal'
import GetSpotReviews from '../GetSpotReviews/GetSpotReviews'
import './SpotDetails.css'
import star from '../images/star-vector-icon.jpg'

const SpotDetails = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const monthNames = ['January', 'February', 'March,', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']



  // // checks if user has submitted a review

  const [checkUser, setCheckUser] = useState(0)
  // console.log("checkUser:", checkUser)

  // // // checks if user owns the spot
  const [checkOwner, setOwnerUser] = useState(false)
  // const checkOwner = (session.user && session.user.id === spot.ownerId) ? true : false
  // console.log("CHECKOWNER: ", checkOwner)





  const handleReserve = (e) => {
    e.preventDefault()
    alert("Feature coming soon")
  }

  useEffect(() => {
    setIsLoading(true)
    if (session.user) {
      setOwnerUser((session.user.id == spot.ownerId))
    }
    if (session.user && reviewArr.length) {
      setCheckUser(reviewArr.findIndex((obj) => obj.userId == session.user.id) + 1)
    }


    dispatch(getSpotDetails(spotId))
      .then(() => dispatch(fetchSpotReviews(spotId)))
      .then(() => setIsLoading(false))

    return
  }, [dispatch, spotId])

  const session = useSelector((state) => state.session)
  const spot = useSelector((state) => state.spots.spotDetails)
  const reviews = useSelector((state) => state.reviews.spotReviews) || {}
  const reviewArr = Object.values(reviews).reverse() || []
  let props = { checkUser, setCheckUser }

  return (
    <div>
      {/* Spot Details */}


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
                  alt=''
                />
                {spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : "New"}
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


      {/* Reviews Summary */}
      {isLoading ? <h2></h2> : <div>
        {/* {reviews && <GetSpotReviews {...props} />}*/}




        <div>
          <img
            className='star'
            style={{ height: 14, width: 14 }}
            src={star}
            alt=''
          />
          <span>{spot.avgRating && spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : "New"}</span>
          {!spot.numReviews ? null : spot.numReviews > 1 ? <span> &#x2022; {spot.numReviews} reviews</span> : <span> &#x2022; {spot.numReviews} review</span>}
        </div>
      </div>}




      {isLoading ? <h2></h2> : <div className="review-modal-button">
        {session.user && !checkUser && !checkOwner && <OpenModalMenuItem
          itemText={<button>Post Your Review</button>}
          // onItemClick={closeMenu}
          modalComponent={<ReviewFormModal {...props} />}
        />}

      </div>}





      {isLoading ? <h2></h2> : <div>
        {!reviewArr.length ? <span>Be the first to post a review!</span> :
          reviewArr.map((review) => {
            return (
              <div key={reviewArr.id}>
                <h3>{review.User.firstName}</h3>
                <h4>{monthNames[parseInt(review.createdAt.slice(5, 7)) - 1]} <span>{review.createdAt.slice(0, 4)}</span></h4>
                <h5>{review.review}</h5>
              </div>
            )
          })}
      </div>}



    </div>
  )
}

export default SpotDetails
