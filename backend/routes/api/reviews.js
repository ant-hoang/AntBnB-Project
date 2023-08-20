// backend/routes/api/bookings.js
const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');
const { validateReview } = require('../../utils/validators/reviews')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking } = require('../../db/models');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { Review } = require('../../db/models');

const router = express.Router();

router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
  const { reviewId } = req.params
  const { review, stars } = req.body
  const userId = req.user.id

  try {
    const findReview = await Review.findAll({
      where: {
        id: reviewId,
        userId: userId
      }
    })

    if (!findReview.length) throw new Error("Review couldn\'t be found")

    const editedReview = await findReview[0].update({
      review: review,
      stars: stars
    })

    res.json(editedReview)

  } catch (err) {
    err.status = 404
    return next(err)
  }

})

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params
  const currUserId = req.user.id

  try {
    const findReview = await Review.findByPk(+reviewId)
    if (!findReview) throw new Error('Review couldn\'t be found')
    if(findReview.userId !== +currUserId) {
      const err = new Error('Review does not belong to current user')
      err.status = 403
      err.title = 'Cannot delete review'
      return next(err)
    }

    await findReview.destroy()
    res.json({message: "Successfully deleted"})

  } catch (err) {
    err.status = 404
    err.title = 'Bad Request'
    return next(err)
  }
})

module.exports = router