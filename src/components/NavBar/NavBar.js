import React, { Component } from 'react'
import "./NavBar.css"
import logo from "../../resources/UME-green-96px.png"


class NavBar extends Component {
  render() {
    return (
      <nav className="navbar">
        <small className="navbar" id="logo">
          <a
            className="logo"
            href="#home"
          >
            <img
              className="logo"
              src={logo}
              alt="logo"
              width="60"
            />
          </a>
        </small>
        <small id="pages" className="home">
          <a
            className="home"
            href="#home"
          >
            Home
          </a>
        </small>
        <small id="pages" className="home">
          <a
            className="profile"
            href="#profile"
          >
            Profile
          </a>
        </small>
        <small id="pages" className="notifications">
          <a
            className="notifications"
            href="#notifications"
          >
            Explore
          </a>
        </small>
      </nav>
    );
  }
}

export default NavBar
