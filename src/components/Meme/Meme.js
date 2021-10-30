import React from 'react'
import ReplyButton from '../MemeButton/ReplyButton'
import LikeButton from '../MemeButton/LikeButton'
//import RememeButton from '../MemeButton/RememeButton'
import UpvoteButton from '../MemeButton/UpvoteButton'
import DownvoteButton from '../MemeButton/DownvoteButton'
import ProfilePic from '../ProfilePic/ProfilePic'
import Tag from '../Tag/Tag'
import { toBytes, isolatePlain, isolatePlainNew, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
import { bgColorChange } from '../../resources/Libraries/Animation'
import "./Meme.css"

class Meme extends React.Component {
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
      userStorage: this.props.userStorage,
      userAccount: this.props.userAccount,
      userHasLiked: this.props.userHasLiked,
    }
    this.pfp = React.createRef()
    this.div = React.createRef()
    this.reply = React.createRef()
    this.like = React.createRef()
    this.rememe = React.createRef()
    this.upvote = React.createRef()
    this.downvote= React.createRef()

    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleOverReply = this.handleOverReply.bind(this)
    this.handleOverLike = this.handleOverLike.bind(this)
    this.handleOverRememe = this.handleOverRememe.bind(this)
    this.handleOverUpvote = this.handleOverUpvote.bind(this)
    this.handleOverDownvote = this.handleOverDownvote.bind(this)

    //this.handleRendered = this.handleRendered.bind(this)

    this.handleProfileClick = this.handleProfileClick.bind(this)
    this.handleTag = this.handleTag.bind(this)
    this.handleMemeClick = this.handleMemeClick.bind(this)
    this.handleOverMeme = this.handleOverMeme.bind(this)
    this.handleLeaveMeme = this.handleLeaveMeme.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleLike = this.handleLike.bind(this)

    this.handleUpvotePopup = this.handleUpvotePopup.bind(this)
    this.handleDownvotePopup = this.handleDownvotePopup.bind(this)
    this.handleDeletePopup = this.handleDeletePopup.bind(this)
    this.handleBanner = this.handleBanner.bind(this)
  }
  // lifecycle functions
  async componentDidMount() {
//    if(!this.state.alreadyRendered) {
//      this.div.style.zIndex = 0
//      this.div.style.opacity = 0
//      setTimeout(() => {
//        fadeIn('div#\\3' + this.state.memeId + ' ', 600)
//        zipUp('div#\\3' + this.state.memeId + ' ', 600)
//        this.setState({ alreadyRendered: true })
//      }, 0 )
//    } else if(this.state.alreadyRendered) {
//      this.div.style.opacity = 1
//    }
    this.mounted = new AbortController()
    await this.formatText().catch(e=>console.error(e))
  }
  componentWillUnmount() {
    this.mounted.abort()
  }

  //event handlers
  handleButtonClick(e) {
    e.preventDefault()
    this.props.handleRefresh(e)
  }
  handleOverReply(e) {
    this.props.handleOverReply(e)
  }
  handleOverLike(e) {
    this.props.handleOverLike(e)
  }
  handleOverRememe(e) {
    this.props.handleOverRememe(e)
  }
  handleOverUpvote(e) {
    this.props.handleOverUpvote(e)
  }
  handleOverDownvote(e) {
    this.props.handleOverDownvote(e)
  }
  handleBanner(e) {
    this.props.handleBanner(e)
  }

  handleRendered(e) {

  }

  handleProfileClick(e) {
    e.preventDefault()
    localStorage.setItem('focusPage', 'profile')
    localStorage.setItem('userInfo', this.state.author)
    this.props.handleToProfile(this.state.author)
  }
  async handleTag(e) {
    const address = await toBytes(e).catch(e=>console.error(e)),
          account = await this.state.userStorage.methods.usersByUserAddr(address).call().catch(e=>console.error(e))
    if(account!=='0x0000000000000000000000000000000000000000') {
      this.props.handleToProfile(await account)
    }
  }
  handleMemeClick(e) {
    e.preventDefault()
    if(e.target!==this.pfp &&
       e.target.id!=='profile-pic' &&
       e.target.id!=='username' &&
       e.target.id!=='at' &&
       e.target.id!=='delete' &&
       e.target.className!=='reply' &&
       e.target.className!=='LikeButton' &&
       e.target.className!=='LikeButton-Liked' &&
       e.target.className!=='like' &&
       e.target.className!=='liked' &&
       e.target.className!=='rememe' &&
       e.target.className!=='upvote' &&
       e.target.className!=='downvote') {
      this.props.handleToThread(this.state.memeId)
    }
  }

  handleOverMeme(e) {
    e.preventDefault()
    const element = 'div#\\3' + this.state.memeId
    if(this.div.style.backgroundColor!=='#2A2A2A') {
      bgColorChange(element, '1D1F22', '2A2A2A',  500)
    } else if(this.div.style.backgroundColor==='#2A2A2A') {
      document.querySelector(element).style.backgroundColor = '#2A2A2A'
    }
  }
  handleLeaveMeme(e) {
    e.preventDefault()
    const elementName = 'div#\\3' + this.state.memeId
    bgColorChange(elementName, '2A2A2A', '1D1F22',  500)
  }
  handleReply(e) {
    this.props.handleReply(e)
  }
  handleLike(e) {
    this.setState({
      userHasLiked: e[1],
      likes: e[2],
    })
    this.props.handleLike(e)
  }
  handleRememe(e) {
    console.log('rememe')
  }

  handleUpvotePopup(e) {
    this.props.handleUpvotePopup(e)
  }
  handleDownvotePopup(e) {
    this.props.handleDownvotePopup(e)
  }
  handleDeletePopup(e) {
    this.props.handleDeletePopup([e, this.state.memeId])
  }

  async formatText() {
    let text = this.props.text,
        plainMap = await isolatePlain(text).catch(e=>console.error(e)),
        atMap = await isolateAt(text).catch(e=>console.error(e)),
        hashMap = await isolateHash(text).catch(e=>console.error(e)),
        combined = [],
        formatted = []
    console.log(await isolatePlainNew(text))
    combined = plainMap.concat(atMap, hashMap)
      .sort((a,b) => a[0]-b[0])
    if(combined!==null) {
      combined.forEach((elem, i) => {
        if(elem[2]==='plain')
          formatted.push(<span key={i} id="plain">{elem[1]}</span>)
        else if(elem[2]==='at')
          formatted.push(<Tag key={i} address={elem[1]} handleTag={this.handleTag}/>)
        else if(elem[2]==='hash')
          formatted.push(<a key={i} href={`/${elem[1]}`} id="hash">{elem[1]}</a>)
        i++
      })
    }
    this.setState({ visibleText: formatted })
  }

  calculateTimePassed() {
    const ms = (new Date() - Date.parse(this.state.time)),
          sec = Math.floor(ms/1000),
          min = Math.floor(ms/60000),
          hrs = Math.floor(ms/3600000),
          days = Math.floor(ms/86400000),
          wks = Math.floor(ms/604800000),
          mos = Math.floor(ms/2592000000),
          yrs = Math.floor(ms/31536000000)
    return yrs > 0
           ? yrs + 'y'
           : mos > 0
             ? mos + 'mo'
             : wks > 0
               ? wks + 'w'
               : days > 0
                 ? days + 'd'
                 : hrs > 0
                   ? hrs + 'h'
                   : min > 0
                     ? min + 'm'
                     : sec > 0
                       ? sec + 's'
                       : 'now'
  }

  render() {
    const //rememeCountTotal = parseInt(this.state.rememeCount) + parseInt(this.state.quoteCount),
          time = this.calculateTimePassed()
    return(
      <div
        className="Meme"
        id={this.state.memeId}
        href={this.state.memeId}
        ref={Ref => this.div=Ref}
        onClick={this.handleMemeClick}
        onMouseEnter={this.handleOverMeme}
        onMouseLeave={this.handleLeaveMeme}
      >
        <section
          id="profilePic"
          ref={Ref=>this.pfp=Ref}
        >
          <a
            id="profilePic"
            href={`/${this.state.address.slice(1)}`}
            onClick={this.handleProfileClick}
          >
            <ProfilePic account={this.state.author} id="Meme"/>
          </a>
        </section>
        <div id="meme-body">
          <div id="meme-header">
            <section id="left">
              <a
                href={`/${this.state.address.slice(1)}`}
                id="username"
                onClick={this.handleProfileClick}
              >
                {this.state.username}
              </a>
              <span id="address">{this.state.address}</span>
              <span id="time">{time}</span>
            </section>
            <section id="right">
              { this.state.author===this.state.userAccount
                  ? <p id="delete" onClick={this.handleDeletePopup}> ... </p>
                  : ''
              }
            </section>
          </div>
          <div id="text-box">
            <p id="meme-text">
              {this.state.visibleText}
            </p>
          </div>
          <div id="meme-footer">
            <ReplyButton
              memeId={this.state.memeId}
              username={this.state.username}
              address={this.state.address}
              text={this.state.text}
              parentId={this.state.parentId}
              originId={this.state.originId}
              author={this.state.author}
              responses={this.state.responses}
              isMain={false}
              handleReply={this.handleReply}
              handleOverReply={this.handleOverReply}
              handleBanner={this.handleBanner}
              ref={Ref=>this.reply=Ref}
            />
            <LikeButton
              memeId={this.state.memeId}
              userAccount={this.state.userAccount}
              likes={this.state.likes}
              userHasLiked={this.state.userHasLiked}
              isMain={false}
              memeStorage={this.props.memeStorage}
              userStorage={this.props.userStorage}
              interface={this.props.interface}
              handleLike={this.handleLike}
              handleOverLike={this.handleOverLike}
              handleBanner={this.handleBanner}
              ref={Ref=>this.like=Ref}
            />
            {/*
            <RememeButton
              memeId={this.state.memeId}
              username={this.state.username}
              address={this.state.address}
              text={this.state.text}
              parentId={this.state.parentId}
              originId={this.state.originId}
              author={this.state.author}
              reponses={this.state.responses}
              isMain={false}
              handleRememe={this.handleRememe}
              handleOverRememe={this.handleOverRememe}
              handleBanner={this.handleBanner}
              rememeCountTotal={rememeCountTotal}
              ref={Ref=>this.rememe=Ref}
            />
            */}
            <UpvoteButton
              memeId={this.state.memeId}
              account={this.state.userAccount}
              isMain={false}
              interface={this.state.interface}
              handleOverUpvote={this.handleOverUpvote}
              handleUpvotePopup={this.handleUpvotePopup}
              handleBanner={this.handleBanner}
              ref={Ref=>this.upvote=Ref}
            />
            <DownvoteButton
              memeId={this.state.memeId}
              account={this.state.userAccount}
              isMain={false}
              interface={this.state.interface}
              handleOverDownvote={this.handleOverDownvote}
              handleDownvotePopup={this.handleDownvotePopup}
              handleBanner={this.handleBanner}
              ref={Ref=>this.downvote=Ref}
            />
          </div>
        </div>
      </div>
      );
    }
}

export default Meme
