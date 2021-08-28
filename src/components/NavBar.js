import React, { Component } from 'react'

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar">
        <a
          className="profile"
          href="home"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img />
        </a>
        <ul className="navbar">
          <li className="nav-item">
            <section className="text-secondary">
              <h4 id="account">
                hello {/* insert account props here */}
              </h4>
            </section>
          </li>
        </ul>
      </nav>
    );
  }
}

export default NavBar
