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
      address: this.props.address,
      bio: this.props.bio,
      editing: true,
      userStorage: this.props.userStorage,
      interface: this.props.interface,
      nameText: this.props.username,
      bioText: this.props.bio,
      imgHash: this.props.imgHash,
      nameTextFocused: false,
      bioTextFocused: false,
      flagName: '',
      flagBio: '',
      buffer: null,
      isClickable: false
    }

    this.textareaName = React.createRef()
    this.nameBox = React.createRef()
    this.textareaBio = React.createRef()
    this.bioBox = React.createRef()
    this.img = React.createRef()

    this.handleNameTextChange = this.handleNameTextChange.bind(this)
    this.handleNameTextFocus = this.handleNameTextFocus.bind(this)
    this.handleNameTextBlur = this.handleNameTextBlur.bind(this)

    this.handleBioTextChange = this.handleBioTextChange.bind(this)
    this.handleBioTextFocus = this.handleBioTextFocus.bind(this)
    this.handleBioTextBlur = this.handleBioTextBlur.bind(this)

    this.handleBuffer = this.handleBuffer.bind(this)
    this.handleBanner = this.handleBanner.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }

  async componentDidMount() {
    const background = document.querySelector('div#background'),
          container = document.querySelector('div#container')
    background.style.top = this.props.offsetY + 'px'
    container.style.top = 'calc(15% + ' + this.props.offsetY + 'px)'
    if(window.innerWidth<580) {
      container.style.top = 'calc(0% + ' + this.props.offsetY +'px)'
    } else {
      container.style.top = 'calc(15% + ' + this.props.offsetY + 'px)'
    }


    fadeIn('.EditProfile div#container', 333)
    partialFadeIn('.EditProfile div#background', 100, 0.2)
    this.textareaName.focus()
    autosize(this.textareaName)
    this.textareaBio.focus()
    autosize(this.textareaBio)
  }
  componentDidUpdate() {
    this.checkUsername()
    this.checkBio()
    this.updateButton()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  handleNameTextChange(e) {
    e.preventDefault()
    this.setState({ nameText: e.target.value })
  }
  handleNameTextFocus(e) {
    this.setState({ nameTextFocused: true })
  }
  handleNameTextBlur(e) {
    this.setState({ nameTextFocused: false })
  }

  handleBioTextChange(e) {
    e.preventDefault()
    this.setState({ bioText: e.target.value })
  }
  handleBioTextFocus(e) {
    this.setState({ bioTextFocused: true })
  }
  handleBioTextBlur(e) {
    this.setState({ bioTextFocused: false })
  }

  handleBuffer(buffer) {
    this.setState({ buffer })
  }
  handleBanner(e) {
    this.props.handleBanner(e)
  }
  async handleClose(e) {
    await this.handleCloseClick(e)
  }

  async handleSaveClick(e) {
    if(this.state.username!==this.state.nameText && !this.state.flagName) {
      this.props.handleBanner([
        'Waiting',
        'Username Update',
        this.state.account + '-username'
      ])
      const nameBytes = await toBytes(this.state.nameText)
      await this.state.interface.methods
        .changeUserName(this.state.account, nameBytes)
        .send({from: this.state.account})
        .on('transactionHash', () => {
          this.props.handleBanner([
            'Writing',
            'Username Update',
            this.state.account + '-username'
          ])
          this.handleCloseClick(e)
        })
        .on('receipt', () => {
          this.props.handleBanner([
            'Success',
            'Username Update',
            this.state.account + '-username'
          ])
        })
        .catch(e => {
          this.props.handleBanner([
            'Cancel',
            'Username Update',
            this.state.account + '-username'
          ])
          console.error(e)
        })
      this.setState({ username: this.state.nameText })
      localStorage.setItem('userInfo', this.state.account)
    }
    if(this.state.bio!==this.state.bioText) {
      this.props.handleBanner([
        'Waiting',
        'Bio Update',
        this.state.account + '-bio'
      ])
      await this.state.interface.methods
        .newBio(this.state.account, this.state.bioText)
        .send({from: this.state.account})
        .on('transactionHash', () => {
          this.props.handleBanner([
            'Writing',
            'Bio Update',
            this.state.account + '-bio'
          ])
          this.handleCloseClick(e)
        })
        .on('receipt', () => {
          this.props.handleBanner([
            'Success',
            'Bio Update',
            this.state.account + '-bio'
          ])
        })
        .catch(e => {
          this.props.handleBanner([
            'Cancel',
            'Bio Update',
            this.state.account + '-bio'
          ])
          console.error(e)
        })
    }
    if(this.state.buffer) {
      this.props.handleBanner([
        'Waiting',
        'Profile Pic',
        this.state.account + '-profile-pic'
      ])
      await this.img.uploadImage()
    }
  }
  async handleCloseClick(e) {
    localStorage.setItem('nameText', this.state.nameText)
    fadeOut('.EditProfile div#container', 500)
    partialFadeOut('.EditProfile div#background', 333, 0.2)
    unBlur('div.Main', 500)
    setTimeout(async () => {
      await this.setState({ editing: false })
      this.props.handleExitEdit(await this.state.editing)
    }, 500)
  }
  async toBytes32(text) {
    const textBytes = await toBytes(text)
    return await this.state.interface.methods.bytesToBytes32(textBytes).call()
  }
  handleResize(ContainerSize, event) {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    })
  }

  checkUsername() {
    // valid characters
    const usernameRegex = /[^A-Za-z0-9_\s,'":?!%&*()+=/^><-]/g,
          letterRegex = /[^A-Za-z]/g,
          checkUsername = this.state.nameText.search(usernameRegex),
          checkFirstLetter = this.state.nameText.search(letterRegex),
          invalidFlag = 'invalid character used',
          firstFlag = 'first character must be letter',
          lengthFlag = 'must be between 2 and 32 characters',
          label = document.querySelector('.EditProfile label#name span#label')
    // check characters
    if(checkUsername > -1 && this.state.flagName.length===undefined) {
      label.style.color = '#DD4422'
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422'
      this.setState({ flagName: invalidFlag })
    } else if (checkUsername < 0 && this.state.flagName===invalidFlag)
      this.setState({ flagName: false})
    // check first character
    if(checkFirstLetter===0 && this.state.flagName.length===undefined) {
      label.style.color = '#DD4422'
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422'
      this.setState({ flagName: firstFlag })
    } else if(checkFirstLetter < 0 && this.state.flagName===firstFlag) {
      this.setState({ flagName: false })
    }

    // check length
    if(this.state.nameText.length > 0 && this.state.nameText.length < 2 &&
       !this.state.flagName) {
      this.setState({ flagName: lengthFlag })
      label.style.color = '#DD4422'
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422'
    } else if(this.state.nameText.length > 0 && this.state.nameText.length < 2 &&
       this.state.flagName) {
      label.style.color = '#DD4422'
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422'
    } else if(this.state.nameText.length > 1 && this.state.flagName===lengthFlag) {
      this.setState({ flagName: false })
      label.style.color = '#00CC89'
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
    } // check if focused
    else if(this.state.nameText.length > 0 && !this.state.nameTextFocused &&
            !this.state.flagName) {
      this.setState({ nameTextFocused: true })
      label.style.color = '#00CC89'
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
    } else if(this.state.nameText.length > 0 && this.state.nameTextFocused &&
              !this.state.flagName) {
      label.style.color = '#00CC89'
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
    } else if(this.state.nameText.length === 0 && this.state.nameTextFocused &&
              !this.state.flagName) {
      label.style.color = '#DD4422'
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422'
      this.setState({ flagName: lengthFlag })
    } else if(this.state.nameText.length === 0 && !this.state.nameTextFocused &&
              !this.state.flagName) {
      this.nameBox.style.boxShadow = 'none'
    } else if(this.state.flagName) {
      label.style.color = '#DD4422'
      this.nameBox.style.boxShadow = '0 0 0 0.1rem #DD4422'
    }
  }
  checkBio() {
    const label = document.querySelector('.EditProfile label#bio span#label')
    if(this.state.bioText.length>0) {
      label.style.color = '#00CC89'
      this.bioBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
    } else {
      label.style.color = '#667777'
      this.bioBox.style.boxShadow = '0 0 0 0.1rem #667777'
    }
  }
  updateButton() {
    const button = document.querySelector('.EditProfile p#save-button')
    if((this.state.username!==this.state.nameText && !this.state.flagName) ||
        this.state.bio!==this.state.bioText ||
        this.state.buffer) {
      button.style.cursor = 'pointer'
      button.style.backgroundColor = '#00CC89'
      button.style.color = '#FFFFFF'
      //this.setState({ isClickable: true })
    } else {
      button.style.cursor = 'default'
      button.style.backgroundColor = '#334646'
      button.style.color = '#AABBAA'
      //this.setState({ isClickable: false })
    }
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
                interface={this.state.interface}
                userStorage={this.state.userStorage}
                imgHash={this.props.imgHash}
                handleBuffer={this.handleBuffer}
                handleBanner={this.handleBanner}
                handleClose={this.handleClose}
                registered={true}
                ref={Ref=>this.img=Ref}
              />
            </div>
            <form id="form">
              <div id="edit-box" ref={Ref=>this.nameBox=Ref}>
                <label id="name">
                  <span id="label">Name</span>
                  <span id="count">{this.state.nameText.length} / 32</span>
                </label>
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
                  onFocus={this.handleNameTextFocus}
                  onBlur={this.handleNameTextBlur}
                  ref={Ref=>this.textareaName=Ref}
                  required/>
              </div>
              { this.state.flagName
                  ? <div className="flag" id="name-flag">
                      <span id="flag">{this.state.flagName}</span>
                    </div>
                  : ''
              }
              <div id="edit-box" ref={Ref=>this.bioBox=Ref}>
                <label id="bio">
                  <span id="label">Bio</span>
                  <span id="count">{this.state.bioText.length} / 300</span>
                </label>
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
                  ? <div className="flag" id="bio-flag">
                      <span id="flag">{this.state.flagBio}</span>
                    </div>
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
