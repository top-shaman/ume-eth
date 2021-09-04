import React, {Component} from 'react'
import "./Meme.css"

class Meme extends Component {
  constructor(props) {
    super(props)
    this.setState({
      text: this.props.text

    })
  }
  render() {
    return(
      <div className="Meme">
        <div className="Meme" id="text-box">
          <p className="Meme" id="meme-text">
            {this.props.text}
          </p>
        </div>
      </div>
    );
  }
}

export default Meme
