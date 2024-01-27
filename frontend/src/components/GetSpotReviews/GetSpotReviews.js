import './GetSpotReviews.css'
import star from '../images/star-vector-icon.jpg'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from "react-router-dom"
import { fetchGetSpots } from '../../store/spots'
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import LoginFormModal from '../LoginFormModal'
import SignupFormModal from '../SignupFormModal'

const GetSpotReviews = ({ session, spot, reviews }) => {
  const reviewArr = Object.values(reviews).reverse() || []
  const [showMenu, setShowMenu] = useState(false)
  // checks if user has submitted a review
  const checkUser = session.user ? reviewArr.find((obj) => obj.userId == session.user.id) : false

  // checks if user owns the spot
  const checkOwner = (session.user && session.user.id == spot.ownerId) ? true : false

  const monthNames = ['January', 'February', 'March,', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dispatch = useDispatch()

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };


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
        {session.user && !checkUser && !checkOwner && <OpenModalMenuItem
          itemText={<button>Post Your Review</button>}
          onItemClick={closeMenu}
          modalComponent={<LoginFormModal />}
        />}
        
      </div>
      {/* {session.user && !checkUser && !checkOwner &&} */}



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