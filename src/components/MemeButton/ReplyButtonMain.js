import React from 'react'
import { bobble, filterIn, filterOut } from '../../resources/Libraries/Animation'
import Reply from '../../resources/reply.svg'
import './ReplyButtonMain.css'

class ReplyButtonMain extends React.Component {
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
      responses: this.props.responses
    }
    this.reply = React.createRef()

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }
  componentDidMount() {
  }
  handleClick(e) {
    bobble('#' + this.reply.id, 500)
    console.log(this.state.responses)
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
  }
  handleMouseLeave(e) {
    e.preventDefault()
    const brightnessStart = 0.43,
          brightnessEnd = 0.6,
          hue = 85,
          elementName = '#' + this.reply.id
    filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
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
    return(
      <p
        className="ReplyButtonMain"
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

export default ReplyButtonMain
