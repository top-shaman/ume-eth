import React from 'react'
import ReplyButton from '../MemeButton/ReplyButton'
import LikeButton from '../MemeButton/LikeButton'
import RememeButton from '../MemeButton/RememeButton'
import UpvoteButton from '../MemeButton/UpvoteButton'
import DownvoteButton from '../MemeButton/DownvoteButton'
import ReplyInThread from '../ReplyInThread/ReplyInThread'
import ProfilePic from '../ProfilePic/ProfilePic'
import { isolatePlain, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
import { fadeIn, zipUp, bgColorChange } from '../../resources/Libraries/Animation'
import "./ThreadMemeMain.css"

class ThreadMemeMain extends React.Component {
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
    this.handleReply = this.handleReply.bind(this)
    this.handleLike = this.handleLike.bind(this)
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
    //await this.userHasLiked()
  }
  async componentWillUnmount() {
    this.mounted = false
  }

  //event handlers
  handleButtonClick(e) {
    e.preventDefault()
    this.props.handleRefresh(e)
  }
  handleButtonMouseOver(e) {
    this.props.handleOverButton(this.div.style.filter)
  }
  handleButtonMouseLeave(e) {
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
    if(e.target.className!=='reply' &&
       e.target.className!=='like' &&
       e.target.className!=='rememe' &&
       e.target.className!=='upvote' &&
       e.target.className!=='downvote') {
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
  }
  handleLeaveMeme(e) {
    e.preventDefault()
  }
  handleReply(e) {
    console.log(e)
    this.props.handleReply(e)
  }
  handleLike(e) {
    console.log(e)
    this.setState({
      userHasLiked: e[1],
      likes: e[2],
    })
    this.props.handleLike(e)
  }
  handleRememe(e) {
    console.log('rememe')
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
    const time = new Date(this.state.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
          date = new Date(this.state.time).toLocaleDateString([], {month: 'short', day:'numeric', year: 'numeric'}),
          rememeCountTotal = parseInt(this.state.rememeCount) + parseInt(this.state.quoteCount)
    return(
      <div
        className="ThreadMemeMain"
        id={this.state.memeId}
        ref={Ref => this.div=Ref}
        onClick={this.handleMemeClick}
        onMouseEnter={this.handleOverMeme}
        onMouseLeave={this.handleLeaveMeme}
      >
        <section
          className="ThreadMemeMain"
          id="MainMeme"
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
              <div id="username">
                <a
                  href={`/${this.state.address.slice(1)}`}
                  id="username"
                  onClick={this.handleProfileClick}
                >
                  {this.state.username}
                </a>
              </div>
              <span id="address">{this.state.address}</span>
              </div>
              <div id="text-box">
              <p id="ThreadMemeMain-text">
                {this.state.visibleText}
              </p>
            </div>
            <span id="time">{time + ' • ' + date}</span>
            <div id="ThreadMemeMain-footer">
              <ReplyButton
                memeId={this.state.memeId}
                username={this.state.username}
                address={this.state.address}
                text={this.state.text}
                parentId={this.state.parentId}
                author={this.state.author}
                reponses={this.state.responses}
                handleReply={this.handleReply}
              />
              <LikeButton
                memeId={this.state.memeId}
                userAccount={this.state.userAccount}
                likes={this.state.likes}
                userHasLiked={this.state.userHasLiked}
                parentId={this.state.parentId}
                reponses={this.state.responses}
                memeStorage={this.state.memeStorage}
                interface={this.state.interface}
                handleLike={this.handleLike}
              />
              <RememeButton
                memeId={this.state.memeId}
                username={this.state.username}
                address={this.state.address}
                text={this.state.text}
                parentId={this.state.parentId}
                author={this.state.author}
                reponses={this.state.responses}
                handleRememe={this.handleRememe}
                rememeCountTotal={rememeCountTotal}
              />
              <UpvoteButton
                memeId={this.state.memeId}
                interface={this.state.interface}
              />
              <DownvoteButton
                memeId={this.state.memeId}
                interface={this.state.interface}
              />
            </div>

          </div>
        </section>
        <ReplyInThread
          userAccount={this.state.userAccount}
          username={this.state.username}
          address={this.state.address}
          author={this.state.author}
          text={this.state.text}
          memeId={this.state.memeId}
          parentId={this.state.parentId}
          handleExitReply={this.handleExitReply}
          userStorage={this.state.userStorage}
          memeStorage={this.state.memeStorage}
          interface={this.state.interface}
        />
      </div>
      );
    }
}

export default ThreadMemeMain
