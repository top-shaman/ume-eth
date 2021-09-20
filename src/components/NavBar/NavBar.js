import React, { Component } from 'react'
import "./NavBar.css"
import logo from "../../resources/UME-green-96px.png"


class NavBar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      creatingMeme: false
    }

    this.handleMemeClick = this.handleMemeClick.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleHomeClick = this.handleHomeClick.bind(this)
    this.handleProfileClick = this.handleProfileClick.bind(this)
  }


  async handleMemeClick(e) {
    e.preventDefault()
    await this.setState({ creatingMeme: true })
    this.props.handleCreateMeme(await this.state.creatingMeme)
  }
  async handleRefreshClick(e) {
    this.props.handleRefresh(e)
  }
  async handleHomeClick(e) {
    localStorage.setItem('focusPage', 'timeline')
    localStorage.setItem('timelineSort', 'boost')
    this.props.handleToTimeline(e)
  }
  async handleProfileClick(e) {
    localStorage.setItem('focusPage', 'profile')
    localStorage.setItem('userInfo', 'user')
    this.props.handleToProfile('user')
  }
  render() {
    return (
      <nav
        className="navbar"
      >
        <small className="navbar" id="logo">
          <a
            className="logo"
            href="#home"
            onClick={this.handleRefreshClick}
          >
            <img
              id="logo"
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
            onClick={this.handleHomeClick}
          >
            Home
          </a>
        </small>
        <small id="pages" className="link">
          <a
            className="profile"
            href="#profile"
            onClick={this.handleProfileClick}
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
          onClick={this.handleMemeClick}
        >

          <span>Meme</span>
        </p>
      </nav>
    );
  }
}

export default NavBar
