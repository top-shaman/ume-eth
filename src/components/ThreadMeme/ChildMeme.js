import React from 'react'
import ChildThread from '../Thread/ChildThread'
import ReplyButton from '../MemeButton/ReplyButton'
import LikeButton from '../MemeButton/LikeButton'
//import RememeButton from '../MemeButton/RememeButton'
import UpvoteButton from '../MemeButton/UpvoteButton'
import DownvoteButton from '../MemeButton/DownvoteButton'
import ProfilePic from '../ProfilePic/ProfilePic'
import Tag from '../Tag/Tag'
import Loader from '../Loader/Loader'
import { toBytes, isolatePlain, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
import { bgColorChange } from '../../resources/Libraries/Animation'
import "./ChildMeme.css"
import "./DeletedMeme.css"

class ChildMeme extends React.Component {
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
      mouseOver: this.props.mouseOver,
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userAccount: this.props.userAccount,
      userHasLiked: this.props.userHasLiked,
      childLoading: false,
      unpacked: false,
      inChildThread: this.props.inChildThread,
      firstChild: this.props.firstChild,
      lastChild: this.props.lastChild,
      finalChild: this.props.finalChild,
      deleted: this.props.deleted
    }
    this.div = React.createRef()
    this.container = React.createRef()
    this.reply = React.createRef()
    this.like = React.createRef()
    this.rememe = React.createRef()
    this.upvote = React.createRef()
    this.downvote= React.createRef()

    this.childThread = React.createRef()
    this.childParent = React.createRef()
    this.show = React.createRef()
    this.showContainer = React.createRef()

    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleButtonMouseOver = this.handleButtonMouseOver.bind(this)
    this.handleButtonMouseLeave = this.handleButtonMouseLeave.bind(this)

    this.handleProfileClick = this.handleProfileClick.bind(this)
    this.handleToProfile = this.handleToProfile.bind(this)
    this.handleTag = this.handleTag.bind(this)
    this.handleHeight = this.handleHeight.bind(this)

    this.handleMemeClick = this.handleMemeClick.bind(this)
    this.handleOverMeme = this.handleOverMeme.bind(this)
    this.handleLeaveMeme = this.handleLeaveMeme.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleLike = this.handleLike.bind(this)

    this.handleOverShow = this.handleOverShow.bind(this)
    this.handleLeaveShow = this.handleLeaveShow.bind(this)
    this.handleUnpack = this.handleUnpack.bind(this)
    this.handleChildLoading = this.handleChildLoading.bind(this)
    this.handleToThread = this.handleToThread.bind(this)

    this.handleOverReply = this.handleOverReply.bind(this)
    this.handleOverLike = this.handleOverLike.bind(this)
    this.handleOverRememe = this.handleOverRememe.bind(this)
    this.handleOverUpvote = this.handleOverUpvote.bind(this)
    this.handleOverDownvote = this.handleOverDownvote.bind(this)

    this.handleUpvotePopup = this.handleUpvotePopup.bind(this)
    this.handleDownvotePopup = this.handleDownvotePopup.bind(this)
    this.handleDeletePopup = this.handleDeletePopup.bind(this)
    this.handleBanner = this.handleBanner.bind(this)
  }
  // lifecycle functions
  async componentDidMount() {
    //prevent redundant right-border if in thread
    if(this.state.inChildThread) {
      this.childParent.style.borderRight = 'none'
    }
    // if not last child of a subthread or not within a subthread, makes sure top padding is proper spacing
    if((!this.state.inChildThread || !this.state.firstChild) && !this.state.deleted) {
      this.div.style.paddingTop = '0.5rem'
    }
    // sets soft border at bottom of each sub-thread
    if(this.state.responses.length===0 && !this.state.deleted) {
      this.container.style.borderBottom = '0.05rem solid #667777'
    }
    // if in final child, makes sure container and show container don't have soft border, sets hard border for child-parent thread
    if(this.state.finalChild) {
      if(!this.state.inChildThread) {
        this.childParent.style.borderBottom = '0.05rem solid #AAAAAA'
      }
      if(!this.state.deleted) {
        this.container.style.borderBottom = 'none'
        if(this.showContainer.style!==undefined) {
          this.showContainer.style.borderBottom = 'none'
        }
      }
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
    this.props.handleToProfile(this.state.author)
    localStorage.setItem('focusPage', 'profile')
    localStorage.setItem('userInfo', this.state.author)
  }
  handleToProfile(e) {
    this.props.handleToProfile(e)
  }
  async handleTag(e) {
    const address = await toBytes(e),
    account = await this.state.userStorage.methods.usersByUserAddr(address).call()
    if(account!=='0x0000000000000000000000000000000000000000') {
      this.props.handleToProfile(await account)
    }
  }
  handleHeight() {
    this.props.handleHeight()
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
    const element = 'div#' + this.div.id
    if(this.div.style.backgroundColor!=='#2A2A2A') {
      bgColorChange(element, '1D1F22', '2A2A2A',  500)
    } else if(this.div.style.backgroundColor==='#2A2A2A') {
      document.querySelector(element).style.backgroundColor = '#2A2A2A'
    }
    this.props.handleOverMeme(this.div.style.backgroundColor)
  }
  handleLeaveMeme(e) {
    e.preventDefault()
    const elementName = 'div#' + this.div.id
    bgColorChange(elementName, '2A2A2A', '1D1F22',  500)
  }
  handleOverShow(e) {
    e.preventDefault()
    const element = 'div#' + this.show.id
    if(this.show.style.backgroundColor!=='#2A2A2A') {
      bgColorChange(element, '1D1F22', '2A2A2A',  500)
    } else if(this.show.style.backgroundColor==='#2A2A2A') {
      document.querySelector(element).style.backgroundColor = '#2A2A2A'
    }
    this.props.handleOverMeme(this.show.style.backgroundColor)
  }
  handleLeaveShow(e) {
    e.preventDefault()
    const elementName = 'div#' + this.show.id
    bgColorChange(elementName, '2A2A2A', '1D1F22',  500)
  }
  handleReply(e) {
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
  handleUnpack(e) {
    e.preventDefault()
    this.setState({ unpacked: true })
  }

  handleChildLoading(childLoading) {
    this.setState({ childLoading })
  }
  handleToThread(e) {
    this.props.handleToThread(e)
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

  handleUpvotePopup(e) {
    this.props.handleUpvotePopup(e)
  }
  handleDownvotePopup(e) {
    this.props.handleDownvotePopup(e)
  }
  handleDeletePopup(e) {
    console.log(e)
    if(e.length==2) {
      this.props.handleDeletePopup(e)
    } else {
      this.props.handleDeletePopup([e, this.state.memeId])
    }
  }
  handleBanner(e) {
    this.props.handleBanner(e)
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
        className="ChildMeme-Parent"
        id={this.state.memeId}
        hfref={this.state.memeId}
        ref={Ref=>this.childParent=Ref}
      >
        { !this.state.deleted
            ? <div
                className="ChildMeme"
                id={'meme' + this.state.memeId}
                ref={Ref => this.div=Ref}
                onClick={this.handleMemeClick}
                onMouseEnter={this.handleOverMeme}
                onMouseLeave={this.handleLeaveMeme}
              >
                <div id="ChildMeme-container" ref={Ref=>this.container=Ref}>
                  <section id="profilePic">
                    <a
                      id="profilePic"
                      href={`/${this.state.address.slice(1)}`}
                      onClick={this.handleProfileClick}
                    >
                      <ProfilePic
                        account={this.state.author}
                        id="ChildMeme"
                        userStorage={this.state.userStorage}
                      />
                    </a>
                    {this.state.responses.length
                       ? <div className="vl"/>
                       : <p/>
                    }
                  </section>
                  <div id="ChildMeme-body">
                    <div id="ChildMeme-header">
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
                      <p id="ChildMeme-text">
                        {this.state.visibleText}
                      </p>
                    </div>
                    <div id="ChildMeme-footer">
                      <ReplyButton
                        memeId={this.state.memeId}
                        username={this.state.username}
                        address={this.state.address}
                        text={this.state.text}
                        parentId={this.state.parentId}
                        originId={this.state.originId}
                        repostId={this.state.repostId}
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
                        memeStorage={this.state.memeStorage}
                        interface={this.state.interface}
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
                        repostId={this.state.repostId}
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
              </div>
            : <div
                className="ChildMeme"
                id="deleted"
                userAccount={this.state.userAccount}
                handleToProfile={this.handleToProfile}
                handleToThread={this.handleToThread}
                handleLoading={this.handleLoading}
                handleRefresh={this.handleRefresh}
                handleReply={this.handleReply}
                handleLike={this.handleLike}
                handleOverMeme={this.handleOverMeme}
                handleUpvotePopup={this.handleUpvotePopup}
                handleDownvotePopup={this.handleDownvotePopup}
                handleDeletePopup={this.handleDeletePopup}
                handleBanner={this.handleBanner}
                interface={this.state.interface}
                memeStorage={this.state.memeStorage}
                userStorage={this.state.userStorage}
                ref={Ref=>this.childParent=Ref}
              >
                <p>This meme has been deleted.</p>
              </div>
        }
        { this.state.responses.length===0
            ? ''
            : !this.state.unpacked
              ? <div
                  id={'show' + this.state.memeId}
                  className="show-replies"
                  onClick={this.handleUnpack}
                  onMouseEnter={this.handleOverShow}
                  onMouseLeave={this.handleLeaveShow}
                  ref={Ref=>this.show=Ref}
                >
                  <div id="show-replies" ref={Ref=>this.showContainer=Ref}>
                    <div id="line-box">
                      <div className='dotted-line'/ >
                    </div>
                    <p id="show-replies">Show more replies</p>
                  </div>
                </div>
              : this.state.childLoading
                  ? <Loader/>
                  : <ChildThread
                      userStorage={this.state.userStorage}
                      memeStorage={this.state.memeStorage}
                      interface={this.state.interface}
                      handleHeight={this.handleHeight}
                      handleLoading={this.handleChildLoading}
                      handleReply={this.handleReply}
                      handleToProfile={this.handleToProfile}
                      handleToThread={this.handleToThread}
                      handleUpvotePopup={this.handleUpvotePopup}
                      handleDownvotePopup={this.handleDownvotePopup}
                      handleDeletePopup={this.handleDeletePopup}
                      handleBanner={this.handleBanner}
                      handleRefresh={this.handleRefresh}
                      handleLike={this.handleLike}
                      handleOverMeme={this.handleOverMeme}
                      handleBanner={this.handleBanner}
                      atBottom={this.state.atBottom}
                      ref={Ref => this.childThread=Ref}
                      memeId={this.state.memeId}
                      memeUsername={this.state.memeUsername}
                      memeAddress={this.state.memeAddress}
                      text={this.state.text}
                      time={this.state.time}
                      responses={this.state.responses}
                      likes={this.state.likes}
                      likers={this.state.likers}
                      rememeCount={this.state.rememeCount}
                      rememes={this.state.rememes}
                      quoteCount={this.state.quoteCount}
                      quoteMemes={this.state.quoteMemes}
                      repostId={this.state.repostId}
                      parentId={this.state.parentId}
                      originId={this.state.originId}
                      author={this.state.author}
                      isVisible={this.state.isVisible}
                      visibleText={this.state.visibleText}
                      userHasLiked={this.state.userHasLiked}
                      userAccount={this.state.userAccount}
                      firstChild={this.state.firstChild}
                      lastChild={this.state.lastChild}
                      finalChild={this.state.finalChild}
                      unpacked={this.state.unpacked}
                    />
        }
      </div>
    );
  }
}

export default ChildMeme
