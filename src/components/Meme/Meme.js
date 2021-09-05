import React, {Component} from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import { fadeIn } from '../../resources/Libraries/Animation'
import "./Meme.css"

class Meme extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      username: this.props.username,
      address: this.props.address,
      text: this.props.text,
      time: this.props.time,
      boosts: this.props.boosts,
      likes: this.props.likes,
      likers: this.props.likers,
      rememeCount: this.props.rememeCount,
      rememes: this.props.rememes,
      quoteCount: this.props.quoteCount,
      quoteMemes: this.props.quoteMemes,
      responses: this.props.responses,
      tags: this.props.tags,
      repostId: this.props.repostId,
      parentId: this.props.parentId,
      originId: this.props.originId,
      author: this.props.author,
      isVisible: this.props.isVisible
    }
  }
  componentDidMount() {
    //fadeIn('div#meme-container.Meme', 1200)
  }
  render() {
    return(
      <div className="Meme" id="meme-container">
        <ProfilePic account={this.state.author} id="Meme"/>
        <div className="Meme" id="meme-body">
          <div className="Meme" id="meme-header">
            <a className="Meme" id="username">{this.state.username}</a>
            <span className="Meme" id="address">{this.state.address}</span>
            <span className="Meme" id="time">{this.state.time}</span>
          </div>
          <div className="Meme" id="text-box">
            <p className="Meme" id="meme-text">
              {this.props.text}
            </p>
          </div>
        </div>
      </div>
      );
    }
}

export default Meme
