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
    zipUp('div.Banner', 200)
    fadeIn('div.Banner', 200)
  }

  render() {
    return(
      <div
        className="Banner"
//        top={'calc(2% + ' + this.props.offsetY + 'px)'}
      >
        <p id="Banner-header">
          { this.state.type==='Writing'
            ? <span>Blockchain Action</span>
            : <span>Loading...</span>
          }
        </p>
        <p id="Banner-body">
          <span>Writing {this.state.message} to Blockchain...</span>
        </p>
      </div>
    )
  }
}

export default Banner
