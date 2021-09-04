import React, { Component } from 'react'
import "./NavBar.css"
import logo from "../../resources/UME-green-96px.png"


class NavBar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      creatingMeme: false
    }

    this.handleClick = this.handleClick.bind(this)
  }

  async handleClick(e) {
    e.preventDefault()
    await this.setState({ creatingMeme: true })
    this.props.handleMeme(await this.state.creatingMeme)
    //console.log(await this.state.creatingMeme)
  }

  render() {
    return (
      <nav className="navbar" handleMeme={this.state.creatingMeme}>
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
        <small id="pages" className="link">
          <a
            className="home"
            href="#home"
          >
            Home
          </a>
        </small>
        <small id="pages" className="link">
          <a
            className="profile"
            href="#profile"
          >
            Profile
          </a>
        </small>
        <small id="pages" className="link">
          <a
            className="settings"
            href="#settings"
          >
            Settings
          </a>
        </small>
        <p
          className="meme"
          onClick={this.handleClick}
        >

          <span>Meme</span>
        </p>
      </nav>
    );
  }
}

export default NavBar
