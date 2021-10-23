import React, { Component } from 'react'
import './NavBar.css'
import logo from '../../resources/UME-green-96px.png'
import home from '../../resources/Home-Green.svg'
import profile from '../../resources/user-green.svg'
import settings from '../../resources/gear.svg'


class NavBar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account,
      creatingMeme: false
    }

    this.handleMemeClick = this.handleMemeClick.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleHomeClick = this.handleHomeClick.bind(this)
    this.handleProfileClick = this.handleProfileClick.bind(this)
    this.handleSettingsClick = this.handleSettingsClick.bind(this)
  }


  handleMemeClick(e) {
    e.preventDefault()
    this.setState({ creatingMeme: true })
    this.props.handleCreateMeme(true)
  }
  handleRefreshClick(e) {
    e.preventDefault()
    this.props.handleRefreshClick(e)
  }
  handleHomeClick(e) {
    e.preventDefault()
    localStorage.setItem('focusPage', 'timeline')
    this.props.handleToTimeline(e)
  }
  handleProfileClick(e) {
    e.preventDefault()
    localStorage.setItem('focusPage', 'profile')
    this.props.handleToProfile(this.state.account)
  }
  handleSettingsClick(e) {
    e.preventDefault()
    localStorage.setItem('focusPage', 'settings')
    this.props.handleToSettings(e)
  }
  render() {
    return (
      <nav
        className="navbar"
      >
        <small
          id="logo"
          onClick={this.handleRefreshClick}
        >
          <p id="logo">
            <img
              id="logo"
              src={logo}
              alt="logo"
            />
          </p>
        </small>
        <a
          id="home"
          href="/home"
          onClick={this.handleHomeClick}
        >
          <p id="home">
            <span id="icon">

              <img src={home} alt="home" id="icon" width="26px"/>
            </span>
            <span id="link">Home</span>
          </p>
        </a>
        <a
          id="profile"
          href="/profile"
          onClick={this.handleProfileClick}
        >
          <p id="profile">
            <span id="icon">
              <img src={profile} alt="profile" id="icon" width="27px"/>
            </span>
            <span id="link">Profile</span>
          </p>
        </a>
        {/*
        <a
          id="settings"
          href="/settings"
          onClick={this.handleSettingsClick}
        >
          <p id="settings">
            <span id="icon">
              <img src={settings} alt="settings" id="icon" width="27px"/>
            </span>

            <span id="link">Settings</span>
          </p>
        </a>
        */}
        <p
          id="meme"
          onClick={this.handleMemeClick}
        >

          <span>Meme</span>
        </p>
        <p
          id="meme-small"
          onClick={this.handleMemeClick}
        >
          <span>+</span>
        </p>
      </nav>
    );
  }
}

export default NavBar
