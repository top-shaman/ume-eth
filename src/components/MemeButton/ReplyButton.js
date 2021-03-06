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
      author: this.props.author,
      parentId: this.props.parentId,
      originId: this.props.originId,
      responses: this.props.responses,
      isOver: this.props.isOver,
      isMain: this.props.isMain
    }
    this.reply = React.createRef()

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }
  componentDidMount() {
    if(this.state.isOver) {
      this.reply.style.filter = 'invert(0) sepia(1) brightness(0.43) saturate(10000%) hue-rotate(85deg)'
    }
  }
  handleClick(e) {
    bobble('#' + this.reply.id, 500)
    this.replyClick()
  }
  handleMouseEnter(e) {
    e.preventDefault()
    if(this.reply.style.filter!=='invert(0) sepia(1) brightness(0.43) saturate(10000%) hue-rotate(85deg)') {
      const brightnessStart = 0.7,
            brightnessEnd = 0.43,
            hue = 85,
            elementName = '#' + this.reply.id
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
    this.props.handleOverReply(true)
  }
  handleMouseLeave(e) {
    e.preventDefault()
    const brightnessStart = 0.43,
          brightnessEnd = 0.6,
          hue = 85,
          elementName = '#' + this.reply.id
    filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    this.props.handleOverReply(false)
  }

  async replyClick() {
    this.props.handleReply(
      [ this.state.username,
        this.state.address,
        this.state.author,
        this.state.text,
        this.state.memeId,
        this.state.parentId,
        this.state.originId
      ]
    )
  }

  render() {
    if(!this.state.isMain) {
      return(
        <p
          className="reply"
          id={"reply-" + this.state.memeId}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          ref={Ref => this.reply=Ref}
        >
          <img className="reply" src={Reply} alt="reply button" id="reply" width="16px" height="16px"/>
          <span className="reply" id="reply-count">{this.state.responses!==undefined ? this.state.responses.length : 0}</span>
      </p>
      )
    } else {
      return(
        <p
          className="reply"
          id={'reply-' + this.state.memeId}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          ref={Ref => this.reply=Ref}
        >
          <img className="reply" src={Reply} alt="reply button" id="reply" width="21px" height="21px"/>
        </p>
      )
    }
  }
}

export default ReplyButton
