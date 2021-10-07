import React from 'react'
import { bobble, filterIn, filterOut } from '../../resources/Libraries/Animation'
import Rememe from '../../resources/rememe.svg'
import './RememeButtonMain.css'

class RememeButtonMain extends React.Component {
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
      reponses: this.props.responses,
      rememeCountTotal: this.props.rememeCountTotal
    }
    this.rememe = React.createRef()

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }
  componentDidMount() {
  }
  handleClick(e) {
    bobble('#' + this.rememe.id, 500)
    this.rememeClick()
  }
  handleMouseEnter(e) {
    e.preventDefault()
    if(this.rememe.style.filter!=='sepia(1) brightness(0.4) saturate(10000%) hue-rotate(140deg)') {
      const brightnessStart = 0.7,
            brightnessEnd = 0.4,
            hue = 140,
            elementName = '#' + this.rememe.id
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
  }
  handleMouseLeave(e) {
    e.preventDefault()
    const brightnessStart = 0.4,
          brightnessEnd = 0.6,
          hue = 140,
          elementName = '#' + this.rememe.id
    filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    this.props.handleOverRememe(this.rememe.style.filter)
  }

  async rememeClick() {
    this.props.handleRememe(
      [ this.state.username,
        this.state.address,
        this.state.author,
        this.state.text,
        this.state.memeId,
        this.state.parentId,
        this.state.originId
      ]
    )
    this.props.handleOverRememe(this.rememe.style.filter)
  }

  render() {
    return(
      <p
        className="RememeButtonMain"
        id={'rememe-' + this.state.memeId}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        ref={Ref => this.rememe=Ref}
      >
        <img className="rememe" src={Rememe} alt="rememe button" id="rememe" width="21px" height="21px"/>
      </p>
    )
  }
}

export default RememeButtonMain
