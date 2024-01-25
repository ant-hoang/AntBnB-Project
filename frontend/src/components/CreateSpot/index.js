import './CreateSpot.css'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createSpot } from '../../store/spots'

const CreateSpot = () => {
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(null)
  const [previewImage, setPreviewImage] = useState("")

  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    }

    console.log("PAYLOAD:", payload)

    reset()
  }

  const reset = () => {
    setAddress("")
    setCity("")
    setState("")
    setCountry("")
    setLat(null)
    setLng(null)
    setName("")
    setDescription("")
    setPrice(null)
  }
  // images into an array



  return (
    <div>
      <h1>Create a New Spot</h1>
      <h2>Where's your place located?</h2>
      <caption>Guests will only get your exact address once they booked a reservation.</caption>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            onChange={(e) => setCountry(e.target.value)}
            value={country}
          />
        </div>
        <div>
          <label htmlFor="address">address</label>
          <input
            id="address"
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />
        </div>
        <div>
          <label htmlFor="city">city</label>
          <input
            id="city"
            type="text"
            onChange={(e) => setCity(e.target.value)}
            value={city}
          />
        </div>
        <div>
          <label htmlFor="state">state</label>
          <input
            id="state"
            type="text"
            onChange={(e) => setState(e.target.value)}
            value={state}
          />
        </div>
        <div>
          <label htmlFor="lat">lat</label>
          <input
            id="lat"
            type="text"
            onChange={(e) => setLat(+e.target.value)}
            value={lat}
          />
        </div>
        <div>
          <label htmlFor="lng">lng</label>
          <input
            id="lng"
            type="text"
            onChange={(e) => setLng(+e.target.value)}
            value={lng}
          />
        </div>
        <div>
          <h2>Describe your place to guests</h2>
          <caption>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</caption>
        </div>
        <div>
          <label htmlFor="description">description</label>
          <input
            id="description"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <div>
          <h2>Create a title for your spot</h2>
          <caption>Catch guest' attention with a spot title that highlights what makes your space special.</caption>
        </div>
        <div>
          <label htmlFor="name">name</label>
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div>
          <h2>Set a base price for your spot</h2>
          <caption>Competitive pricing can help your listing stand out and rank higher in search results.</caption>
        </div>
        <div>
          <label htmlFor="price">price</label>
          <input
            id="price"
            type="text"
            onChange={(e) => setPrice(+e.target.value)}
            value={price}
          />
        </div>
        <div>
          <h2>Liven up your spot with photos</h2>
          <caption>Submit a link to at least one photo to publish your spot</caption>
        </div>
        <div>
          {/* Preview Image Form */}
          <div>
            <input
              id="image"
              type="text"
              placeholder='Preview Image Url'
              onChange={(e) => setPreviewImage(e.target.value)}
              value={previewImage}
            />
          </div>
          <div>
            <input
              id="image"
              type="text"
              placeholder='Preview Image Url'
              onChange={(e) => setPreviewImage(e.target.value)}
              value={previewImage}
            />
          </div>
          <div>
            <input
              id="image"
              type="text"
              placeholder='Preview Image Url'
              onChange={(e) => setPreviewImage(e.target.value)}
              value={previewImage}
            />
          </div>
          <div>
            <input
              id="image"
              type="text"
              placeholder='Preview Image Url'
              onChange={(e) => setPreviewImage(e.target.value)}
              value={previewImage}
            />
          </div>
          <div>
            <input
              id="country"
              type="text"
              placeholder='Preview Image Url'
              onChange={(e) => setPreviewImage(e.target.value)}
              value={previewImage}
            />
          </div>
        </div>
        <button>Create Spot</button>
      </form>
    </div>
  )
}

export default CreateSpot