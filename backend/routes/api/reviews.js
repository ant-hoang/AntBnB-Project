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
const { ReviewImage } = require('../../db/models');
const { Review } = require('../../db/models');

const router = express.Router();

// add an image to a review
// delete an image from a review
router.delete('/:reviewId/images/:imageId', requireAuth, async (req, res, next) => {
  const { reviewId, imageId } = req.params
  const currUserId = req.user.id

  try {
    const findReviewImage = await ReviewImage.findAll({ where: { id: imageId } })
    if (!findReviewImage.length) throw new Error('Review image not found')
    if (findReviewImage[0].userId !== +currUserId) {
      const err = new Error('Review image does not belong to current user')
      err.status = 403
      err.title = 'Cannot delete review image'
      return next(err)
    }

    await findReviewImage[0].destroy()

    res.json({message: "Successfully deleted"})

  } catch (err) {
    err.status = 404
    err.title = 'Bad Request'
    return next(err)
  }
})

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params
  const currUserId = req.user.id
  const { url } = req.body

  try {
    const findReview = await Review.findByPk(+reviewId)
    if (!findReview) throw new Error('Review couldn\'t be found')
    if (findReview.userId !== +currUserId) {
      const err = new Error('Review does not belong to current user')
      err.status = 403
      err.title = 'Cannot add image to review'
      return next(err)
    }

    const numReviewImages = await ReviewImage.findAll({ where: { reviewId: reviewId } })
    if (numReviewImages.length > 10) {
      const err = new Error('Maximum number of images for this resource was reached')
      err.status = 403
      err.title = 'Cannot add image to review'
      return next(err)
    }

    const createReviewImage = await ReviewImage.create({ reviewId, url })

    res.json(createReviewImage)

  } catch (err) {
    err.status = 404
    err.title = 'Bad request'
    return next(err)
  }



})


// edit a review
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

// delete a review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params
  const currUserId = req.user.id

  try {
    const findReview = await Review.findByPk(+reviewId)
    if (!findReview) throw new Error('Review couldn\'t be found')
    if (findReview.userId !== +currUserId) {
      const err = new Error('Review does not belong to current user')
      err.status = 403
      err.title = 'Cannot delete review'
      return next(err)
    }

    await findReview.destroy()
    res.json({ message: "Successfully deleted" })

  } catch (err) {
    err.status = 404
    err.title = 'Bad Request'
    return next(err)
  }
})

module.exports = router