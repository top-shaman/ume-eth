import React from 'react'
import { bobble, filterIn, filterOut } from '../../resources/Libraries/Animation'
import Downvote from '../../resources/arrow.svg'
import './DownvoteButton.css'
import './DownvoteButtonMain.css'

class DownvoteButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      memeId: this.props.memeId,
      isMain: this.props.isMain,
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
    bobble('#' + this.downvote.id, 500)
    await this.downvoteClick()
  }
  handleMouseEnter(e) {
    e.preventDefault()
    let brightnessEnd, hue, elementName,
        brightnessStart = 0.7
    if(e.target===this.downvote &&
      this.downvote.style.filter!=='invert(0) sepia(1) brightness(0.4) saturate(10000%) hue-rotate(180deg)') {
      brightnessEnd = 0.4
      hue = 180
      elementName = '#' + this.downvote.id
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
    this.props.handleOverDownvote(this.downvote.style.filter)
  }
  handleMouseLeave(e) {
    e.preventDefault()
    let brightnessStart, hue, elementName,
        brightnessEnd = 0.6
    if(e.target===this.downvote || e.target.className===this.downvote.className) {
      brightnessStart = 0.4
      hue = 180
      elementName = '#' + this.downvote.id
      filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
    this.props.handleOverDownvote(this.downvote.style.filter)
  }

  async downvoteClick() {
  }

  render() {
    if(!this.state.isMain) {
      return(
          <p
            className="downvote"
            id={'downvote-' + this.state.memeId}
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            ref={Ref => this.downvote=Ref}
          >
            <img className="downvote" src={Downvote} alt="downvote button" id="downvote" width="16px" height="16px"/>
          </p>
      )
    }
    else {
      return(
          <p
            className="downvote"
            id={'downvote-' + this.state.memeId}
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            ref={Ref => this.downvote=Ref}
          >
            <img className="downvote" src={Downvote} alt="downvote button" id="downvote" width="21px" height="21px"/>
          </p>
      )
    }
  }
}

export default DownvoteButton
