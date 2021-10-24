import React from 'react'
import { fadeIn, fadeOut } from '../../resources/Libraries/Animation'
import selectNetwork from '../../resources/Select-Network.png'
import sendRopsten from '../../resources/Send-Ropsten.png'
import copyAccount from '../../resources/Copy-Account.png'
import './NoEth.css'

class NoEth extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      overP1: false,
      overP2: false,
      overlay: false
    }

    this.handleP1Enter = this.handleP1Enter.bind(this)
    this.handleP1Leave = this.handleP1Leave.bind(this)
    this.handleP2Enter = this.handleP2Enter.bind(this)
    this.handleP2Leave = this.handleP2Leave.bind(this)
  }
  componentDidMount() {
    fadeIn('.NoEth p#p1', 3000)
    setTimeout(() => fadeIn('.NoEth p#p2', 3000), 1000)
    setTimeout(() => fadeIn('.NoEth p#p3', 3000), 2000)
    setTimeout(() => fadeIn('.NoEth p#p4', 3000), 4000)
  }

  handleP1Enter(e) {
    if(!this.state.overP1 && !this.state.overP2) {
      this.setState({
        overP1: true
      })
      setTimeout(()=> {
        const img = document.querySelector('.NoEth img')
        img.style.opacity = '1'
      },50)
    }
  }
  handleP1Leave(e) {
    if(this.state.overP1) {
      const img = document.querySelector('.NoEth img')
      img.style.opacity = '0'
      setTimeout(() => {
        this.setState({
          overP1: false
        })
      }, 500)
    }
  }
  handleP2Enter(e) {
    if(!this.state.overP2 && !this.state.overP1) {
      this.setState({
        overP2: true
      })
      setTimeout(()=> {
        const img = document.querySelectorAll('.NoEth img')
        img.forEach(elem => elem.style.opacity = '1')
      },50)
    }
  }
  handleP2Leave(e) {
    if(this.state.overP2) {
      const img = document.querySelectorAll('.NoEth img')
      img.forEach(elem => elem.style.opacity = '0')
      setTimeout(() => {
        this.setState({
          overP2: false
        })
      }, 500)
    }
  }

  render() {
    return(
      <div className="NoEth">
        <div id="image-section">
          { this.state.overP1
            ? <img
                src={selectNetwork}
                alt="select-network"
              />
            : ''
          }
          { this.state.overP2
            ? <div id="send-ropsten">

                <img
                  id="copy"
                  src={copyAccount}
                  alt="copy-account"
                />
                <img
                  id="send"
                  src={sendRopsten}
                  alt="send-ropsten"
                />
              </div>
            : ''

          }
        </div>
        <p id="p1">
          <span>In order to use </span>
          <span id="ume">uMe</span>
          <span>, you must:</span>
          <br/>
        </p>
        <p
          id="p2"
          onMouseOver={this.handleP1Enter}
          onMouseLeave={this.handleP1Leave}
        >
          <span>
            1. Connect to the <span id="bold">Ropsten Testnet</span>

          </span>
        </p>
        <p
          id="p3"
          onMouseOver={this.handleP2Enter}
          onMouseLeave={this.handleP2Leave}
        >
          <span>
            2. Have <span id="bold">Ropsten Ethereum</span>
          </span>
          <br/>
          <a href="https://faucet.ropsten.be/" target="_blank">
            (click to visit<span id="bold"> Ropsten Ethereum Faucet</span>)
          </a>

        </p>
        <p id="p4">
          <span>Refresh page once you've received Ropsten ETH</span>
        </p>
      </div>
    )
  }
}

export default NoEth
