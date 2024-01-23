import './CreateSpot.css'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createSpot } from '../../store/spots'

const CreateSpot = () => {
  const [address, setAddress] = useState()
  const [city, setCity] = useState()
  const [state, setState] = useState()
  const [country, setCountry] = useState()
  const [lat, setLat] = useState()
  const [lng, setLng] = useState()
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [price, setPrice] = useState()

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
    
  }

  useEffect(() => {

  }, [])
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
          <label htmlFor="description">description</label>
          <input
            id="description"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
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
          <label htmlFor="price">price</label>
          <input
            id="price"
            type="text"
            onChange={(e) => setPrice(+e.target.value)}
            value={price}
          />
        </div>
        <button>Submit</button>
      </form>
    </div>
  )
}

export default CreateSpot