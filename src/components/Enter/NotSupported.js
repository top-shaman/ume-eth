import React from 'react'
import { fadeIn } from '../../resources/Libraries/Animation'
import './NotSupported.css'

class NotSupported extends React.Component {
  componentDidMount() {
    fadeIn('.NotSupported p#p1', 3000)
    setTimeout(()=>fadeIn('.NotSupported p#p2', 3000), 3000)
  }

  render() {
    return(
      <div className="NotSupported">
        <p id="p1">
          <span>Must have </span>
          <br/>
          <a href="https://www.google.com/intl/en/chrome/" target="_blank">Chrome</a>, <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank">Firefox</a>, or <a href="https://brave.com/download/" target="_blank">Brave</a>
          <br/>
          <span> installed to use </span>
          <br/>
          <span id="ume">uMe</span>
        </p>
      </div>
    )
  }

}

export default NotSupported
