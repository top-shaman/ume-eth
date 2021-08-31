import react, {Component} from 'react'
import logo from '../../resources/UME-green-bright-cropped-720px.png'
import './EnterLogo.css'


// contour function for animation
function easeInOut (t, b, c) {
  if ((t /= 1 / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

class EnterLogo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mouseOver: false,
    }
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleMouseOver(event) {
    event.preventDefault()
    this.setState({ mouseOver: true })
    if(!this.state.mouseOver) {
      this.bobble()
    }
  }
  handleMouseLeave(event) {
    event.preventDefault()
    this.setState({mouseOver: false})
  }

  handleClick(event) {
    event.preventDefault()
    this.logoSpinOut()
  }

  bobble() {
    let start = performance.now()
    const element = document.querySelector('div[class="enterLogo"]')
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

  logoSpinOut() {
    const element = document.querySelector('div[class="enterLogo"]')
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
  render() {
    return(
      <div className="enterLogo" id="logo">
        <img
          src={logo}
          alt="logo"
          className="enterLogo"
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseLeave}
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

export default EnterLogo
