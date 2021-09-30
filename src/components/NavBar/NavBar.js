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
        <small id="logo">
          <p
            id="logo"
            onClick={this.handleRefreshClick}
          >
            <img
              id="logo"
              src={logo}
              alt="logo"
            />
          </p>
        </small>
        <small
          id="pages"
          onClick={this.handleHomeClick}
        >
          <p id="home">
            <a
              id="home"
              href="home"
            >
              <span id="icon">

                <img src={home} alt="home" id="icon" width="26px"/>
              </span>
              <span id="link">Home</span>
            </a>
          </p>
        </small>
        <small
          id="pages"
          onClick={this.handleProfileClick}
        >
          <p id="profile">
            <a
              id="profile"
              href="profile"
            >
              <span id="icon">
                <img src={profile} alt="profile" id="icon" width="27px"/>
              </span>
              <span id="link">Profile</span>
            </a>
          </p>
        </small>
        <small id="pages">
          <p id="settings">
            <a
              id="settings"
              href="settings"
            >
              <span id="icon">
                <img src={settings} alt="settings" id="icon" width="27px"/>
              </span>

              <span id="link">Settings</span>
            </a>
          </p>
        </small>
        <p
          id="meme"
          onClick={this.handleMemeClick}
        >

          <span>Meme</span>
        </p>
      </nav>
    );
  }
}

export default NavBar
