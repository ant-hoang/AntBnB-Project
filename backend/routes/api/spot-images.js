// backend/routes/api/spots.js
const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');

const router = express.Router();


// delete an image from a spot
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params
  const currUserId = req.user.id


  try {
    const getSpotImage = await SpotImage.findByPk(+imageId)
    if (!getSpotImage) throw new Error('Spot Image couldn\'t be found')

    const getSpot = await Spot.findByPk(getSpotImage.spotId)
    if (getSpot.ownerId !== +currUserId) {
      const err = new Error('Forbidden')
      err.status = 403
      return next(err)
    }

    await getSpotImage.destroy()

    res.json({ message: "Successfully deleted" })

  } catch (err) {
    err.status = 404;
    return next(err);
  }
})

module.exports = router