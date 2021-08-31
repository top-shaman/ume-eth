import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import EnterLogo from '../EnterLogo/EnterLogo'
import './CreateUser.css'

function easeInOut (t, b, c) {
  if ((t /= 1 / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

class CreateUser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    event.preventDefault()
    console.log('click')
    this.fade()
  }

  fade() {
    let start = performance.now()
    const elements = document.querySelector('article[class="CreateUserContainer"]')
    requestAnimationFrame(function animation(time) {
      let duration = 1500
      let fractionOfTime = (time - start) / duration
      if (fractionOfTime > 1) fractionOfTime = 1
      let progress = easeInOut(fractionOfTime, 1, -1)
      console.log(progress)
      elements.style.opacity = progress
      if (fractionOfTime < 1) requestAnimationFrame(animation)
    })
  }


  render() {
    return(
      <div className="CreateUser" >
      { this.props.account===undefined
        ? <p className="CreateUser1">Please connect MetaMask Wallet</p>
        : <article className="CreateUserContainer">
            <p id="prompt" className="CreateUser1">Hello,</p>
            <p id="prompt" className="CreateUser2">{this.props.account + ' !'}</p>
            <p id="prompt" className="CreateUser3">Welcome... to</p>
            <p id="prompt" className="CreateUser" id="title">uMe</p>
            <EnterLogo id="EnterLogo" />
            <p id="prompt" className="CreateUser4">(Click logo to get started)</p>
          </article>
      }
      </div>
    );
  }
}


export default CreateUser
