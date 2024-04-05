import { React, useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaRegUserCircle,
  FaPlus,
  FaInstagram,
  FaTelegramPlane,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import Signup from "./Signup";
import CreateGroupForm from "./CreateGroupForm";
import logo from "../assets/typewriter.jpg";
import { Link } from "react-router-dom";

function Navbar() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [error, setError] = useState(null);

  const openSignupModal = () => {
    setIsSignupOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupOpen(false);
  };

  const handleOpenClick = () => {
    openSignupModal();
  };
  const openGroupModal = () => {
    setIsGroupFormOpen(true);
  };

  const closeGroupModal = () => {
    setIsGroupFormOpen(false);
  };

  const handleOpenGroupForm = () => {
    openGroupModal();
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false);
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/">
          <img className="logo" src={logo} />
        </Link>

        {!isNavbarOpen ? (
          <FaBars
            className="nav-hamburger"
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          />
        ) : (
          <div className="side-navbar">
            <FaTimes
              className="close-navbar-icon"
              onClick={() => setIsNavbarOpen(false)}
            />
            <div className="search-input">
              <label htmlFor="searchbar" className="search-icon">
                <FaSearch />
              </label>
              <input
                type="text"
                id="searchbar"
                className="searchbar"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="جستجو..."
              />
            </div>
            <div className="user-links-container">
              <div className="user-links">
                <FaRegUserCircle />
                <Link
                  to={"u/placeholder-user"}
                  onClick={closeNavbar}
                  className="user-links-text"
                >
                  پروفایل من
                </Link>
              </div>
              <div className="user-links">
                <HiOutlineUserGroup />
                <Link
                  to={"/all-groups"}
                  className="user-links-text"
                  onClick={closeNavbar}
                >
                  گروه ها
                </Link>
              </div>
              <div className="user-links">
                <FaPlus />
                <p className="user-links-text" onClick={handleOpenGroupForm}>
                  ایجاد گروه
                </p>
                <CreateGroupForm
                  isOpen={isGroupFormOpen}
                  onClose={closeGroupModal}
                  closeNavbar={closeNavbar}
                />
              </div>

              <div className="register-button-container">
                <button
                  type="submit"
                  className="register-button"
                  onClick={handleOpenClick}
                >
                  ثبت نام/ ورود
                </button>
                <Signup isOpen={isSignupOpen} onClose={closeSignupModal} />
              </div>

              <div className="social-links-container">
                <ul>
                  <li>
                    <a className="social-links">
                      <FaInstagram />
                    </a>
                  </li>
                  <li>
                    <a className="social-links">
                      <FaTelegramPlane />
                    </a>
                  </li>
                  <li>
                    <a className="social-links">
                      <FaTwitter />
                    </a>
                  </li>
                  <li>
                    <a className="social-links">
                      <FaYoutube />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <p className="copyright-disclaimer">&copy; تمامی حقوق محفوظ است </p>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
