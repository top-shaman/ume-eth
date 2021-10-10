import React from 'react'
import './UpvotePopup.css'

class UpvotePopup extends React.Component {
  constructor(props) {
    super(props)

    this.div = React.createRef()

    this.state = {
      account: this.props.account,
      memeId: this.props.memeId,
      positionX: this.props.positionX,
      positionY: this.props.positionY,
      interface: this.props.interface
    }
  }
  componentDidMount() {
    this.div.style.left = `${this.state.positionX}px`
    this.div.style.top = `${this.state.positionY}px`
    this.div.style.display = 'block'
    console.log(this.state.memeId)
  }
  componentDidUpdate() {
    this.div.style.left = `${this.props.positionX}px`
    this.div.style.top = `${this.props.positionY}px`

  }

  render() {
    return(
      <div
        id="upvote-popup"
        ref={Ref=>this.div=Ref}
      >
        hello?
      </div>
    )
  }

}

export default UpvotePopup
