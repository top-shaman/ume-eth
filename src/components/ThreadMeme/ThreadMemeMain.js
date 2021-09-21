import React, {Component} from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import { isolatePlain, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
import { fadeIn, zipUp, bobble, clickBobble, filterIn, filterOut, bgColorChange } from '../../resources/Libraries/Animation'
import "./ThreadMemeMain.css"

import Reply from '../../resources/reply.svg'
import Like from '../../resources/heart.svg'
import Liked from '../../resources/heart-filled.svg'
import ReMeme from '../../resources/rememe.svg'
import Arrow from '../../resources/arrow.svg'

class ThreadMemeMain extends Component {
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
      visibleText: this.props.text,
      renderOrder: this.props.renderOrder,
      alreadyRendered: this.props.alreadyRendered,
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userAccount: this.props.userAccount,
      userHasLiked: this.props.userHasLiked,
    }
    this.div = React.createRef()
    this.reply = React.createRef()
    this.like = React.createRef()
    this.rememe = React.createRef()
    this.upvote = React.createRef()
    this.downvote= React.createRef()

    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleButtonMouseOver = this.handleButtonMouseOver.bind(this)
    this.handleButtonMouseLeave = this.handleButtonMouseLeave.bind(this)
    this.handleProfileClick = this.handleProfileClick.bind(this)
    this.handleMemeClick = this.handleMemeClick.bind(this)
    this.handleOverMeme = this.handleOverMeme.bind(this)
    this.handleLeaveMeme = this.handleLeaveMeme.bind(this)
  }
  // lifecycle functions
  async componentDidMount() {
    if(!this.state.alreadyRendered) {
      //this.div.style.zIndex = 0
      this.div.style.opacity = 0
      setTimeout(() => {
        fadeIn('div#\\3' + this.state.memeId + ' ', 600)
        zipUp('div#\\3' + this.state.memeId + ' ', 600)
      }, 0 )
      //this.setState({ alreadyRendered: true })
    } else if(this.state.alreadyRendered) {
      this.div.style.opacity = 1
    }
    this.mounted = true
    await this.formatText()
    await this.userHasLiked()
  }
  async componentWillUnmount() {
    this.mounted = false
  }

  //event handlers
  handleButtonClick(e) {
    e.preventDefault()
    bobble('div#\\3' + this.state.memeId + '  p.' + e.target.className, 500)
    if(e.target.className==='reply') {
      this.replyClick()
      console.log('memeId: ' + this.state.memeId)
      console.log('parentId: ' + this.state.parentId)
      console.log('originId: ' + this.state.originId)

    } else if(e.target.className==='like') {
      this.likeClick()
    } else if(e.target.className==='rememe') {
    } else if(e.target.className==='upvote') {
    } else if(e.target.className==='downvote') {
      //const element = 'div#\\3' + this.state.memeId + '  p.' + e.target.className
      //document.querySelector(element).style.transform = 'rotate(180deg)'
    }
    this.props.handleRefresh(e)
  }
  handleButtonMouseOver(e) {
    let brightnessEnd, hue, elementName,
        brightnessStart = 0.7
    if(e.target.className==='reply' &&
      this.reply.style.filter!=='invert(0) sepia(1) brightness(0.43) saturate(10000%) hue-rotate(85deg)') {
      brightnessEnd = 0.43
      hue = 85
      elementName = 'div#\\3' + this.state.memeId + '  p#reply-button'
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    } else if(e.target.className==='like') {
      if(e.target.id==='like-button' &&
        this.like.style.filter!=='invert(0) sepia(1) brightness(0.4) saturate(10000%) hue-rotate(285deg)') {
        brightnessEnd = 0.4
        hue = 285
        elementName = 'div#\\3' + this.state.memeId + '  p#like-button'
        filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
      } else if(e.target.id==='like-button-liked') {
        elementName = 'div#\\3' + this.state.memeId + '  p#like-button-liked'
        bobble(elementName, 500)
      }
    } else if(e.target.className==='rememe' &&
              this.rememe.style.filter!=='invert(0) sepia(1) brightness(0.43) saturate(10000%) hue-rotate(140deg)') {
      brightnessEnd = 0.4
      hue = 140
      elementName = 'div#\\3' + this.state.memeId + '  p#rememe-button'
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    } else if(e.target.className==='upvote' &&
              this.upvote.style.filter!=='invert(0) sepia(1) brightness(0.43) saturate(10000%) hue-rotate(310deg)') {
      brightnessEnd = 0.43
      hue = 310
      elementName = 'div#\\3' + this.state.memeId + '  p#upvote-button'
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    } else if(e.target.className==='downvote' &&
              this.downvote.style.filter!=='invert(0) sepia(1) brightness(0.43) saturate(10000%) hue-rotate(180deg)') {
      brightnessEnd = 0.43
      hue = 180
      elementName = 'div#\\3' + this.state.memeId + '  p#downvote-button'
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
    this.props.handleOverButton(this.div.style.filter)
  }
  handleButtonMouseLeave(e) {
    let brightnessStart, hue, elementName,
        brightnessEnd = 0.6
    if(e.target.className==='reply') {
      brightnessStart = 0.43
      hue = 85
      elementName = 'div#\\3' + this.state.memeId + '  p#reply-button'
      filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    } else if(e.target.className==='like') {
      if(e.target.id==='like-button' || e.target.id==='like' || e.target.id==='like-count') {
        brightnessStart = 0.4
        hue = 285
        elementName = 'div#\\3' + this.state.memeId + '  p#like-button'
        filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
      }
      else if(e.target.id==='like-button-liked') {
        elementName = 'div#\\3' + this.state.memeId + '  p#like-button-liked'
        bobble(elementName, 500)
      }
    } else if(e.target.className==='rememe') {
      brightnessStart = 0.4
      hue = 140
      elementName = 'div#\\3' + this.state.memeId + '  p#rememe-button'
      filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    } else if(e.target.className==='upvote') {
      brightnessStart = 0.43
      hue = 310
      elementName = 'div#\\3' + this.state.memeId + '  p#upvote-button'
      filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    } else if(e.target.className==='downvote') {
      brightnessStart = 0.43
      hue = 180
      elementName = 'div#\\3' + this.state.memeId + '  p#downvote-button'
      filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
  }
  handleProfileClick(e) {
    e.preventDefault()
    this.props.handleToProfile([
      this.state.username,
      this.state.address,
      this.state.author
    ])
    localStorage.setItem('focusPage', 'profile')
    localStorage.setItem('userInfo', this.state.username + ',' + this.state.address + ',' + this.state.author)
  }
  handleMemeClick(e) {
    e.preventDefault()
    if(e.target.className!=='reply' &&// !e.target.id!=='reply-button' && !e.target.id!=='reply-count' &&
       e.target.className!=='like' && //!e.target.id!=='like-button' && !e.target.id!=='like-count' &&
       e.target.className!=='rememe' && //!e.target.id!=
       e.target.className!=='upvote' && e.target.className!=='downvote') {
      this.props.handleToThread([
        this.state.memeId,
        this.state.username,
        this.state.address,
        this.state.text,
        this.state.time,
        this.state.responses,
        this.state.likes,
        this.state.likers,
        this.state.rememeCount,
        this.state.rememes,
        this.state.quoteCount,
        this.state.quoteMemes,
        this.state.repostId,
        this.state.parentId,
        this.state.originId,
        this.state.author,
        this.state.isVisible,
        this.state.visibleText,
        this.state.userHasLiked
      ])
    }
  }

  handleOverMeme(e) {
    e.preventDefault()
    const element = 'div#\\3' + this.state.memeId
    if(this.div.style.backgroundColor!=='#313131') {
      bgColorChange(element, '1D1F22', '313131',  500)
    } else if(this.div.style.backgroundColor==='#313131') {
      document.querySelector(element).style.backgroundColor = '#313131'
    }
    this.props.handleOverMeme(this.div.style.backgroundColor)
  }
  handleLeaveMeme(e) {
    e.preventDefault()
    const elementName = 'div#\\3' + this.state.memeId
    bgColorChange(elementName, '313131', '1D1F22',  500)
  }

  async replyClick() {
    this.props.handleReply(
      [ this.state.username,
        this.state.address,
        this.state.author,
        this.state.text,
        this.state.memeId,
        this.state.parentId
      ]
    )
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
  async userHasLiked() {
    const userHasLiked = await this.props.memeStorage.methods.getLikers(this.props.memeId).call()
      .then(e => e.includes(this.props.userAccount))
    this.setState({
      userHasLiked
    })
  }

  render() {
    const rememeCountTotal = parseInt(this.state.rememeCount) + parseInt(this.state.quoteCount)
    return(
      <div
        className="ThreadMemeMain"
        id={this.state.memeId}
        ref={Ref => this.div=Ref}
        onClick={this.handleThreadMemeMainClick}
        onMouseEnter={this.handleOverThreadMemeMain}
        onMouseLeave={this.handleLeaveThreadMemeMain}
      >
        <section id="profilePic">
          <a
            id="profilePic"
            href={`/${this.state.address.slice(1)}`}
            onClick={this.handleProfileClick}
          >
            <ProfilePic account={this.state.author} id="ThreadMemeMain"/>
          </a>
        </section>
        <div id="ThreadMemeMain-body">
          <div id="ThreadMemeMain-header">
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
            <p id="ThreadMemeMain-text">
              {this.state.visibleText}
            </p>
          </div>
          <div id="ThreadMemeMain-footer">
            <p
              className="reply"
              id="reply-button"
              onClick={this.handleButtonClick}
              onMouseEnter={this.handleButtonMouseOver}
              onMouseLeave={this.handleButtonMouseLeave}
              ref={Ref => this.reply=Ref}
            >
              <img className="reply" src={Reply} id="reply" width="13px" height="13px"/>
              <span className="reply" id="reply-count">{this.state.responses.length}</span>
            </p>
            { this.state.userHasLiked
              ? <p
                  className="like"
                  id="like-button-liked"
                  onClick={this.handleButtonClick}
                  onMouseEnter={this.handleButtonMouseOver}
                  onMouseLeave={this.handleButtonMouseLeave}
                >
                  <img className="like" src={Liked} id="like" width="13px" height="13px"/>
                  <span className="like" id="like-count">{this.state.likes}</span>
                </p>
              : <p
                  className="like"
                  id="like-button"
                  onClick={this.handleButtonClick}
                  onMouseEnter={this.handleButtonMouseOver}
                  onMouseLeave={this.handleButtonMouseLeave}
                  ref={Ref => this.like=Ref}
                >
                  <img className="like" src={Like} id="like" width="13px" height="13px"/>
                  <span className="like" id="like-count">{this.state.likes}</span>
                </p>
            }
            <p
              className="rememe"
              id="rememe-button"
              onClick={this.handleButtonClick}
              onMouseEnter={this.handleButtonMouseOver}
              onMouseLeave={this.handleButtonMouseLeave}
              ref={Ref => this.rememe=Ref}
            >
              <img className="rememe" src={ReMeme} id="rememe" width="13px" height="13px"/>
              <span className="rememe" id="rememe-count">
                {rememeCountTotal}
              </span>
            </p>
            <p
              className="upvote"
              id="upvote-button"
              onClick={this.handleButtonClick}
              onMouseEnter={this.handleButtonMouseOver}
              onMouseLeave={this.handleButtonMouseLeave}
              ref={Ref => this.upvote=Ref}
            >
              <img className="upvote" src={Arrow} id="upvote" width="13px" height="13px"/>
            </p>
            <p
              className="downvote"
              id="downvote-button"
              onClick={this.handleButtonClick}
              onMouseEnter={this.handleButtonMouseOver}
              onMouseLeave={this.handleButtonMouseLeave}
              ref={Ref => this.downvote=Ref}
            >
              <img className="downvote" src={Arrow} id="downvote" width="13px" height="13px"/>
            </p>
          </div>
        </div>
      </div>
      );
    }
}

export default ThreadMemeMain
