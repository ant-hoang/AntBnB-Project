import './GetSpotReviews.css'
import star from '../images/star-vector-icon.jpg'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from "react-router-dom"
import { fetchGetSpots } from '../../store/spots'

const GetSpotReviews = ({ session, spot, reviews }) => {
  console.log("SESSION: ", session)
  console.log("SPOT: ", spot)
  console.log("REVIEWS: ", reviews)
  const reviewArr = Object.values(reviews).reverse() || []
  console.log("REVIEWSARRRR: ", reviewArr)
  const checkUser = reviewArr.find((obj) => obj.userId == session.user.id)

  console.log(checkUser)

  const monthNames = ['January', 'February', 'March,', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <div>
      <div className='header'>
        <img
          className='star'
          style={{ height: 14, width: 14 }}
          src={star}
          alt='star'
        />
        {!spot.avgRating ? <span>New</span> :
          <span> {spot.avgRating} &#x2022; {spot.numReviews > 1 ? <span>{spot.numReviews} reviews</span> : <span>{spot.numReviews} review</span>} </span>}
      </div>
      <div>
          {session.user && !checkUser && <button>Post Your Review</button>}
      </div>
      <div>
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
      </div>
    </div>

  )
}

export default GetSpotReviews