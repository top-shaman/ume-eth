import React from 'react'
import { bobble, filterIn, filterOut } from '../../resources/Libraries/Animation'
import Downvote from '../../resources/arrow.svg'
import './DownvoteButton.css'

class DownvoteButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      memeId: this.props.memeId,
      interface: this.props.interface
    }
    this.downvote = React.createRef()

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }
  async componentDidMount() {
  }
  async handleClick(e) {
    bobble('div#\\3' + this.state.memeId + '  p.' + e.target.className, 500)
    await this.downvoteClick()
  }
  handleMouseEnter(e) {
    e.preventDefault()
    let brightnessEnd, hue, elementName,
        brightnessStart = 0.7
    if(e.target.id==='downvote-button' &&
      this.downvote.style.filter!=='invert(0) sepia(1) brightness(0.4) saturate(10000%) hue-rotate(180deg)') {
      brightnessEnd = 0.4
      hue = 180
      elementName = 'div#\\3' + this.state.memeId + '  p#downvote-button'
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
  }
  handleMouseLeave(e) {
    e.preventDefault()
    let brightnessStart, hue, elementName,
        brightnessEnd = 0.6
    if(e.target.id==='downvote-button' || e.target.className==='downvote') {
      brightnessStart = 0.4
      hue = 180
      elementName = 'div#\\3' + this.state.memeId + '  p#downvote-button'
      filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
  }

  async downvoteClick() {
  }

  render() {
    return(
        <p
          className="downvote"
          id="downvote-button"
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          ref={Ref => this.downvote=Ref}
        >
          <img className="downvote" src={Downvote} alt="downvote button" id="downvote" width="16px" height="16px"/>
        </p>
    )
  }
}

export default DownvoteButton
