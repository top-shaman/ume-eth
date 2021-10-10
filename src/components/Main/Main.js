import React from 'react'
import NavBar from '../NavBar/NavBar'
import Stats from '../Stats/Stats'
//import SearchBar from '../SearchBar/SearchBar'
import Timeline from '../Timeline/Timeline'
import Profile from '../Profile/Profile'
import Thread from '../Thread/Thread'
import UpvotePopup from '../Popups/UpvotePopup'
import Loader from '../Loader/Loader'
import { blur, blurToFadeIn } from '../../resources/Libraries/Animation'
import './Main.css'
import { fromBytes, is32Bytes } from '../../resources/Libraries/Helpers'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account,
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
      ume: this.props.ume,
      memeCount: this.props.memeCount,
      userMemeCount: this.props.userMemeCount,
      timelineFormat: 'boost',
      timelineLoading: false,
      profileLoading: false,
      threadLoading: false,
      upvotePopup: false,
      popupX: null,
      popupY: null,
      popup: null,
      offsetY: 0,
      startingWidth: null,
      width: null,
      reload: false,
      focusPage: 'timeline',
      atBottom: false
    }

    // references
    this.body = React.createRef()
    this.timeline = React.createRef()
    this.profile = React.createRef()
    this.thread = React.createRef()

    // page overlay handles
    this.handleCreateMeme = this.handleCreateMeme.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleEdit = this.handleEdit.bind(this)

    this.handleRefresh = this.handleRefresh.bind(this)

    // page navigation handles
    this.handleTimelineLoad = this.handleTimelineLoad.bind(this)
    this.handleToTimeline = this.handleToTimeline.bind(this)

    this.handleProfileLoad = this.handleProfileLoad.bind(this)
    this.handleToProfile = this.handleToProfile.bind(this)

    this.handleThreadLoad = this.handleThreadLoad.bind(this)
    this.handleToThread = this.handleToThread.bind(this)

    this.handleToSettings = this.handleToSettings.bind(this)

    this.handleUpvotePopup = this.handleUpvotePopup.bind(this)

    // handle to log page location
    this.handleScroll = this.handleScroll.bind(this)
  }

  // lifecycles
  async componentDidMount() {
    // if previously loaded, no blur entrance
    if(localStorage.getItem('hasLoaded')!=='true') {
      //blurToFadeIn('.Main #subheader', 2000)
      //blurToFadeIn('.Main #header', 2000)
      blurToFadeIn('div.Main', 2000)
      localStorage.setItem('hasLoaded', 'true')
      //localStorage.setItem('hasLoaded', 'true')
    }
    // blur entrance for dev purposes
    blurToFadeIn('div.Main', 2000)

    // by default, set User Account's user info for profile navigation
    this.setState({
      profileUsername: await this.state.userStorage.methods.getName(this.props.account).call().then(async e => await fromBytes(e)),
      profileAddress: await this.state.userStorage.methods.getUserAddr(this.props.account).call().then(async e => await fromBytes(e)),
      profileAccount: this.state.account
    })

    if(localStorage.getItem('focusPage')==='timeline') {
      localStorage.setItem('timelineSort', 'boost')
    }
    // if previously on profile page, set to profile page upon reload
    // change profile query with one parameter
    /*
    if(localStorage.getItem('focusPage')==='profile') {
      if(localStorage.getItem('userInfo').split(',').length===3){
        const profile = localStorage.getItem('userInfo').split(',')
        if(profile.length===3) {
          if(is32Bytes(profile[0]) && is32Bytes(profile[1])) {
            this.setState({
              profileUsername: await fromBytes(profile[0]),
              profileAddress: await fromBytes(profile[1]),
              profileAccount: profile[2]
            })
          }
          else {
            this.setState({
              profileUsername: profile[0],
              profileAddress: profile[1],
              profileAccount: profile[2]
            })
          }
          this.setState({ focusPage: 'profile' })
        }
      }
    }
    */
    // if previously on a thread, set to thread upon reload
  }
  componentDidUpdate() {
    if(this.state.popup!==null){
    }
  }
  componentWillUnmount() {
    window.clearInterval()
  }

  // handles
  // meme creation
  handleCreateMeme(e) {
    //this.setState({ creatingMeme })
    this.props.handleCreateMeme(e)
    // blur out Main section upon Meme Creation
    blur('.Main div#header', 500)
    blur('.Main div#body', 500)
  }
  handleReply(e) {
    //this.setState({ replying})
    this.props.handleReply(e)
    // blur out Main section upon Reply Creation
    blur('.Main div#header', 500)
    blur('.Main div#body', 500)
  }
  handleEdit(e) {
    //this.setState({ editing })
    this.props.handleEdit(e)
    blur('.Main div#header', 500)
    blur('.Main div#body', 500)
  }
  handleUpvotePopup(e) {
    const element = e[0].target.getBoundingClientRect()
    this.setState({
      upvotePopup: false,
      upvoteMeme: null,
      popup: null,
      popupX: null,
      popupY: null
    })
    this.setState({
      popup: e[0].target,
      upvoteMeme: e[1],
      popupX: element.x,
      popupY: element.y + this.state.offsetY
    })
    setTimeout(() => {
      // set memeId
      this.setState({
        upvotePopup: true
      })
    }, 20)
    if(this.state.upvotePopup && this.state.popup===e[0].target) {
      this.setState({
        upvotePopup: false,
        upvoteMeme: null,
        popup: null,
        popupX: null,
        popupY: null
      })
    }
  }

  // refresh functionality
  async handleRefresh(e) {
    e.preventDefault()
    if(this.state.focusPage==='timeline' && !this.state.timelineLoading && !this.state.profileLoading && !this.state.threadLoading) {
      await this.timeline.loadNewMemes()
      await this.timeline.refreshMemes()
    } else if(this.state.focusPage==='profile' && !this.state.timelineLoading && !this.state.profileLoading && !this.state.threadLoading) {
      await this.profile.loadNewMemes()
      await this.profile.refreshMemes()
    } else if(this.state.focusPage==='thread' && !this.state.timelineLoading && !this.state.profileLoading && !this.state.threadLoading) {
      await this.thread.loadNewMemes()
      await this.thread.refreshMemes()
    }
  }
  handleTimelineLoad(timelineLoading) {
    this.setState({ timelineLoading })
    if(timelineLoading) {
      this.setState({
        profileLoading: false,
        threadLoading: false
      })
    }
    console.log('timeline loading: ' + timelineLoading)
  }
  async handleToTimeline(e) {
    e.preventDefault()
    console.log(localStorage.getItem('focusPage'))
    console.log(localStorage.getItem('timelineSort'))
    console.log('coming from: ' + this.state.focusPage)
    console.log('timeline loading: ' + this.state.timelineLoading)
    //if(!this.state.timelineLoading && this.state.focusPage!=='timeline') {
      this.setState({ focusPage: null })
      setTimeout(() => {
        this.setState({
          focusPage: 'timeline',
          timelineFormat: localStorage.getItem('timelineSort')
        })
      }, 50)
      console.log('timeline loading: ' + this.state.timelineLoading)
    //}
    this.setState({ width: this.body.clientWidth })
  }

  handleProfileLoad(profileLoading) {
    this.setState({
      profileLoading
    })
    if(profileLoading) {
      this.setState({
        timelineLoading: false,
        threadLoading: false
      })
    }
    console.log('profile loading: ' + profileLoading)
  }
  async handleToProfile(e) {
    // check to see if page already loaded
    if(this.state.profileAccount!==e) {
      this.setState({
        profileUsername: await this.state.userStorage.methods.getName(e).call().then(async e => await fromBytes(e)),
        profileAddress: await this.state.userStorage.methods.getUserAddr(e).call().then(async e => await fromBytes(e)),
        profileAccount: e,
      })
    }
    this.setState({
        profileLoading: true,
        focusPage: null
    })
    // update local storage
    localStorage.setItem('userInfo', e)
    setTimeout(() => {
      this.setState({
        focusPage: 'profile',
      })
    }, 50)
    this.setState({ width: this.body.clientWidth })
  }
  handleThreadLoad(threadLoading) {
    this.setState({
      threadLoading
    })
    console.log('thread loading: ' + threadLoading)
  }
  handleToThread(e) {
    console.log('leaving page: ' + this.state.focusPage)
    //if(!this.state.threadLoading) {
      if(this.state.focusPage==='thread' && this.state.memeId!==e[0]){
        this.setState({
          threadLoading: true,
          focusPage: null
        })
      }
      this.setState({
        memeId: e[0],
        memeUsername: e[1],
        memeAddress: e[2],
        text: e[3],
        time: e[4],
        responses: e[5],
        likes: e[6],
        likers: e[7],
        rememeCount: e[8],
        rememes: e[9],
        quoteCount: e[10],
        quoteMemes: e[11],
        repostId: e[12],
        parentId: e[13],
        originId: e[14],
        author: e[15],
        isVisible: e[16],
        visibleText: e[17],
        userHasLiked: e[18],
      })
      setTimeout(() => {
        if(this.state.focusPage!=='thread') {
          this.setState({ focusPage: 'thread' })
        }
      }, 50)
    //}
    this.setState({ width: this.body.clientWidth })
  }

  handleToSettings(e) {
  }

  handleScroll(e) {
    if(e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight+150) {
      this.setState({ atBottom: true })
    }
    else this.setState({ atBottom: false })

    this.setState({ offsetY: e.target.scrollTop })
  }

  render() {
    return(
      <div className="Main">
        <div id="side-header">
          <NavBar
            account={this.state.account}
            handleCreateMeme={this.handleCreateMeme}
            handleRefresh={this.handleRefresh}
            handleToTimeline={this.handleToTimeline}
            handleToProfile={this.handleToProfile}
            handleToSettings={this.handleToSettings}
          />
        </div>
        <div
          className="Main"
          id="body"
          onScroll={this.handleScroll}
          ref={Ref=>this.body=Ref}
        >
          <div id="subheader">
            <section id="title">
              { this.state.focusPage==='timeline' || this.state.focusPage==='thread'
                ? <a href="#home">
                    <p id="subheader">
                      uMe
                    </p>
                  </a>
                : <a href="#profile">
                    <p id="profile-subheader">
                      <span id="username">{this.state.profileUsername}</span>
                      <span id="memes">{this.state.userMemeCount} Memes</span>
                    </p>
                  </a>
              }
            </section>
            <section id="searchBar">
              {/*
              <SearchBar
                userStorage={this.state.userStorage}
                memeStorage={this.state.memeStorage}
              />
              */}
            </section>
          </div>
          { this.state.upvotePopup && this.state.popupX!==null && this.state.popupY!==null
              ? <UpvotePopup
                  positionX={`${this.state.popupX - this.body.getBoundingClientRect().left}`}
                  positionY={`${this.state.popupY}`}
                  account={this.state.account}
                  memeId={this.state.upvoteMeme}
                  interface={this.state.interface}
                />
              : ''
          }
          { this.state.focusPage==='timeline' //&& !this.state.reload
            ? <Timeline
                account={this.state.account}
                userStorage={this.state.userStorage}
                memeStorage={this.state.memeStorage}
                memeCount={this.state.memeCount}
                interface={this.state.interface}
                memeIdsByBoost={this.props.memeIdsByBoost}
                timelineLoading={this.state.timelineLoading}
                handleLoading={this.handleTimelineLoad}
                contractLoading={this.props.contractLoading}
                handleToProfile={this.handleToProfile}
                handleToThread={this.handleToThread}
                handleReply={this.handleReply}
                handleUpvotePopup={this.handleUpvotePopup}
                atBottom={this.state.atBottom}
                ref={Ref => this.timeline=Ref}
              />
            : this.state.focusPage==='profile' //&& !this.state.reload
              ? <Profile
                  account={this.state.account}
                  userStorage={this.state.userStorage}
                  memeStorage={this.state.memeStorage}
                  userMemeCount={this.state.userMemeCount}
                  interface={this.state.interface}
                  profileLoading={this.state.profileLoading}
                  handleLoading={this.handleProfileLoad}
                  contractLoading={this.props.contractLoading}
                  handleToProfile={this.handleToProfile}
                  handleToThread={this.handleToThread}
                  handleReply={this.handleReply}
                  handleEdit={this.handleEdit}
                  handleUpvotePopup={this.handleUpvotePopup}
                  profileUsername={this.state.profileUsername}
                  profileAddress={this.state.profileAddress}
                  profileAccount={this.state.profileAccount}
                  atBottom={this.state.atBottom}
                  ref={Ref => this.profile=Ref}
                />
                : this.state.focusPage==='thread'
                  ? <Thread
                      account={this.state.account}
                      userStorage={this.state.userStorage}
                      memeStorage={this.state.memeStorage}
                      userMemeCount={this.state.userMemeCount}
                      interface={this.state.interface}
                      threadLoading={this.state.threadLoading}
                      handleLoading={this.handleThreadLoad}
                      contractLoading={this.props.contractLoading}
                      handleToProfile={this.handleToProfile}
                      handleToThread={this.handleToThread}
                      handleReply={this.handleReply}
                      handleUpvotePopup={this.handleUpvotePopup}
                      atBottom={this.state.atBottom}
                      ref={Ref => this.thread=Ref}
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
                      userAccount={this.state.account}
                    />
                  : <Loader />
          }
        </div>
        <div id="side-footer">
          <Stats
            account={this.state.account}
            userStorage={this.state.userStorage}
            memeStorage={this.state.memeStorage}
            update={this.updateStats}
            ume={this.state.ume}
            handleToProfile={this.handleToProfile}
          />
        </div>
      </div>
    )
  }
}

export default Main
