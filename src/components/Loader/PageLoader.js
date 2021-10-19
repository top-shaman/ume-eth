import React from 'react'
import Logo from '../../resources/UME-green.svg'
import { expandFadeInBobble, expandToFadeOut } from '../../resources/Libraries/Animation'
import './PageLoader.css'


class PageLoader extends React.Component {
  componentDidMount() {
    expandFadeInBobble('div.PageLoader', 2000)
  }
  componentWillUnmount() {
    expandToFadeOut('div.PageLoader', 2000)
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
