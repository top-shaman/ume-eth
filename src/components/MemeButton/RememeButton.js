import React from 'react'
import { bobble, filterIn, filterOut } from '../../resources/Libraries/Animation'
import Rememe from '../../resources/rememe.svg'
import './RememeButton.css'

class RememeButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      memeId: this.props.memeId,
      username: this.props.username,
      address: this.props.address,
      text: this.props.text,
      author: this.props.author,
      parentId: this.props.parentId,
      reponses: this.props.responses,
      isMain: this.props.isMain,
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
    this.props.handleOverRememe(this.rememe.style.filter)
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
        this.state.parentId
      ]
    )
  }

  render() {
    if(!this.state.isMain) {
      return(
        <p
          className="rememe"
          id={'rememe-' + this.state.memeId}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          ref={Ref => this.rememe=Ref}
        >
          <img className="rememe" src={Rememe} alt="rememe button" id="rememe" width="16px" height="16px"/>
          <span className="rememe" id="rememe-count">{this.state.rememeCountTotal}</span>
        </p>
      )
    }
    else {
      return(
        <p
          className="rememe"
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
}

export default RememeButton
