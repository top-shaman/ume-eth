import React, {Component} from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import Like from '../../resources/heart.svg'
import { isolatePlain, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
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
      isVisible: this.props.isVisible,
      visibleText: null
    }
  }
  componentDidMount() {
    this.formatText()
  }

  async formatText() {
    let text = this.props.text,
        plainMap = await isolatePlain(text),
        atMap = await isolateAt(text),
        hashMap = await isolateHash(text),
        combined = [],
        formatted = []
    combined = plainMap.concat(atMap, hashMap)
      .sort((a,b) => a[0]-b[0])
    if(combined!==null) {
      let i = 0
      combined.forEach(elem => {
        if(elem[2]==='plain')
          formatted.push(<span key={i} id="plain">{elem[1]}</span>)
        else if(elem[2]==='at')
          formatted.push(<a key={i} href={`/${elem[1].slice(1)}`} id="at">{elem[1]}</a>)
        else if(elem[2]==='hash')
          formatted.push(<a key={i} href={`/${elem[1]}`} id="hash">{elem[1]}</a>)
        i++
      })
    }
    this.setState({ visibleText: formatted })
  }
  render() {
    return(
      <div className="Meme" id="meme-container">
        <a id="profilePic" href={`/${this.state.address.slice(1)}`}>
          <ProfilePic account={this.state.author} id="Meme"/>
        </a>
        <div className="Meme" id="meme-body">
          <div id="meme-header">
            <a href={`/${this.state.address.slice(1)}`} id="username">{this.state.username}</a>
            <span id="address">{this.state.address}</span>
            <span id="time">{this.state.time}</span>
          </div>
          <div id="text-box">
            <p id="meme-text">
              {this.state.visibleText}
            </p>
          </div>
          <div id="meme-footer">
            <img src={Like} width="13px" height="13px"/>
          </div>
        </div>
      </div>
      );
    }
}

export default Meme
