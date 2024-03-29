import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSpotDetails } from '../../store/spots'
import { fetchSpotReviews } from '../../store/reviews'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal'
import DeleteReviewModal from '../DeleteReviewModal'
import GetSpotReviews from '../GetSpotReviews/GetSpotReviews'
import './SpotDetails.css'
import star from '../images/star-vector-icon.jpg'

const SpotDetails = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const sessionUser = useSelector((state) => state.session.user)
  const spot = useSelector((state) => state.spots.spotDetails) || {}
  const reviews = useSelector((state) => state.reviews)
  const reviewArr = Object.values(reviews).reverse()

  let findReview = false
  if (sessionUser) findReview = !reviewArr.find((obj) => obj.userId == sessionUser.id)

  const monthNames = ['January', 'February', 'March,', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const handleReserve = (e) => {
    e.preventDefault()
    alert("Feature coming soon")
  }

  useEffect(() => {
    setIsLoading(true)

    dispatch(getSpotDetails(spotId))
      .then(() => dispatch(fetchSpotReviews(spotId)))
      .then(() => setIsLoading(false))

  }, [dispatch])

  return (
    <div>
      {/* Spot Details */}
      <div>{isLoading ? <h2>...Loading</h2> :
        <div>
          <div className="heading">
            <h1>{spot.name}</h1>
            <h2>Location: {spot.city}, {spot.state}, {spot.country}</h2>
            <div className='image-container'>
              <img className="previewImage" src={spot.previewImage}></img>
              <div>
                {spot.SpotImages.length > 1 ? spot.SpotImages?.map((image) => {
                  return (
                    <div>
                      <img className="small-images" src={image.url}>
                      </img>
                    </div>
                  )
                }) : ""}
              </div>
            </div>
            <div className='summary-container'>
              <div className='description-container'>
                <span>Hosted by: {spot.Owner?.firstName}, {spot.Owner?.lastName}</span>
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



          {/* Reviews Summary */}
          {/* {reviews && <GetSpotReviews {...props} />}*/}
          {<div>
            <img
              className='star'
              style={{ height: 14, width: 14 }}
              src={star}
              alt=''
            />
            <span>{spot.avgRating && spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : "New"}</span>
            {!spot.numReviews ? null : spot.numReviews > 1 ? <span> &#x2022; {spot.numReviews} reviews</span> : <span> &#x2022; {spot.numReviews} review</span>}
          </div>}




          <div className="review-modal-button">
            {sessionUser && findReview && sessionUser.id !== spot.ownerId ?
              <button>
                {<OpenModalMenuItem
                  itemText={"Post Your Review"}
                  // onItemClick={closeMenu}
                  modalComponent={<ReviewFormModal {...spot} />}
                />}
              </button>
              : ""}
          </div>




          <div>
            {!reviewArr.length ? <span>Be the first to post a review!</span> :
              reviewArr.map((review) => {
                return (
                  <div key={reviewArr.id}>
                    <h3>{review.User?.firstName}</h3>
                    <h4>{monthNames[parseInt(review.createdAt?.slice(5, 7)) - 1]} <span>{review.createdAt?.slice(0, 4)}</span></h4>
                    <h5>{review?.review}</h5>
                    {sessionUser && review.userId == sessionUser.id ?
                      <button>
                        <OpenModalMenuItem
                          itemText={"Delete"}
                          modalComponent={<DeleteReviewModal {...review} />}
                        />
                      </button>
                      : ''}
                  </div>
                )
              })}
          </div>


        </div>
      }
      </div>

    </div>
  )
}

export default SpotDetails
