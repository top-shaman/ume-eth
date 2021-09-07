import React, { Component } from 'react'
import "./NavBar.css"
import logo from "../../resources/UME-green-96px.png"
import { blurToFadeIn, fadeOut } from '../../resources/Libraries/Animation'


class NavBar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      creatingMeme: false
    }

    this.handleMemeClick = this.handleMemeClick.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
//    blurToFadeIn('div.navbar', 1500)
  }
  componentWillUnmount() {
//    fadeOut('div.navbar', 1500)
  }

  async handleMemeClick(e) {
    e.preventDefault()
    await this.setState({ creatingMeme: true })
    this.props.handleMeme(await this.state.creatingMeme)
    //console.log(await this.state.creatingMeme)
  }
  async handleRefreshClick(e) {
    this.props.handleRefresh(e)
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
          onClick={this.handleMemeClick}
        >

          <span>Meme</span>
        </p>
      </nav>
    );
  }
}

export default NavBar
