import React, { useEffect, useRef } from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';
import axios from 'axios'
const Menu = ({ isOpen, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [onClose]);
  const handleDelete = async (e) => {
    const deleteAccount = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const config = {
            method: "delete",
            url: "http://localhost:8080/api/users",
            headers: { "Content-Type": "application/json", "x-access-token": token },
          };
          await axios(config);
          localStorage.removeItem("token")
          window.location.reload();
        } catch (error) {
          if (error.response && error.response.status >= 400 && error.response.status <= 500) {
            localStorage.removeItem("token");
            window.location.reload();
          }
        }
      }
    }
    if (window.confirm("Are you sure?")) {
      deleteAccount();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href ='/'
}
  return (
    <div className={`menu ${isOpen ? 'open' : ''}`} ref={menuRef}>

      <ul className="menu-list">
        <li>
          <Link to={`/`}>
            <button className="menu-btn">
              <img src={process.env.PUBLIC_URL + "/main.svg"} alt="SVG logo image" />MAIN PAGE
            </button>
          </Link>
        </li>
        <li>
          <Link to={`/Profile`}>
            <button className="menu-btn">
              <img className="smaller"src={process.env.PUBLIC_URL + "/profile3.svg"} alt="SVG logo image" />PROFILE
            </button>
          </Link>
        </li>
        <li>
          <Link to={`/Statistics`}>
            <button className="menu-btn">
              <img src={process.env.PUBLIC_URL + "/stats.svg"} alt="SVG logo image" />STATISTICS
            </button>
          </Link>
        </li>
        <li>
        <Link to={`/Community`}>
          <button className="menu-btn">
            <img src={process.env.PUBLIC_URL + "/community.svg"} alt="SVG logo image" />COMMUNITY
          </button>
          </Link>
        </li>
          <hr></hr>
          <li>
          <button className="menu-btn" onClick={handleDelete}>
            <img src={process.env.PUBLIC_URL + "/delete.svg"} alt="SVG logo image" /> DELETE ACC.
          </button>
        </li>
        <li>
          <button className="menu-btn" onClick={handleLogout}>
          <img src={process.env.PUBLIC_URL + "/logout.svg"} alt="SVG logo image" /> LOGOUT
          </button>
        </li>
      </ul>

    </div>
  );
};

export default Menu;
