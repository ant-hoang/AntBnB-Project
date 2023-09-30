// backend/routes/api/bookings.js
const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ReviewImage } = require('../../db/models');
const { Review } = require('../../db/models');

const router = express.Router();


// delete an image from a review
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params
  const currUserId = req.user.id

  try {
    const findReviewImage = await ReviewImage.findByPk(+imageId)
    if (!findReviewImage) throw new Error('Review image not found')

    const findReview = await Review.findOne({ where: { id: findReviewImage.reviewId } })
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

module.exports = router