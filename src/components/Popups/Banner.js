import React from 'react'
import { zipUp, fadeIn } from '../../resources/Libraries/Animation'
import './Banner.css'

class Banner extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      bannerId: this.props.bannerId
    }
  }
  async componentDidMount() {
//    const banner = document.querySelector('div.Banner')
//    banner.style.top = 'calc(2% + ' + this.props.offsetY + 'px)'
    await this.formatId()
    if(this.props.type==='Waiting' || this.props.type==='Loading') {
      zipUp('div#Banner-' + this.state.bannerId, 500)
      fadeIn('div#Banner-' + this.state.bannerId, 500)
    }
    const banner = document.querySelector('div#Banner-' + this.state.bannerId)
    setTimeout(() => {
      banner.style.animation = 'drift 2s ease-in-out infinite'
    },500)
  }
  async formatId() {
    const regex = /\W/g
    this.setState({ bannerId: this.state.bannerId.replace(regex, '_') })
  }

  render() {
    return(
      <div
        id={'Banner-' + this.state.bannerId}
        className="Banner"
//        top={'calc(2% + ' + this.props.offsetY + 'px)'}
      >
        { this.props.type==='Writing'
            ? <div id="container-writing">
                <p id="Banner-header">
                  <span>Blockchain Action</span>
                </p>
                <p id="Banner-body">
                  <span id="plain">Writing </span>
                  <span id="highlight">{this.props.message}</span>
                  <span id="plain"> to Blockchain...</span>
                </p>
              </div>
            : this.props.type==='Waiting'
                ? <div id="container">
                    <p id="Banner-header">
                      <span>MetaMask Pending</span>
                    </p>
                    <p id="Banner-body">
                      <span id="plain">Please confirm </span>
                      <span id="highlight">{this.props.message}</span>
                      <span id="plain"> in MetaMask</span>
                    </p>
                  </div>
                : this.props.type==='Loading'
                    ? <div id="container-loading">
                        <p id="Banner-header">
                          <span>Loading {this.props.message}</span>
                        </p>
                        <p id="Banner-body">
                          <span>Reading Blockchain...</span>
                        </p>
                      </div>
                    : this.props.type==='Success'
                        ? <div id="container">
                            <p id="Banner-body">
                              <span>Success!</span>
                            </p>
                          </div>
                        : ''
          }
      </div>
    )
  }
}

export default Banner
