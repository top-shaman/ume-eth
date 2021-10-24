import React from 'react'
import Logo from '../../resources/UME-green.svg'
import { fadeIn, fadeOut, lightBlurToFadeIn, bobble, expandToFadeOut } from '../../resources/Libraries/Animation'
import './Enter.css'


class Enter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account,
      mouseOver: false,
      entered: false,
      registered: false
    }
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    fadeIn('.Enter p#p1', 3000)
    setTimeout(() => fadeIn('.Enter p#p2', 3000), 500)
    setTimeout(() => fadeIn('.Enter p#p3', 3000), 1000)
    setTimeout(() => lightBlurToFadeIn('.Enter p#title', 3000), 2500)
    setTimeout(() => lightBlurToFadeIn('.Enter img', 5000), 3200)
    setTimeout(() => fadeIn('.Enter p#p4', 3000), 6500)
  }
  componentWillUnmount() {
    fadeOut('img.Enter', 1500)
  }
  handleMouseOver(e) {
    e.preventDefault()
    this.setState({ mouseOver: true })
    if(!this.state.mouseOver) {
      bobble('img.Enter', 2100)
    }
  }
  handleMouseLeave(e) {
    e.preventDefault()
    this.setState({mouseOver: false})
  }
  handleClick(e) {
    e.preventDefault()
    expandToFadeOut('.Enter img', 2000)
    fadeOut('.Enter div#fade-box', 1000)
    setTimeout(() => {
      this.setState({ entered: true })
      this.props.hasEntered(this.state.entered)
    }, 1500)
  }

  render() {
    return(
      <div className="Enter" id="Enter">
         <article className="Enter">
            <div id="fade-box">
              <p id="p1">Hello,</p>
              <p id="p2">{this.props.account + ' !'}</p>
              <p id="p3">Welcome... to</p>
              <p id="title">uMe</p>
            </div>
            <img
              id="logo"
              src={Logo}
              alt="uMe logo"
              onMouseOver={this.handleMouseOver}
              onMouseLeave={this.handleMouseLeave}
              onClick={this.handleClick}
            />
            <div id="fade-box">
              <p id="p4">(Click logo to get started)</p>
            </div>
          </article>
      </div>
    );
  }
}

export default Enter
