import React from 'react'
import { fadeIn, fadeOut } from '../../resources/Libraries/Animation'
import './NoWallet.css'

class NoWallet extends React.Component {
  render() {
    return(
      <div className="NoWallet">
        <p id="p1">Please connect MetaMask Wallet</p>
        <p id="p2">(You may have to refresh page)</p>
      </div>

    )
  }
  componentDidMount() {
    fadeIn('p#p1', 3000)
    setTimeout(() => fadeIn('p#p2', 3000), 2000)
  }
  componentWillUnmount() {
    fadeOut('.NoWallet', 2000)
  }
}

export default NoWallet
