import './CreateSpot.css'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createSpot } from '../../store/spots'
import { createImage } from '../../store/images'
import { useHistory } from 'react-router-dom'


const CreateSpot = () => {
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [previewImage, setPreviewImage] = useState("")
  const [image2, setImage2] = useState("")
  const [image3, setImage3] = useState("")
  const [image4, setImage4] = useState("")
  const [image5, setImage5] = useState("")
  const [errors, setErrors] = useState([])

  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors([])
    const errorList = checkErrors(address, city, state, country, lat, lng, name, description, price, previewImage)
    setErrors(errorList)
    if (errors.length) return

    const payload = {
      address,
      city,
      state,
      country,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name,
      description,
      price: parseFloat(price)
    }

    const images = settingImages(previewImage, image2, image3, image4, image5)

    dispatch(createSpot(payload))
      .then((spot) => {
        for (let i = 0; i < images.length; i++) {
          let currObj = images[i]
          if (currObj.url) {
            dispatch(createImage(currObj, spot.id))
          }
        }
        history.push(`/spots/${spot.id}`)
      })

    reset()
  }

  const checkErrors = (address, city, state, country, lat, lng, name, description, price, previewImage) => {
    const errorList = []
    if (!country) errorList.push('Country is required')
    if (!address) errorList.push('Address is required')
    if (!city) errorList.push('City is required')
    if (!state) errorList.push('State is required')
    if (!lat) errorList.push('Latitude is required')
    if (!lng) errorList.push('Longitude is required')
    if (!description || description.length < 30) errorList.push('Description needs 30 or more characters')
    if (!name) errorList.push('Name is required')
    if (!price) errorList.push('Price is required')
    if (!previewImage) errorList.push('Preview image is required')

    return errorList
  }

  const settingImages = (i1, i2, i3, i4, i5) => {
    const images = []
    images.push({ "url": i1, "preview": true })
    images.push({ "url": i2, "preview": false })
    images.push({ "url": i3, "preview": false })
    images.push({ "url": i4, "preview": false })
    images.push({ "url": i5, "preview": false })
    return images
  }

  const reset = () => {
    setAddress("")
    setCity("")
    setState("")
    setCountry("")
    setLat("")
    setLng("")
    setName("")
    setDescription("")
    setPrice("")
    setPreviewImage("")
    setImage2("")
    setImage3("")
    setImage4("")
    setImage5("")
  }

  return (
    <div>
      <ul className='errors'>
        {errors.length ? errors.map((error) => <li key={error}>{error}</li>) : ''}
      </ul>
      <h1>Create a New Spot</h1>
      <h2>Where's your place located?</h2>
      <caption>Guests will only get your exact address once they booked a reservation.</caption>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            placeholder='Country'
            onChange={(e) => setCountry(e.target.value)}
            value={country}
          />
        </div>
        <div>
          <label htmlFor="address">address</label>
          <input
            id="address"
            type="text"
            placeholder='Address'
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />
        </div>
        <div>
          <label htmlFor="city">city</label>
          <input
            id="city"
            type="text"
            placeholder='City'
            onChange={(e) => setCity(e.target.value)}
            value={city}
          />
        </div>
        <div>
          <label htmlFor="state">state</label>
          <input
            id="state"
            type="text"
            placeholder='STATE'
            onChange={(e) => setState(e.target.value)}
            value={state}
          />
        </div>
        <div>
          <label htmlFor="lat">lat</label>
          <input
            id="lat"
            type="text"
            placeholder='Latitude'
            onChange={(e) => setLat(e.target.value)}
            value={lat}
          />
        </div>
        <div>
          <label htmlFor="lng">lng</label>
          <input
            id="lng"
            type="text"
            placeholder='Longitude'
            onChange={(e) => setLng(e.target.value)}
            value={lng}
          />
        </div>
        <div>
          <h2>Describe your place to guests</h2>
          <caption>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</caption>
        </div>
        <div>
          <input
            id="description"
            type="text"
            placeholder='Description'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <div>
          <h2>Create a title for your spot</h2>
          <caption>Catch guest' attention with a spot title that highlights what makes your space special.</caption>
        </div>
        <div>
          <input
            id="name"
            type="text"
            placeholder='Name of your spot'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div>
          <h2>Set a base price for your spot</h2>
          <caption>Competitive pricing can help your listing stand out and rank higher in search results.</caption>
        </div>
        <div>
          <input
            id="price"
            type="text"
            placeholder='Price per night (USD)'
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
        </div>
        <div>
          <h2>Liven up your spot with photos</h2>
          <caption>Submit a link to at least one photo to publish your spot</caption>
        </div>
        <div>
          <div>
            <input
              id="image-1"
              type="text"
              placeholder='Preview Image Url'
              onChange={(e) => setPreviewImage(e.target.value)}
              value={previewImage}
            />
          </div>
          <div>
            <input
              id="image-2"
              type="text"
              placeholder='Image URL'
              onChange={(e) => setImage2(e.target.value)}
              value={image2}
            />
          </div>
          <div>
            <input
              id="image-3"
              type="text"
              placeholder='Image URL'
              onChange={(e) => setImage3(e.target.value)}
              value={image3}
            />
          </div>
          <div>
            <input
              id="image-4"
              type="text"
              placeholder='Image URL'
              onChange={(e) => setImage4(e.target.value)}
              value={image4}
            />
          </div>
          <div>
            <input
              id="image-5"
              type="text"
              placeholder='Image URL'
              onChange={(e) => setImage5(e.target.value)}
              value={image5}
            />
          </div>
        </div>
        <button>Create Spot</button>
      </form>
    </div>
  )
}

export default CreateSpot