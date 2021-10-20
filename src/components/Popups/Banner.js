import React from 'react'
import { zipUp, fadeIn } from '../../resources/Libraries/Animation'
import './Banner.css'

class Banner extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      type: this.props.type,
      message: this.props.message
    }
  }
  componentDidMount() {
//    const banner = document.querySelector('div.Banner')
//    banner.style.top = 'calc(2% + ' + this.props.offsetY + 'px)'
    zipUp('div.Banner', 500)
    fadeIn('div.Banner', 500)
    const banner = document.querySelector('div.Banner')
    setTimeout(() => {
      banner.style.animation = 'drift 2s ease-in-out infinite'
    },500)
  }

  render() {
    return(
      <div
        className="Banner"
//        top={'calc(2% + ' + this.props.offsetY + 'px)'}
      >
        { this.state.type==='Writing'
            ? <div id="container">
                <p id="Banner-header">
                  <span>Blockchain Action</span>
                </p>
                <p id="Banner-body">
                  <span>Writing {this.state.message} to Blockchain...</span>
                </p>
              </div>
            : this.state.type==='Waiting'
                ? <div id="container">
                    <p id="Banner-header">
                      <span>MetaMask Pending</span>
                    </p>
                    <p id="Banner-body">
                      <span id="plain">Please confirm </span>
                      <span id="highlight">{this.state.message}</span>
                      <span id="plain"> in MetaMask</span>
                    </p>
                  </div>
                : this.state.type==='Loading'
                    ? <div id="container">
                        <p id="Banner-header">
                          <span>Blockchain Action</span>
                        </p>
                        <p id="Banner-body">
                          <span>Writing {this.state.message} to Blockchain...</span>
                        </p>
                      </div>
                    : ''
          }
      </div>
    )
  }
}

export default Banner
