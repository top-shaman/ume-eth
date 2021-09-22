import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import { fadeIn, fadeOut } from '../../resources/Libraries/Animation'
import Web3 from 'web3'
import './CreateUser.css'

const toBytes = string => Web3.utils.fromAscii(string)

class CreateUser extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account,
      interface: this.props.interface,
      username: '',
      address: '',
      usernameFlag: false,
      addressFlag: false,
      usernameFocused: false,
      addressFocused: false,
      submitText: 'please set username & address',
      submitReady: false,
      registered: false
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleUsernameFocus = this.handleUsernameFocus.bind(this)
    this.handleAddressFocus = this.handleAddressFocus.bind(this)
    this.handleUsernameBlur = this.handleUsernameBlur.bind(this)
    this.handleAddressBlur = this.handleAddressBlur.bind(this)
    this.registerUser = this.registerUser.bind(this)
  }

  componentDidMount() {
    fadeIn('div#container.CreateUser', 1500)
  }
  componentDidUpdate() {
    this.checkUsername()
    this.checkAddress()
    this.checkSubmit()
  }

  componentWillUnmount() {
    fadeOut('div#container.CreateUser', 1500)
  }
  handleUsernameChange(e) {
    e.preventDefault()
    this.setState({ username: e.target.value })
  }
  handleAddressChange(e) {
    e.preventDefault()
    this.setState({ address: e.target.value })
  }
  handleUsernameFocus(e) {
    e.preventDefault()
    this.setState({ usernameFocused: true })
  }
  handleAddressFocus(e) {
    e.preventDefault()
    this.setState({ addressFocused: true })
  }
  handleUsernameBlur(e) {
    e.preventDefault()
    this.setState({ usernameFocused: false })
  }
  handleAddressBlur(e) {
    e.preventDefault()
    this.setState({ addressFocused: false })
  }

  checkUsername() {
    // valid characters
    const usernameRegex = /[^A-Za-z0-9_\s,'":?!%&*()+=/^><-]/g
    const letterRegex = /[^A-Za-z]/g
    const checkUsername = this.state.username.search(usernameRegex)
    const checkFirstLetter = this.state.username.search(letterRegex)
    const invalidFlag = 'invalid character used'
    const firstFlag = 'first character must be letter'
    const lengthFlag = 'must be at least 2 characters'
    const inputBox = document.querySelector('.CreateUser input#UsernameInput')
    // check characters
    if(checkUsername > -1 && this.state.usernameFlag.length===undefined) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
      this.setState({ usernameFlag: invalidFlag })
    } else if (checkUsername < 0 && this.state.usernameFlag===invalidFlag)
      this.setState({ usernameFlag: false})
    // check first character
    if(checkFirstLetter===0 && this.state.usernameFlag.length===undefined) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
      this.setState({ usernameFlag: firstFlag })
    } else if(checkFirstLetter < 0 && this.state.usernameFlag===firstFlag) {
      this.setState({ usernameFlag: false })
    }

    // check length
    if(this.state.username.length > 0 && this.state.username.length < 2 &&
       !this.state.usernameFlag) {
      this.setState({ usernameFlag: lengthFlag })
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
    } else if(this.state.username.length > 0 && this.state.username.length < 2 &&
       this.state.usernameFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
    } else if(this.state.username.length > 1 && this.state.usernameFlag===lengthFlag) {
      this.setState({ usernameFlag: false })
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
    } // check if focused
    else if(this.state.username.length > 0 && !this.state.usernameFocused &&
            !this.state.usernameFlag) {
      this.setState({ usernameFocused: true })
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
      inputBox.style.backgroundColor = '#282c34'
    } else if(this.state.username.length > 0 && this.state.usernameFocused &&
              !this.state.usernameFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
      inputBox.style.backgroundColor = '#282c34'
    } else if(this.state.username.length === 0 && this.state.usernameFocused &&
              !this.state.usernameFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #BBAA00'
      inputBox.style.backgroundColor = '#666677'
    } else if(this.state.username.length === 0 && !this.state.usernameFocused &&
              !this.state.usernameFlag) {
      inputBox.style.boxShadow = 'none'
      inputBox.style.backgroundColor = '#666677'
    } else if(this.state.usernameFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
    }
  }
  checkAddress() {
    // valid characters
    const addressRegex = /[^A-Za-z0-9_]/g
    const checkAddress = this.state.address.search(addressRegex)
    const invalidFlag = 'only letters, numbers, underscores are valid'
    const lengthFlag = 'must be at least 2 characters'
    const inputBox = document.querySelector('.CreateUser input#AddressInput')
    // character check
    if(checkAddress > -1 && this.state.addressFlag.length===undefined) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
      this.setState({ addressFlag: invalidFlag })
    } else if (checkAddress < 0 && this.state.addressFlag===invalidFlag)
      this.setState({ addressFlag: false})
    // length check functions
    if(this.state.address.length > 0 && this.state.address.length < 2 &&
       !this.state.addressFlag) {
      this.setState({ addressFlag: lengthFlag })
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
    } else if(this.state.address.length > 0 && this.state.address.length < 2 &&
       this.state.addressFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
    } else if (this.state.address.length > 1 && this.state.addressFlag===lengthFlag) {
      this.setState({ addressFlag: false })
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
    } // check if focused
    else if(this.state.address.length > 0 && !this.state.addressFocused &&
            !this.state.addressFlag) {
      this.setState({ addressFocused: true })
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
      inputBox.style.backgroundColor = '#282c34'
    } else if(this.state.address.length > 0 && this.state.addressFocused &&
              !this.state.addressFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #00CC89'
      inputBox.style.backgroundColor = '#282c34'
    } else if(this.state.address.length === 0 && this.state.addressFocused &&
              !this.state.addressFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #BBAA00'
      inputBox.style.backgroundColor = '#666677'
    } else if(this.state.address.length === 0 && !this.state.addressFocused &&
              !this.state.addressFlag) {
      inputBox.style.boxShadow = 'none'
      inputBox.style.backgroundColor = '#666677'
    } else if(this.state.addressFlag) {
      inputBox.style.boxShadow = '0 0 0 0.1rem #CB0C00'
    }
  }
  checkSubmit() {
    const submit = document.querySelector('.CreateUser input#submit')
    const ready = 'Create Account'
    const noneReady = 'please set username & address'
    if(this.state.usernameFlag.length===undefined &&
       this.state.addressFlag.length===undefined &&
       (this.state.username.length!==0 && this.state.address.length!==0) &&
       this.state.submitText!==ready) {
      this.setState({
        submitText: ready,
        submitReady: true
      })
      submit.style.backgroundColor = '#00CC89'
      submit.style.color = '#FFFFFF'
      submit.style.cursor = 'pointer'
    } else if(((this.state.usernameFlag.length && this.state.address.length) ||
              (this.state.username.length && this.state.addressFlag.length) ||
              (this.state.usernameFlag.length && this.state.address.length===0) ||
              (this.state.username.length===0 && this.state.addressFlag.length) ||
              this.state.username.length===0 || this.state.address.length===0 ||
              (this.state.username.length===0 && this.state.address.length===0)) &&
              this.state.submitText!==noneReady) {
      this.setState({
        submitText: noneReady,
        submitReady: false
      })
      submit.style.backgroundColor = '#333334'
      submit.style.color = '#FFFFFF'
      submit.style.cursor = 'default'
    }
  }

  async registerUser(e) {
    const username = toBytes(this.state.username)
    const address = toBytes('@' + this.state.address)
    console.log(username + ' ' + address + ' submitted')
    if(this.state.submitReady) {
      await this.props.interface.methods.newUser(this.state.account, username, address)
        .send({from: this.state.account})
      window.location.reload()
    }
  }


  render() {
    return(
      <div id="container" className="CreateUser">
        <p id="description">
          Create username & address to begin
        </p>
        <p id="title">uMe</p>
        <div id="box">
          <p id="username">{this.state.username}</p>
          <div id="profile-pic">
            <ProfilePic id="ProfilePic" account={this.props.account} hasEntered={this.props.hasEntered}/>
          </div>
          <p id="address">
            {this.state.address ? '@' + this.state.address : ''}
          </p>
          <form className="CreateUser" id="CreateUser">
            <p className="CreateUser" id="field">
              <label htmlFor="UserName">username: </label>
              <input
                id="UsernameInput"
                name="Username"
                type="text"
                maxLength="32"
                placeholder="must be between 2 and 32 characters"
                onChange={this.handleUsernameChange}
                onFocus={this.handleUsernameFocus}
                onBlur={this.handleUsernameBlur}
                autoComplete="off"
                required
              />
              <span id="subtext">
                {this.state.usernameFlag}
              </span>
            </p>
            <p className="CreateUser" id="field">
              <label htmlFor="UserAddress">address: </label>
              <input
                id="AddressInput"
                name="UserAddress"
                type="text"
                maxLength="31"
                placeholder="must be between 2 and 31 characters"
                onChange={this.handleAddressChange}
                onFocus={this.handleAddressFocus}
                onBlur={this.handleAddressBlur}
                autoComplete="off"
                required
              />
              <span id="subtext">
                {this.state.addressFlag}
              </span>
            </p>
            <p id="button">
              <input
                type="button"
                value={this.state.submitText}
                id="submit"
                onClick={this.registerUser}
              />
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default CreateUser
