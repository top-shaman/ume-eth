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
    fadeIn('p#p1', 3000)
    setTimeout(() => fadeIn('p#p2', 3000), 500)
    setTimeout(() => fadeIn('p#p3', 3000), 1000)
    setTimeout(() => lightBlurToFadeIn('p#title.Enter', 3000), 2500)
    setTimeout(() => lightBlurToFadeIn('img.Enter', 5000), 3200)
    setTimeout(() => fadeIn('p#p4', 3000), 6500)
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
    expandToFadeOut('img.Enter', 2000)
    fadeOut('div.fade-box', 1000)
    setTimeout(() => {
      this.setState({ entered: true })
      this.props.hasEntered(this.state.entered)
      localStorage.setItem('hasEntered', 'true')
    }, 1500)
  }

  render() {
    return(
      <div className="Enter" id="Enter">
         <article className="Enter">
            <div className="fade-box">
              <p className="Enter" id="p1">Hello,</p>
              <p className="Enter" id="p2">{this.props.account + ' !'}</p>
              <p className="Enter" id="p3">Welcome... to</p>
              <p className="Enter" id="title">uMe</p>
            </div>
            <img
              id="logo"
              className="Enter"
              src={Logo}
              onMouseOver={this.handleMouseOver}
              onMouseLeave={this.handleMouseLeave}
              onClick={this.handleClick}
            />
            <div className="fade-box">
              <p className="Enter" id="p4">(Click logo to get started)</p>
            </div>
          </article>
      </div>
    );
  }
}

export default Enter
