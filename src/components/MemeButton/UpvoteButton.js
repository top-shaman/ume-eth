import React from 'react'
import { bobble, filterIn, filterOut } from '../../resources/Libraries/Animation'
import Upvote from '../../resources/arrow.svg'
import './UpvoteButton.css'

class UpvoteButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      memeId: this.props.memeId,
      interface: this.props.interface
    }
    this.upvote = React.createRef()

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }
  async componentDidMount() {
  }
  async handleClick(e) {
    bobble('#' + this.upvote.id, 500)
    await this.upvoteClick()
  }
  handleMouseEnter(e) {
    e.preventDefault()
    let brightnessEnd, hue, elementName,
        brightnessStart = 0.7
    if(e.target===this.upvote &&
      this.upvote.style.filter!=='invert(0) sepia(1) brightness(0.4) saturate(10000%) hue-rotate(310deg)') {
      brightnessEnd = 0.4
      hue = 310
      elementName = '#' + this.upvote.id
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
  }
  handleMouseLeave(e) {
    e.preventDefault()
    let brightnessStart, hue, elementName,
        brightnessEnd = 0.6
    if(e.target===this.upvote || e.target.className==='upvote') {
      brightnessStart = 0.4
      hue = 310
      elementName = '#' + this.upvote.id
      filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
  }

  async upvoteClick() {
  }

  render() {
    return(
        <p
          className="upvote"
          id={'upvote-' + this.state.memeId}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          ref={Ref => this.upvote=Ref}
        >
          <img className="upvote" src={Upvote} alt="upvote button" id="upvote" width="16px" height="16px"/>
        </p>
    )
  }
}

export default UpvoteButton
