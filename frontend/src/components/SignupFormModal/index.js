import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1 className="signup-h1">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        {errors.username && <p>{errors.username}</p>}
        <label className="signup-label">
          <input
            className="signup-input"
            type="text"
            value={firstName}
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>

        {errors.firstName && <p>{errors.firstName}</p>}
        <label className="signup-label">
          <input
            className="signup-input"
            type="text"
            value={lastName}
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        <label className="signup-label">
          <input
            className="signup-input"
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {errors.email && <p>{errors.email}</p>}
        <label className="signup-label">
          <input
            className="signup-input"
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        {errors.lastName && <p>{errors.lastName}</p>}
        <label className="signup-label">
          <input
            className="signup-input"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {errors.password && <p>{errors.password}</p>}
        <label className="signup-label">
          <input
            className="signup-input"
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}

        <button className="signup-button" type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;