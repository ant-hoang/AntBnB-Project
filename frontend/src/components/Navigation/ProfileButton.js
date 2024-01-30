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

  const handleDemo = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential: "Demo-lition", password: "password"}))
  }

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
    <div className="menu-position">
      <button className="menu-icon" onClick={toggleMenu}>
        <i className="fa-solid fa-bars" />
      </button>
    </div>
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
            <div className="menu-buttons">
              <button className="logs">
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </button>
              <button className="logs">
                <OpenModalMenuItem
                  itemText={"Sign Up"}
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </button>
              <button className="demo-log" onClick={(handleDemo)}>Log in as Demo User</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;