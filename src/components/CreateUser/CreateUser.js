import React from 'react'
import Identicon from 'identicon.js'
import ProfilePic from '../ProfilePic/ProfilePic'
import './CreateUser.css'

function easeInOut (t, b, c) {
  if ((t /= 1 / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

class CreateUser extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account,
      username: '',
      address: '',
      usernameFlag: false,
      addressFlag: '',
      submitText: 'please set username & address',
      registered: false
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
  }

  componentDidMount() {
    this.fadeIn('div#CreateUser', 1500)
  }
  componentDidUpdate() {
    this.checkUsername()
    this.checkAddress()
  }

  componentWillUnmount() {
    this.fadeOut('div#CreateUser', 1500)
  }
  handleUsernameChange(e) {
    e.preventDefault()
    this.setState({ username: e.target.value })
  }
  handleAddressChange(e) {
    e.preventDefault()
    this.setState({ address: e.target.value })
  }

  checkUsername() {
    // valid characters
    const usernameRegex = /[^A-Za-z0-9_\s-]/g
    const checkUsername = this.state.username.search(usernameRegex)
    const invalidFlag = 'only letters, numbers, underscores, spaces, hyphens are valid'
    const lengthFlag = 'must be at least 2 characters'
    if(checkUsername > -1 && !this.state.usernameFlag)
      this.setState({ usernameFlag: invalidFlag })
    else if (checkUsername < 0 && this.state.usernameFlag===invalidFlag)
      this.setState({ usernameFlag: false})
    // box color functions
    const inputBox = document.querySelector('input#UsernameInput.CreateUser')
    if(this.state.username.length > 0 && this.state.username.length < 2 &&
       !this.state.usernameFlag) {
      this.setState({ usernameFlag: lengthFlag })
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
    } else if(this.state.username.length > 0 && this.state.username.length < 2 &&
       this.state.usernameFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
    } else if (this.state.username.length > 1 && this.state.usernameFlag==lengthFlag) {
      this.setState({ usernameFlag: false })
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
    } else {
      inputBox.style.boxShadow = 'none'
      inputBox.style.backgroundColor = '#666677'
    }
  }
  checkAddress() {
    // valid characters
    const addressRegex = /[^A-Za-z0-9_]/g
    const checkAddress = this.state.address.search(addressRegex)
    const invalidFlag = 'only letters, numbers, underscores are valid'
    const lengthFlag = 'must be at least 2 characters'
    if(checkAddress > -1 && !this.state.addressFlag)
      this.setState({ addressFlag: invalidFlag })
    else if (checkAddress < 0 && this.state.addressFlag===invalidFlag)
      this.setState({ addressFlag: false})
    // box color functions
    const inputBox = document.querySelector('input#AddressInput.CreateUser')
    if(this.state.address.length > 0 && this.state.address.length < 2 &&
       !this.state.addressFlag) {
      this.setState({ addressFlag: lengthFlag })
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
    } else if(this.state.address.length > 0 && this.state.address.length < 2 &&
       this.state.addressFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
    } else if (this.state.address.length > 1 && this.state.addressFlag==lengthFlag) {
      this.setState({ addressFlag: false })
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
    } else {
      inputBox.style.boxShadow = 'none'
      inputBox.style.backgroundColor = '#666677'
    }
  }

  fadeIn(element, duration) {
    const elements = document.querySelectorAll(element)
    let start = performance.now()
    requestAnimationFrame(function animation(time) {
      let fractionOfTime = (time - start) / duration
      if (fractionOfTime > 1) fractionOfTime = 1
      let progress = easeInOut(fractionOfTime, 0, 1)
      elements.forEach(e => e.style.opacity = progress)
      if (fractionOfTime < 1) requestAnimationFrame(animation)
    })
  }
  fadeOut(element, duration) {
    const elements = document.querySelectorAll(element)
    let start = performance.now()
    requestAnimationFrame(function animation(time) {
      let fractionOfTime = (time - start) / duration
      if (fractionOfTime > 1) fractionOfTime = 1
      let progress = easeInOut(fractionOfTime, 1, -1)
      elements.forEach(e => e.style.opacity = progress)
      if (fractionOfTime < 1) requestAnimationFrame(animation)
    })
  }
  render() {
    return(
      <div id="CreateUser">
        <p className="CreateUser" id="description">
          Create username & address to begin
        </p>
        <p classname="CreateUser" id="title">uMe</p>
        <div className="CreateUser" id="box">
          <p className="CreateUser" id="username">{this.state.username}</p>
          <div className="CreateUser" id="profile-pic">
            <ProfilePic id="ProfilePic" account={this.props.account} hasEntered={this.props.hasEntered}/>
          </div>
          <p className="CreateUser" id="address">{this.state.address}</p>
          <form className="CreateUser">
            <p className="CreateUser" id="field">
              <label for="UserName">username: </label>
              <input
                id="UsernameInput"
                name="Username"
                className="CreateUser"
                type="text"
                maxLength="32"
                placeholder="must be between 2 and 32 characters"
                onChange={this.handleUsernameChange}
                required
              />
              <p className="CreateUser" id="subtext">
                {this.state.usernameFlag}
              </p>
            </p>
            <p className="CreateUser" id="field">
              <label for="UserAddress">address: </label>
              <input
                id="AddressInput"
                name="UserAddress"
                className="CreateUser"
                type="text"
                maxLength="31"
                placeholder="must be between 2 and 31 characters"
                onChange={this.handleAddressChange}
                required
              />
              <p className="CreateUser" id="subtext">
                {this.state.addressFlag}
              </p>
            </p>
            <p className="CreateUser" id="button">
              <input type="submit" value={this.state.submitText} id="submit"/>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default CreateUser
