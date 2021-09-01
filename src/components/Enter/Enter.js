import React from 'react'
import Logo from '../../resources/UME-green.svg'
import './Enter.css'

function easeInOut (t, b, c) {
  if ((t /= 1 / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

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
    this.fadeIn('p#p1', 3000)
    setTimeout(() => this.fadeIn('p#p2', 3000), 500)
    setTimeout(() => this.fadeIn('p#p3', 3000), 1000)
    setTimeout(() => this.fadeBlur('p#title.Enter', 3000), 2500)
    setTimeout(() => this.fadeBlur('img.Enter', 5000), 3200)
    setTimeout(() => this.fadeIn('p#p4', 3000), 6500)
  }
  componentWillUnmount() {
    this.fadeOut('img.Enter', 1500)
  }
  handleMouseOver(e) {
    e.preventDefault()
    this.setState({ mouseOver: true })
    if(!this.state.mouseOver) {
      this.bobble()
    }
  }
  handleMouseLeave(e) {
    e.preventDefault()
    this.setState({mouseOver: false})
  }
  handleClick(e) {
    e.preventDefault()
    this.logoExpand()
    this.fadeOut('div.fade-box', 1000)
    setTimeout(() => {
      this.setState({ entered: true })
      this.props.hasEntered(this.state.entered)
      localStorage.setItem('hasEntered', 'true')
    }, 1500)
  }

  bobble() {
    let start = performance.now()
    const element = document.querySelector('img.Enter')
    let phase = 0
    let progress
    requestAnimationFrame(function animate(time) {
      let duration = 300
      let fractionOfTime = (time - start) / duration
      if (fractionOfTime > 1 && phase < 6) {
        fractionOfTime = 0
        start = performance.now()
        phase++
      } else if (fractionOfTime > 1) fractionOfTime = 1
      if(phase===0) progress = easeInOut(fractionOfTime, 1, -0.04)
      else if(phase===1) progress = easeInOut(fractionOfTime, 0.96, 0.06)
      else if(phase===2) progress = easeInOut(fractionOfTime, 1.02, -0.04)
      else if(phase===3) progress = easeInOut(fractionOfTime, 0.98, 0.035)
      else if(phase===4) progress = easeInOut(fractionOfTime, 1.015, -0.02)
      else if(phase===5) progress = easeInOut(fractionOfTime, 0.995, 0.007)
      else if(phase===6) progress = easeInOut(fractionOfTime, 1.002, -0.002)
      element.style.transform = 'scale(' + progress + ')'
      if (fractionOfTime < 1) requestAnimationFrame(animate)
      else element.style.transform = 'scale(' + 1 + ')'
    })
  }
  logoExpand() {
    const element = document.querySelector('img.Enter')
    let start = performance.now()
    requestAnimationFrame(function animation(time) {
      const duration = 2000
      let fractionOfTime = (time - start) / duration

      if(fractionOfTime > 1) fractionOfTime = 1
      let progress1 = easeInOut(fractionOfTime, 1, 49)
      let progress2 = easeInOut(fractionOfTime, 1, -1)
      element.style.transform = 'scale(' + progress1 + ')'
      element.style.opacity = progress2
      if(fractionOfTime < 1) requestAnimationFrame(animation)
    })
  }
  fadeIn(element, duration) {
    const elements = document.querySelectorAll(element)
    let start = performance.now()
    requestAnimationFrame(function animation(time) {
      let fractionOfTime = (time - start) / duration
      if (fractionOfTime > 1) fractionOfTime = 1
      let progress = easeInOut(fractionOfTime, 0, 1)
      elements.forEach(e => e.style.opacity = progress)
      if (fractionOfTime < 1) requestAnimationFrame(animation)
    })
  }
  fadeBlur(element, duration) {
    const elements = document.querySelectorAll(element)
    let start = performance.now()
    requestAnimationFrame(function animation(time) {
      let fractionOfTime = (time - start) / duration
      if (fractionOfTime > 1) fractionOfTime = 1
      let progress = easeInOut(fractionOfTime, 0, 1)
      elements.forEach(e => {
        e.style.opacity = progress
        e.style.filter = 'blur(' + (1/ progress - 1) + 'px)'
      })
      if (fractionOfTime < 1) requestAnimationFrame(animation)
    })

  }
  fadeOut(element, duration) {
    const elements = document.querySelectorAll(element)
    let start = performance.now()
    requestAnimationFrame(function animation(time) {
      let fractionOfTime = (time - start) / duration
      if (fractionOfTime > 1) fractionOfTime = 1
      let progress = easeInOut(fractionOfTime, 1, -1)
      elements.forEach(e => e.style.opacity = progress)
      if (fractionOfTime < 1) requestAnimationFrame(animation)
    })
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
