import React from 'react'
import { fadeIn, fadeOut } from '../../resources/Libraries/Animation'
import './NoWallet.css'

class NoWallet extends React.Component {
  componentDidMount() {
    fadeIn('.NoWallet p#p1', 3000)
    setTimeout(() => fadeIn('.NoWallet p#p3', 3000), 3000)
  }
  componentWillUnmount() {
    fadeOut('.NoWallet', 2000)
  }
  render() {
    return(
      <div className="NoWallet">
        <p id="p1">Please connect MetaMask Wallet</p>
        <p id="p3">(You may have to refresh page)</p>
      </div>
    )
  }
}

export default NoWallet
