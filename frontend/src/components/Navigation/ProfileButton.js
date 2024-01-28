import { useState, useEffect, useRef } from "react";
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const profileClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="menu-icon" onClick={toggleMenu}>
        <i className="fa-solid fa-bars" />
      </button>
      <div className={profileClassName} ref={ulRef}>
        {user ? (
          <>
            <h5>Hello, {user.username}</h5>
            <h5>{user.email}</h5>
            <button>
              <NavLink to='/spots/manage'>
                Manage Spots
              </NavLink>
            </button>
              <button onClick={logout}>Log Out</button>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText={<button className="logs">Log In</button>}
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText={<button className="logs">Sign Up</button>}
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;