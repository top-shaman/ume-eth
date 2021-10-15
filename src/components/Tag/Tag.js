import React from 'react'

import './Tag.css'

class Tag extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      address: this.props.address
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    this.props.handleTag(this.state.address)
  }

  render() {
    return(
      <a
        href={this.state.address.slice(1)}
        id="at"
        onClick={this.handleClick}
      >
        {this.state.address}
      </a>
    )
  }
}

export default Tag
