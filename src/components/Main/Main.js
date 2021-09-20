import React from 'react'
import NavBar from '../NavBar/NavBar'
import SearchBar from '../SearchBar/SearchBar'
import Timeline from '../Timeline/Timeline'
import Profile from '../Profile/Profile'
import Thread from '../Thread/Thread'
import { blurToFadeIn, fadeOut, blur, unBlur, bobble } from '../../resources/Libraries/Animation'
import './Main.css'
import {fromBytes} from '../../resources/Libraries/Helpers'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account,
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
      memeCount: this.props.memeCount,
      userMemeCount: this.props.userMemeCount,
      timelineFormat: 'boost',
      timelineLoading: false,
      profileLoading: false,
      threadLoading: false,
      reload: false,
      focusPage: 'timeline',
      atBottom: false
    }

    this.timeline = React.createRef()
    this.profile = React.createRef()
    this.thread = React.createRef()

    this.handleCreateMeme = this.handleCreateMeme.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleTimelineLoad = this.handleTimelineLoad.bind(this)
    this.handleToTimeline = this.handleToTimeline.bind(this)
    this.handleProfileLoad = this.handleProfileLoad.bind(this)
    this.handleToProfile = this.handleToProfile.bind(this)
    this.handleThreadLoad = this.handleThreadLoad.bind(this)
    this.handleToThread = this.handleToThread.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
  }

  async componentDidMount() {
    if(localStorage.getItem('hasLoaded')!=='true') {
      //blurToFadeIn('.Main #subheader', 2000)
      //blurToFadeIn('.Main #header', 2000)
      //blurToFadeIn('div.Timeline', 2000)
      localStorage.setItem('hasLoaded', 'true')
    }
    /*
    if(localStorage.getItem('focusPage')==='profile') {
      const profile = localStorage.getItem('pageInfo')
      console.log(profile)
      if(profile==='user') {
        this.setState({
          profileUsername: await this.props.userStorage.methods.getName(this.props.account).call().then(e => fromBytes(e)),
          profileAddress: await this.props.userStorage.methods.getUserAddr(this.props.account).call().then(e => fromBytes(e)),
          profileAccount: this.props.account,
          focusPage: 'profile'
        })
      } else if(profile.split(',').length===3) {
        this.setState({
          profileUsername: profile.split(',')[0],
          profileAddress: profile.split(',')[1],
          profileAccount: profile.split(',')[2],
          focusPage: 'profile'
        })
      }
    }
    */
    this.setState({
      profileUsername: await this.props.userStorage.methods.getName(this.props.account).call().then(e => fromBytes(e)),
      profileAddress: await this.props.userStorage.methods.getUserAddr(this.props.account).call().then(e => fromBytes(e)),
      profileAccount: this.props.account
    })
    this.setState({
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
    })
    /*
    if(localStorage.getItem('focusPage')==='profile') {
      if(localStorage.getItem('pageInfo').split(',').length===3){
        const profile = localStorage.getItem('pageInfo').split(',')
        if(profile.length===3) {
          this.setState({
            profileLoading: true,
            focusPage: 'profile',
            profileUsername: profile[0],
            profileAddress: profile[1],
            profileAccount: profile[2]
          })
        }
      }
    }*/
  }
  componentWillUnmount() {
    window.clearInterval()
  }

  handleCreateMeme(handleCreateMeme) {
    this.setState({ creatingMeme: handleCreateMeme })
    this.props.handleCreateMeme(handleCreateMeme)
    //bobble()
    blur('.Main div#header', 500)
    blur('.Main div#body', 500)
  }
  handleReply(handleReply) {
    this.setState({ replying: handleReply})
    this.props.handleReply(handleReply)
    //bobble()
    blur('.Main div#header', 500)
    blur('.Main div#body', 500)
  }
  async handleRefresh(e) {
    e.preventDefault()
    if(this.state.focusPage==='timeline' && !this.state.timelineLoading && !this.state.threadLoading) {
      await this.timeline.loadNewMemes()
      await this.timeline.refreshMemes()
    } else if(this.state.focusPage==='profile' && !this.state.profileLoading && !this.state.threadLoading) {
      await this.profile.loadNewMemes()
      await this.profile.refreshMemes()
    } else if(this.state.focusPage==='thread' && !this.state.timelineLoading && !this.state.profileLoading) {
      await this.thread.loadNewMemes()
      await this.thread.refreshMemes()
    }

  }
  handleTimelineLoad(timelineLoading) {
    this.setState({ timelineLoading })
    console.log('timeline loading: ' + timelineLoading)
  }
  async handleToTimeline(e) {
    e.preventDefault()
    console.log(localStorage.getItem('focusPage'))
    console.log(localStorage.getItem('timelineSort'))
    if(!this.state.timelineLoading) {
      this.setState({
        focusPage: 'timeline',
        timelineFormat: localStorage.getItem('timelineSort')
      })
      console.log('timeline loading: ' + this.state.timelineLoading)
    }
  }

  handleProfileLoad(profileLoading) {
    this.setState({
      profileLoading
    })
    console.log('profile loading: ' + profileLoading)
  }
  async handleToProfile(e) {
    if(!this.state.timelineLoading) {
      if(e!=='user') {
        this.setState({
          profileUsername: e[0],
          profileAddress: e[1],
          profileAccount: e[2]
        })
      } else if(e==='user') {
        if(this.state.focusPage==='profile' && this.state.account!==this.state.profileAccount) {
          this.setState({
            profileUsername: await this.state.userStorage.methods.getName(this.state.account).call(),
            profileAddress: await this.state.userStorage.methods.getUserAddr(this.state.account).call(),
            profileAccount: this.props.account,
            profileLoading: true,
            focusPage: null,
          })
        }
      }
      this.setState({
        focusPage: 'profile',
      })
    }
  }
  handleThreadLoad(threadLoading) {
    this.setState({
      threadLoading
    })
    console.log('thread loading: ' + threadLoading)
  }
  handleToThread(e) {
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
      interface: this.state.interface,
      memeStorage: this.state.memeStorage,
      userAccount: this.state.account,
      focusPage: 'thread'
    })
  }

  handleScroll(e) {
    if(e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight+150) {
      this.setState({ atBottom: true })
    }
    else this.setState({ atBottom: false })
  }
  render() {
    return(
      <div className="Main">
        <div id="header">
          <NavBar
            account={this.state.account}
            handleCreateMeme={this.handleCreateMeme}
            handleRefresh={this.handleRefresh}
            handleToTimeline={this.handleToTimeline}
            handleToProfile={this.handleToProfile}
          />
        </div>
        <div className="Main" id="body" onScroll={this.handleScroll}>
          <div id="subheader">
            <section id="title">
              <a href="#home">
                <p id="subheader">
                  uMe
                </p>
              </a>
            </section>
            <section id="searchBar">
              <SearchBar
                userStorage={this.state.userStorage}
                memeStorage={this.state.memeStorage}
              />
            </section>
          </div>
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
                      profileLoading={this.state.profileLoading}
                      handleLoading={this.handleProfileLoad}
                      contractLoading={this.props.contractLoading}
                      handleToProfile={this.handleToProfile}
                      handleToThread={this.handleToThread}
                      handleReply={this.handleReply}
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
                      interface={this.state.interface}
                      memeStorage={this.state.memeStorage}
                      userAccount={this.state.account}
                    />
                  : ''
          }
        </div>
      </div>
    )
  }
}

export default Main
