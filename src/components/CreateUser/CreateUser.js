import React, { Component } from 'react'
import logo from '../../resources/UME-green-bright-cropped-720px.png'
import './CreateUser.css'

class CreateUser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: '',
      loading: true
    }
  }

  render() {
    return(
      <div className="CreateUser">
        <p className="CreateUser1">Hello,</p>
        <p className="CreateUser2">{this.props.account} !</p>
        <p className="CreateUser3">Welcome... to</p>
        <p className="CreateUser" id="title">uMe</p>
        <small className="CreateUser">
          <a
            href="#home"
          >
            <img
              src={logo}
              alt="logo"
            />
          </a>
        </small>
        <p className="CreateUser4">(Click logo to get started)</p>
      </div>
    );
  }
}

export default CreateUser
