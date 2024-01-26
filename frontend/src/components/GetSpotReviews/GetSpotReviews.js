import './GetSpotReviews.css'
import star from '../images/star-vector-icon.jpg'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from "react-router-dom"
import { fetchGetSpots } from '../../store/spots'

const GetSpotReviews = ({ spot, reviews }) => {
  console.log("SPOT: ", spot)
  console.log("REVIEWS: ", reviews)
  const reviewArr = Object.values(reviews) || []
  console.log("REVIEWSARRRRR: ", reviewArr)


  const monthNames = ['January', 'February', 'March,', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  console.log(monthNames.length)
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
        {!reviewArr.length ? <span>Be the first to post a review!</span> :
          reviewArr.map((review) => {
            return (
              <div key={reviewArr.id}>
                <h3>{review.User.firstName}</h3>
                <h4>{monthNames[parseInt(review.createdAt.slice(5, 7)) - 1]} {/*need to figure out how to just get month */}</h4>
              </div>
            )
          })}
      </div>
    </div>

  )
}

export default GetSpotReviews