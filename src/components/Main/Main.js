import React from 'react'
import NavBar from '../NavBar/NavBar'
import Stats from '../Stats/Stats'
//import SearchBar from '../SearchBar/SearchBar'
import Timeline from '../Timeline/Timeline'
import Profile from '../Profile/Profile'
import Thread from '../Thread/Thread'
import UpvotePopup from '../Popups/UpvotePopup'
import DownvotePopup from '../Popups/DownvotePopup'
import Loader from '../Loader/Loader'
import { fromBytes } from '../../resources/Libraries/Helpers'
import { blur, blurToFadeIn } from '../../resources/Libraries/Animation'
import './Main.css'
import Arrow from '../../resources/arrow-left.svg'

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
      umeBalance: this.props.umeBalance,
      timelineFormat: 'boost',
      timelineLoading: false,
      profileLoading: false,
      threadLoading: false,
      refreshing: false,
      lastPage: [['timeline', '0x0']],
      back: false,
      activePopup: null,
      popupMeme: null,
      popupX: null,
      popupY: null,
      popup: null,
      offsetX: 0,
      offsetY: 0,
      startingWidth: null,
      reload: false,
      focusPage: 'timeline',
      atBottom: this.props.atBottom
    }

    // references
    this.main = React.createRef()
    this.body = React.createRef()
    this.timeline = React.createRef()
    this.profile = React.createRef()
    this.thread = React.createRef()
    this.stats = React.createRef()

    // page overlay handles
    this.handleCreateMeme = this.handleCreateMeme.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleEdit = this.handleEdit.bind(this)

    this.handleLoading = this.handleLoading.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleBalance = this.handleBalance.bind(this)

    // page navigation handles
    this.handleToTimeline = this.handleToTimeline.bind(this)
    this.handleToProfile = this.handleToProfile.bind(this)
    this.handleToThread = this.handleToThread.bind(this)
    this.handleToSettings = this.handleToSettings.bind(this)

    this.handleUpvotePopup = this.handleUpvotePopup.bind(this)
    this.handleDownvotePopup = this.handleDownvotePopup.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  // lifecycles
  async componentDidMount() {
    if(this.state.lastPage!==null)
      console.log('coming from ' + this.state.lastPage)
    // if previously loaded, no blur entrance
    if(localStorage.getItem('hasLoaded')!=='true') {
      //blurToFadeIn('.Main #subheader', 2000)
      //blurToFadeIn('.Main #header', 2000)
      //blurToFadeIn('div.Main', 2000)
      localStorage.setItem('hasLoaded', 'true')
      //localStorage.setItem('hasLoaded', 'true')
    }
    // blur entrance for dev purposes
    //blurToFadeIn('div.Main', 2000)

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
  componentWillUnmount() {
    window.clearInterval()
  }

  // handles
  // meme creation
  handleCreateMeme(e) {
    this.props.handleCreateMeme(e)
    // blur out Main section upon Meme Creation
    blur('div.Main', 500)
  }
  handleReply(e) {
    this.props.handleReply(e)
    // blur out Main section upon Reply Creation
    blur('div.Main', 500)
  }
  handleEdit(e) {
    this.props.handleEdit(e)
    blur('div.Main', 500)
  }
  handleUpvotePopup(e) {
    const element = e[0].target.getBoundingClientRect(),
          offsetY = this.props.offsetY ? this.props.offsetY : 0
    // if already pop'd up, or another upvote button, close
    if(this.state.popupMeme===e[1] && this.state.activePopup==='upvote') {
      this.setState({
        activePopup: null,
        popupMeme: null,
        popup: null,
        popupX: null,
        popupY: null
      })
    } else if(this.state.activePopup!=='upvote' || this.state.popupMeme!==e[1]) {
      this.setState({
        activePopup: null,
        popupMeme: null,
        popup: null,
        popupX: null,
        popupY: null
      })
      setTimeout(() => {
        this.setState({
          popup: e[0].target,
          popupMeme: e[1],
          popupX: element.x,
          popupY: element.y + offsetY,
          activePopup: 'upvote'
        })
      }, 10)
    }
  }
  handleDownvotePopup(e) {
    const element = e[0].target.getBoundingClientRect(),
          offsetY = this.props.offsetY ? this.props.offsetY : 0
    if(this.state.popupMeme===e[1] && this.state.activePopup==='downvote') {
      this.setState({
        activePopup: null,
        popupMeme: null,
        popup: null,
        popupX: null,
        popupY: null
      })
    } else if(this.state.activePopup!=='downvote' || this.state.popupMeme!==e[1]) {
      this.setState({
        activePopup: null,
        popupMeme: null,
        popup: null,
        popupX: null,
        popupY: null
      })
      setTimeout(() => {
        this.setState({
          popup: e[0].target,
          popupMeme: e[1],
          popupX: element.x,
          popupY: element.y + offsetY,
          activePopup: 'downvote'
        })
      }, 10)
    }
  }
  handleClose(activePopup) {
    this.setState({ activePopup })
  }

  // refresh functionality
  async handleRefresh(handleRefresh) {
    this.setState({ handleRefresh })
    if(handleRefresh) console.log('refreshing: ' + this.state.focusPage)
    else console.log(this.state.focusPage + ' refreshed')
    await this.stats.setInfo().catch(e=>console.error(e))
  }
  async handleRefreshClick(e) {
    e.preventDefault()
    if(this.state.focusPage==='timeline' && !this.state.loading && this.timeline) {
      await this.timeline.loadNewMemes()
      await this.timeline.refreshMemes()
    } else if(this.state.focusPage==='profile' && !this.state.loading && this.profile) {
      await this.profile.loadNewMemes()
      await this.profile.refreshMemes()
    } else if(this.state.focusPage==='thread' && !this.state.loading && this.thread) {
      //await this.thread.loadNewMemes()
      await this.thread.refreshMemes()
    }
  }
  handleLoading(loading) {
    this.setState({ loading })
    console.log(this.state.focusPage + ' loading: ' + this.state.loading)
  }
  handleBalance(umeBalance) {
    this.setState({ umeBalance })
  }
  async handleBack(e) {
    console.log(this.state.lastPage)
    const index = this.state.lastPage.length - 2,
          id = this.state.lastPage[index][1]
    console.log(index)
    console.log(id)
    if(this.state.lastPage[index][0]==='timeline') {
      await this.handleToTimeline(e)
    } else if(this.state.lastPage[index][0]==='profile') {
      this.setState({ lastPage: this.state.lastPage.pop() })
      this.setState({ lastPage: this.state.lastPage.pop() })
      await this.handleToProfile(id)
    } else if(this.state.lastPage[index][0]==='thread') {
      this.setState({ lastPage: this.state.lastPage.pop() })
      this.setState({ lastPage: this.state.lastPage.pop() })
      await this.handleToThread(id)
    }
  }

  async handleToTimeline(e) {
    e.preventDefault()
    console.log('coming from: ' + this.state.focusPage)
    console.log('timeline loading: ' + this.state.timelineLoading)
    this.clearPopups()
    if(this.state.focusPage!=='timeline') {
      this.setState({
        lastPage: [['timeline', '0x0']],
        back: false
      })
    }
    setTimeout(() => {
      this.setState({
        focusPage: 'timeline',
        timelineFormat: localStorage.getItem('timelineSort'),
        memeId: null
      })
    }, 50)
    console.log('timeline loading: ' + this.state.timelineLoading)
  }

  async handleToProfile(e) {
    this.setState({ lastPage: [...this.state.lastPage, ['profile', e]] })
    if(this.state.profileAccount!==e) {
      this.setState({
        focusPage: null
      })
    }
    this.clearPopups()
    this.setState({
      profileUsername: await this.state.userStorage.methods.getName(e).call().then(async e => await fromBytes(e)),
      profileAddress: await this.state.userStorage.methods.getUserAddr(e).call().then(async e => await fromBytes(e)),
      profileAccount: e
    })
    // add to lastPage
    await this.headerInfo()
    // update local storage
    localStorage.setItem('userInfo', e)
    setTimeout(() => {
      if(this.state.focusPage!=='profile') {
        this.setState({
          focusPage: 'profile',
          memeId: null
        })
      }
    }, 50)
  }

  async handleToThread(e) {
    this.setState({ lastPage: [...this.state.lastPage, ['thread', e]] })
    console.log('leaving page: ' + this.state.focusPage)
    if(this.state.memeId!==e){
      this.setState({
        focusPage: null
      })
    }
    this.clearPopups()
    this.setState({ memeId: e })
    setTimeout(() => {
      if(this.state.focusPage!=='thread') {
        this.setState({
          focusPage: 'thread'
        })
      }
    }, 50)
  }

  handleToSettings(e) {
  }

  async headerInfo() {
    const memeIds = await this.state.userStorage.methods.getPosts(this.state.profileAccount).call()
    let totalLikes = 0
    for(let i = 0; i < memeIds.length; i++) {
      totalLikes += await this.state.memeStorage.methods.getLikeCount(memeIds[i]).call().then(likeCount => parseInt(likeCount))
    }
    this.setState({
      totalLikes,
      userMemeCount: memeIds.length
    })
  }

  clearPopups() {
    this.setState({
      activePopup: null
    })
  }

  render() {
    return(
      <div
        className="Main"
        ref={Ref=>this.main=Ref}
      >
        <div id="side-header">
          <NavBar
            account={this.state.account}
            handleCreateMeme={this.handleCreateMeme}
            handleRefreshClick={this.handleRefreshClick}
            handleToTimeline={this.handleToTimeline}
            handleToProfile={this.handleToProfile}
            handleToSettings={this.handleToSettings}
          />
        </div>
        <div
          id="body"
          ref={Ref=>this.body=Ref}
        >
          <div id="subheader">
            <section id="title">
              { this.state.focusPage!=='timeline'
                  ? <
                      img src={Arrow}
                      alt="back-arrow"
                      onClick={this.handleBack}
                    />
                  : ''
              }
              { this.state.focusPage==='timeline'
                ? <a href="#home">
                    <p id="subheader">
                      uMe
                    </p>
                  </a>
                : this.state.focusPage==='profile'
                    ? <a href="#profile">
                        <p id="profile-subheader">
                          <span id="username">{this.state.profileUsername}</span>
                          <span id="memes">
                            {this.state.userMemeCount + ' Memes | '}
                            { this.state.totalLikes===1
                                ? this.state.totalLikes + ' Like'
                                : this.state.totalLikes + ' Likes'
                            }
                          </span>
                        </p>
                      </a>
                    : this.state.focusPage==='thread'
                        ? <a href="#home">
                            <p id="thread-subheader">
                              Thread
                            </p>
                          </a>
                        : ''
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
          { this.state.activePopup===null
              ? ''
              : this.state.activePopup==='upvote'
                  ? <UpvotePopup
                      positionX={`${this.state.popupX - this.body.getBoundingClientRect().left}`}
                      positionY={`${this.state.popupY}`}
                      account={this.state.account}
                      memeId={this.state.popupMeme}
                      umeBalance={this.state.umeBalance}
                      handleClose={this.handleClose}
                      interface={this.state.interface}
                    />
                  : this.state.activePopup==='downvote'
                      ? <DownvotePopup
                          positionX={`${this.state.popupX - this.body.getBoundingClientRect().left}`}
                          positionY={`${this.state.popupY}`}
                          account={this.state.account}
                          memeId={this.state.popupMeme}
                          umeBalance={this.state.umeBalance}
                          handleClose={this.handleClose}
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
                loading={this.state.loading}
                handleLoading={this.handleLoading}
                handleRefresh={this.handleRefresh}
                contractLoading={this.props.contractLoading}
                handleToProfile={this.handleToProfile}
                handleToThread={this.handleToThread}
                handleReply={this.handleReply}
                handleUpvotePopup={this.handleUpvotePopup}
                handleDownvotePopup={this.handleDownvotePopup}
                handleHeight={this.handleHeight}
                atBottom={this.props.atBottom}
                ref={Ref => this.timeline=Ref}
              />
            : this.state.focusPage==='profile' //&& !this.state.reload
              ? <Profile
                  account={this.state.account}
                  userStorage={this.state.userStorage}
                  memeStorage={this.state.memeStorage}
                  userMemeCount={this.state.userMemeCount}
                  interface={this.state.interface}
                  loading={this.state.loading}
                  handleLoading={this.handleLoading}
                  handleRefresh={this.handleRefresh}
                  contractLoading={this.props.contractLoading}
                  handleToProfile={this.handleToProfile}
                  handleToThread={this.handleToThread}
                  handleReply={this.handleReply}
                  handleEdit={this.handleEdit}
                  handleUpvotePopup={this.handleUpvotePopup}
                  handleDownvotePopup={this.handleDownvotePopup}
                  handleHeight={this.handleHeight}
                  profileUsername={this.state.profileUsername}
                  profileAddress={this.state.profileAddress}
                  profileAccount={this.state.profileAccount}
                  atBottom={this.props.atBottom}
                  ref={Ref => this.profile=Ref}
                />
                : this.state.focusPage==='thread'
                  ? <Thread
                      account={this.state.account}
                      userStorage={this.state.userStorage}
                      memeStorage={this.state.memeStorage}
                      userMemeCount={this.state.userMemeCount}
                      interface={this.state.interface}
                      loading={this.state.loading}
                      handleLoading={this.handleLoading}
                      handleRefresh={this.handleRefresh}
                      contractLoading={this.props.contractLoading}
                      handleToProfile={this.handleToProfile}
                      handleToThread={this.handleToThread}
                      handleReply={this.handleReply}
                      handleUpvotePopup={this.handleUpvotePopup}
                      handleDownvotePopup={this.handleDownvotePopup}
                      handleHeight={this.handleHeight}
                      atBottom={this.props.atBottom}
                      ref={Ref => this.thread=Ref}
                      memeId={this.state.memeId}
                    /*
                      memeUsername={this.state.memeUsername}
                      memeAddress={this.state.memeAddress}
                      text={this.state.text}
                      time={this.state.time}
                      likes={this.state.likes}
                      likers={this.state.likers}
                      responses={this.state.responses}
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
                      */
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
            ume={this.state.ume}
            handleToProfile={this.handleToProfile}
            handleBalance={this.handleBalance}
            ref={Ref=>this.stats=Ref}
          />
        </div>
      </div>
    )
  }
}

export default Main
