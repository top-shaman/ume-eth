import React from 'react'
import { bobble, filterIn, filterOut } from '../../resources/Libraries/Animation'
import Upvote from '../../resources/arrow.svg'
import './UpvoteButtonMain.css'

class UpvoteButtonMain extends React.Component {
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
    bobble('div#\\3' + this.state.memeId + '  p.' + e.target.className, 500)
    await this.upvoteClick()
  }
  handleMouseEnter(e) {
    e.preventDefault()
    let brightnessEnd, hue, elementName,
        brightnessStart = 0.7
    if(e.target.id==='upvote-button' &&
      this.upvote.style.filter!=='invert(0) sepia(1) brightness(0.4) saturate(10000%) hue-rotate(310deg)') {
      brightnessEnd = 0.4
      hue = 310
      elementName = 'div#\\3' + this.state.memeId + '  p#upvote-button'
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
  }
  handleMouseLeave(e) {
    e.preventDefault()
    let brightnessStart, hue, elementName,
        brightnessEnd = 0.6
    if(e.target.id==='upvote-button' || e.target.className==='upvote') {
      brightnessStart = 0.4
      hue = 310
      elementName = 'div#\\3' + this.state.memeId + '  p#upvote-button'
      filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
  }

  async upvoteClick() {
  }

  render() {
    return(
        <p
          className="upvote"
          id="upvote-button"
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          ref={Ref => this.upvote=Ref}
        >
          <img className="upvote" src={Upvote} alt="upvote button" id="upvote" width="21px" height="21px"/>
        </p>
    )
  }
}

export default UpvoteButtonMain
