import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { fetchDeleteSpot, fetchGetMySpots } from "../../store/spots";
import "./DeleteSpotModal.css";

function DeleteSpotModal(el) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(fetchDeleteSpot(el.id))
      .then(() => dispatch(fetchGetMySpots()))
      .then(closeModal)
  }

  const handleCancel = (e) => {
    e.preventDefault()
    e.stopPropagation()
    closeModal()
  }

  return (
    <div className="delete-container">
      <h1 className="delete-text">Confirm Delete</h1>
      <h3 className="delete-text">Are you sure you want to delete this review?</h3>
      <div className="delete-button red">
        <button className="red-button" onClick={handleDelete}>Yes (Delete Review)</button>
      </div>
      <div className="delete-button gray">
        <button className="gray-button" onClick={handleCancel}>No (Keep Review)</button>
      </div>
    </div>

  )
}

export default DeleteSpotModal