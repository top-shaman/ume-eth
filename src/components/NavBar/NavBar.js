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
        <small id="pages">
          <a
            className="home"
            href="#home"
          >
            Home
          </a>
        </small>
        <a
          className="profile"
          href="#profile"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
        <ul className="navbar">
          <li className="nav-item">
            <section className="text-secondary">
              <h4 id="account">
              </h4>
            </section>
          </li>
        </ul>
      </nav>
    );
  }
}

export default NavBar
