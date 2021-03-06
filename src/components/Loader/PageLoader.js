import React from 'react'
import Logo from '../../resources/UME-green.svg'
import { expandFadeInBobble, expandToFadeOut } from '../../resources/Libraries/Animation'
import './PageLoader.css'


class PageLoader extends React.Component {
  componentDidMount() {
    const app = document.querySelectorAll('div.App')
    app.forEach(e=>e.style.overflow = 'hidden')
    expandFadeInBobble('div.PageLoader', 2000)
  }
  componentWillUnmount() {
    expandToFadeOut('div.PageLoader', 1500)
  }
  render() {
    return(
      <div className="PageLoader">
        <img src={Logo} alt="logo" id="logo"/>
        <div id="Border-Spinner"/>
      </div>
    )
  }
}

export default PageLoader
