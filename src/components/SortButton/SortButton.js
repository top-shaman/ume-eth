import React from 'react'
import './SortButton.css'

class SortButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      sort: this.props.sort,
      isOver: null
    }

    this.handleOver = this.handleOver.bind(this)
    this.handleLeave = this.handleLeave.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    if(this.state.sort==='time') {
      this.props.handleSort([e, 'boost'])
    }
    else if(this.state.sort==='boost') {
      this.props.handleSort([e, 'time'])
    }
  }
  handleOver(e) {
    e.preventDefault()
    if(!this.state.isOver) {
      this.setState({ isOver: true })
    }
  }
  handleLeave(e) {
    e.preventDefault()
    if(this.state.isOver) {
      this.setState({ isOver: false })
    }
  }

  render() {
    return(
      <p
        id="sort-button"
        className="SortButton"
        onClick={this.handleClick}
        onMouseOver={this.handleOver}
        onMouseLeave={this.handleLeave}
      >
        { !this.state.isOver
            ? <span>Sort: <span id="style">
                            <span id="style">{this.state.sort[0].toUpperCase() + this.state.sort.slice(1)}</span>
                          </span>
            </span>
            : <span>To:   <span id="style">
                            { this.state.sort==='time'
                                ? <span id="style">Boost</span>
                                : this.state.sort==='boost'
                                    ? <span id="style">Time</span>
                                    : ''
                            }
                          </span>
              </span>
        }
      </p>
    )
  }

}

export default SortButton
