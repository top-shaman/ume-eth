import React, {Component} from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import { isolatePlain, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
import { fadeIn, zipUp, bobble } from '../../resources/Libraries/Animation'
import "./Meme.css"

import Reply from '../../resources/reply.svg'
import Like from '../../resources/heart.svg'
import ReMeme from '../../resources/rememe.svg'
import Arrow from '../../resources/arrow.svg'

class Meme extends Component {
  constructor(props) {
    super(props)
    this.state = {
      memeId: this.props.memeId,
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
      visibleText: null,
      renderOrder: this.props.renderOrder,
      alreadyRendered: this.props.alreadyRendered,
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userAccount: this.props.userAccount,
      userHasLiked: null
    }
    this.div = React.createRef()

    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleProfileClick = this.handleProfileClick.bind(this)
  }
  async componentDidMount() {
    if(this.state.alreadyRendered===false) {
      this.div.style.zIndex = 0
      this.div.style.opacity = 0
      setTimeout(() => {
        fadeIn('div#\\3' + this.state.memeId + ' ', 600)
        zipUp('div#\\3' + this.state.memeId + ' ', 600)
      }, this.state.renderOrder * 20)
      this.setState({ alreadyRendered: true })
    } else if(this.state.alreadyRendered===true) {
      this.div.style.opacity = 1
    }
    this.formatText()
    const userHasLiked = await this.props.memeStorage.methods.getLikers(this.props.memeId).call()
    this.setState({
      userHasLiked: userHasLiked.includes(this.props.userAccount)
    })
  }
  handleButtonClick(e) {
    bobble('div#\\3' + this.state.memeId + '  p.' + e.target.className, 500)
    if(e.target.className==='like') this.likeClick()
  }
  handleProfileClick(e) {
    e.preventDefault()
    this.props.handleToProfile([
      this.state.username,
      this.state.address,
      this.state.author
    ])
    localStorage.setItem('focusPage', 'profile')
    localStorage.setItem('pageInfo', this.state.username + ',' + this.state.address + ',' + this.state.author)
  }
  async likeClick() {
    console.log('accessing account: ' + this.props.userAccount)
    console.log('memeId: ' + this.state.memeId)
    await this.props.interface.methods.likeMeme(this.state.userAccount, this.state.memeId)
      .send({from: this.state.userAccount})
    if(!this.state.userHasLiked) {
      this.setState({
        likes: this.state.likes++,
        userHasLiked: true
      })
    }
    else this.setState({
      likes: this.state.likes--,
      userHasLiked: false
    })
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
      <div className="Meme" id={this.state.memeId} ref={Ref => this.div=Ref}>
        <a
          id="profilePic"
          href={`/${this.state.address.slice(1)}`}
          onClick={this.handleProfileClick}
        >
          <ProfilePic account={this.state.author} id="Meme"/>
        </a>
        <div id="meme-body">
          <div id="meme-header">
            <a
              href={`/${this.state.address.slice(1)}`}
              id="username"
              onClick={this.handleProfileClick}
            >
              {this.state.username}
            </a>
            <span id="address">{this.state.address}</span>
            <span id="time">{this.state.time}</span>
          </div>
          <div id="text-box">
            <p id="meme-text">
              {this.state.visibleText}
            </p>
          </div>
          <div id="meme-footer">
            <p className="reply" id="reply-button" onClick={this.handleButtonClick}>
              <img className="reply" src={Reply} id="reply" width="13px" height="13px"/>
              <span className="reply" id="reply-count">{this.state.responses.length}</span>
            </p>
            <p className="like" id="like-button" onClick={this.handleButtonClick}>
              <img className="like" src={Like} id="like" width="13px" height="13px"/>
              <span className="like" id="like-count">{this.state.likes}</span>
            </p>
            <p className="rememe" id="rememe-button" onClick={this.handleButtonClick}>
              <img className="rememe" src={ReMeme} id="rememe" width="13px" height="13px"/>
              <span className="rememe" id="like-count">
                {parseInt(this.state.rememeCount) + parseInt(this.state.quoteCount)}
              </span>
            </p>
            <p className="upvote" id="upvote-button" onClick={this.handleButtonClick}>
              <img className="upvote" src={Arrow} id="upvote" width="13px" height="13px"/>
            </p>
            <p className="downvote" id="downvote-button" onClick={this.handleButtonClick}>
              <img className="downvote" src={Arrow} id="downvote" width="13px" height="13px"/>
            </p>
          </div>
        </div>
      </div>
      );
    }
}

export default Meme
