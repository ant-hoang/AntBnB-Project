// backend/routes/api/bookings.js
const express = require('express');
const { validateReview } = require('../../utils/validators/reviews')
const { requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { ReviewImage } = require('../../db/models');
const { Review } = require('../../db/models');

const router = express.Router();

// get current user reviews
router.get('/current', requireAuth, async (req, res, _next) => {
  const { user } = req
  const myReviews = await Review.findAll({
    where: {
      userId: user.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  })

  let reviews = []

  for (let i = 0; i < myReviews.length; i++) {
    const review = myReviews[i].toJSON()
    const spot = await Spot.findOne({ where: { id: review.spotId }, attributes: { exclude: ['createdAt', 'updatedAt', 'description'] } })
    const spotImage = await SpotImage.findOne({
      where: { spotId: spot.id, preview: true }
    })

    if (spotImage) {
      spot.dataValues.previewImage = spotImage.dataValues.url
    }

    review.Spot = spot.toJSON()

    reviews.push(review)
  }

  res.json({ Reviews: reviews })
})

// delete an image from a review
router.delete('/:reviewId/images/:imageId', requireAuth, async (req, res, next) => {
  const { reviewId, imageId } = req.params
  const currUserId = req.user.id

  try {
    const findReviewImage = await ReviewImage.findOne({ where: { id: imageId, reviewId: reviewId } })
    const findReview = await Review.findOne({ where: { id: reviewId } })

    if (!findReviewImage) throw new Error('Review image not found')
    if (findReview.userId !== +currUserId) {
      const err = new Error('Forbidden')
      err.status = 403
      return next(err)
    }

    await findReviewImage.destroy()

    res.json({ message: "Successfully deleted" })

  } catch (err) {
    err.status = 404
    return next(err)
  }
})

// add an image to a review
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params
  const currUserId = req.user.id
  const { url } = req.body

  try {
    const findReview = await Review.findByPk(+reviewId)
    if (!findReview) throw new Error('Review couldn\'t be found')
    if (findReview.userId !== +currUserId) {
      const err = new Error('Forbidden')
      err.status = 403
      return next(err)
    }

    const numReviewImages = await ReviewImage.findAll({ where: { reviewId: reviewId } })
    if (numReviewImages.length > 9) {
      const err = new Error('Maximum number of images for this resource was reached')
      err.status = 403
      return next(err)
    }

    const createReviewImage = await ReviewImage.create({ reviewId, url })

    res.json(createReviewImage)

  } catch (err) {
    err.status = 404
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
      }
    })

    if (!findReview.length) throw new Error("Review couldn\'t be found")
    if (findReview[0].userId !== +userId) {
      const err = new Error('Forbidden')
      err.status = 403
      return next(err)
    }

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
      const err = new Error('Forbidden')
      err.status = 403
      return next(err)
    }

    await findReview.destroy()
    res.json({ message: "Successfully deleted" })

  } catch (err) {
    err.status = 404
    return next(err)
  }
})

module.exports = router