import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import { fadeIn, fadeOut, partialFadeIn, partialFadeOut, unBlur } from '../../resources/Libraries/Animation'
import { toBytes } from '../../resources/Libraries/Helpers'
import './EditProfile.css'
import X from '../../resources/X-white.svg'
import autosize from 'autosize'

class EditProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account,
      username: this.props.username,
      bio: this.props.bio,
      editing: true,
      userStorage: this.props.userStorage,
      interface: this.props.interface,
      nameText: this.props.username,
      flagName: '',
      flagBio: '',
      validMeme: false
    }

    this.textareaName = React.createRef()
    this.nameBox = React.createRef()
    this.textareaBio = React.createRef()
    this.bioBox = React.createRef()

    this.handleNameTextChange = this.handleNameTextChange.bind(this)
    this.handleBioTextChange = this.handleBioTextChange.bind(this)

    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
  }

  async componentDidMount() {
    console.log(this.state.nameText)
    fadeIn('.EditProfile div#container', 333)
    partialFadeIn('.EditProfile div#background', 100, 0.2)
    this.textareaName.focus()
    autosize(this.textareaName)
    this.textareaBio.focus()
    autosize(this.textareaBio)
  }

  componentWillUnmount() {
    this.mounted = false
  }

  async handleNameTextChange(e) {
    e.preventDefault()
    this.setState({ nameText: e.target.value })
    /*
    const text = await e.target.value,
          buttonText = document.querySelector('.EditProfile p#meme-button'),
          memeButton = document.querySelector('.EditProfile p#meme-button'),
          nameBox = document.querySelector('.EditProfile div#text-box'),
          textareaName = document.querySelector('.EditProfile textarea#meme-text')
    nameBox.style.height = textareaName.clientHeight + 'px'
    // check text validity
    if(text.match(/\s/g)) {
      this.setState({ validMeme: text.length!==text.match(/\s/g).length })
      memeButton.style.cursor = 'default'
      memeButton.style.backgroundColor = '#334646'
      buttonText.style.color = '#AABBAA'
    } else if(text.length>0 && text.length<=512) {
      memeButton.style.cursor = 'pointer'
      memeButton.style.backgroundColor = '#00CC89'
      buttonText.style.backgroundColor = '#FFFFFF'
      this.setState({ validMeme: true })
    } else if(e.target.value==='') {
      memeButton.style.cursor = 'default'
      memeButton.style.backgroundColor = '#334646'
      buttonText.style.color = '#AABBAA'
      this.setState({ validMeme: false })
    }
    if(this.state.validMeme) {
      memeButton.style.cursor = 'pointer'
      memeButton.style.backgroundColor = '#00CC89'
      buttonText.style.color = '#FFFFFF'
    }
    if(text.length>=412 && text.length<502) {
      this.setState({
        flag: <p id="flag-grey">{(512-text.length) + ' characters left'}</p>
      })
    } else if(text.length>=502 && text.length<=512) {
      this.setState({
        flag: <p id="flag-red">{(512-text.length) + ' characters left'}</p>
      })
    } else {
      this.setState({ flag: '' })
    }
    // change color of text if special sequence
    const formattedText = await this.formatText()
    this.setState({ visibleText: formattedText})
    */
  }
  async handleBioTextChange(e) {
    e.preventDefault()
    this.setState({ bioText: e.target.value })
  }
  async handleSaveClick(e) {
    /*
    if(this.state.validMeme) {
      const tags = await this.validAts()
      this.state.interface.methods.newMeme(
        this.props.account,
        this.state.nameText,
        await tags, this.state.parentId, this.state.originId)
      .send({from: this.props.account})
      this.handleCloseClick(e)
      localStorage.setItem('nameText', '')
    }
    */
  }
  async handleCloseClick(e) {
    localStorage.setItem('nameText', this.state.nameText)
    fadeOut('.EditProfile div#container', 500)
    partialFadeOut('.EditProfile div#background', 333, 0.2)
    unBlur('.Main div#header', 500)
    unBlur('.Main div#body', 500)
    setTimeout(async () => {
      await this.setState({ editing: false })
      this.props.handleExitEdit(await this.state.editing)
    }, 500)
  }
  async toBytes32(text) {
    const textBytes = await toBytes(text)
    return await this.state.interface.methods.bytesToBytes32(textBytes).call()
  }

  render() {
    return(
      <div className="EditProfile" id="EditProfile" >
        <div id="container">
          <section id="head">
            <img
              id="x"
              className="close"
              alt="close button"
              src={X}
              width="13px"
              onClick={this.handleCloseClick}
            />
            <p id="title">Edit profile</p>
            <div id="button-box">
              <p
                id="save-button"
                onClick={this.handleSaveClick}
              >
                Save
              </p>
            </div>
          </section>
          <section id="body">
            <div id="profilePic">
              <ProfilePic
                id="profilePic"
                account={this.props.account}
              />
            </div>
            <form id="form">
              <div id="edit-box" ref={Ref=>this.nameBox=Ref}>
                <label id="name">Name</label>
                <textarea
                  name="name"
                  id="name-text"
                  type="text"
                  autoComplete="off"
                  placeholder="New name"
                  rows="1"
                  maxLength="32"
                  value={this.state.nameText}
                  onChange={this.handleNameTextChange}
                  ref={Ref=>this.textareaName=Ref}
                  required/>
              </div>
              { this.state.flagName
                  ? <div className="counter" id="name-counter">{this.state.flagName}</div>
                  : ''
              }
              <div id="edit-box" ref={Ref=>this.bioBox=Ref}>
                <label id="bio">Bio</label>
                <textarea
                  name="bio"
                  id="bio-text"
                  type="text"
                  autoComplete="off"
                  placeholder="New bio"
                  rows="1"
                  maxLength="300"
                  value={this.state.bioText}
                  onChange={this.handleBioTextChange}
                  ref={Ref=>this.textareaBio=Ref}
                  required/>
              </div>
              { this.state.flagBio
                  ? <div className="counter" id="bio-counter">{this.state.flagBio}</div>
                  : ''
              }
            </form>
          </section>
        </div>
        <div
          id="background"
          onClick={this.handleCloseClick}
        >
        </div>
      </div>
    )
  }

}

export default EditProfile
