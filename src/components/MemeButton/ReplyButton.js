import React from 'react'
import { bobble, filterIn, filterOut } from '../../resources/Libraries/Animation'
import Reply from '../../resources/reply.svg'
import './ReplyButton.css'

class ReplyButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      memeId: this.props.memeId,
      username: this.props.username,
      address: this.props.address,
      text: this.props.text,
      memeId: this.props.memeId,
      author: this.props.author,
      parentId: this.props.parentId,
      reponses: this.props.responses
    }
    this.reply = React.createRef()

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }
  componentDidMount() {
  }
  handleClick(e) {
    bobble('div#\\3' + this.state.memeId + '  p.' + e.target.className, 500)
    this.replyClick()
  }
  handleMouseEnter(e) {
    e.preventDefault()
    if(this.reply.style.filter!=='invert(0) sepia(1) brightness(0.43) saturate(10000%) hue-rotate(85deg)') {
      const brightnessStart = 0.7,
            brightnessEnd = 0.43,
            hue = 85,
            elementName = 'div#\\3' + this.state.memeId + '  p#reply-button'
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
  }
  handleMouseLeave(e) {
    e.preventDefault()
    const brightnessStart = 0.43,
          brightnessEnd = 0.6,
          hue = 85,
          elementName = 'div#\\3' + this.state.memeId + '  p#reply-button'
    filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
  }

  async replyClick() {
    this.props.handleReply(
      [ this.state.username,
        this.state.address,
        this.state.author,
        this.state.text,
        this.state.memeId,
        this.state.parentId
      ]
    )
  }

  render() {
    return(
      <p
        className="reply"
        id="reply-button"
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        ref={Ref => this.reply=Ref}
      >
        <img className="reply" src={Reply} id="reply" width="13px" height="13px"/>
        <span className="reply" id="reply-count">{this.state.responses!==undefined ? this.state.responses.length : 0}</span>
      </p>
    )
  }
}

export default ReplyButton
