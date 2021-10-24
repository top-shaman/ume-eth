import React from 'react'
import { fadeIn } from '../../resources/Libraries/Animation'
import './NoMetaMask.css'

class NoMetaMask extends React.Component {
  componentDidMount() {
    fadeIn('.NoMetaMask p#p1', 3000)
    setTimeout(()=>fadeIn('.NoMetaMask p#p2', 3000), 3000)
  }

  render() {
    return(
      <div className="NoMetaMask">
        <p id="p1">
          <a id="install" href="https://metamask.io/download">Please install <span>MetaMask</span> to use</a>
          <br/>
          <span id="ume">uMe</span>
        </p>
        <p id="p2">
          <a id="download" href="https://metamask.io/download">(You can download <span>MetaMask</span> here)</a>
        </p>
      </div>
    )
  }

}

export default NoMetaMask
