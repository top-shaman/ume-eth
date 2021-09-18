import React from 'react'
import NavBar from '../NavBar/NavBar'
import SearchBar from '../SearchBar/SearchBar'
import Timeline from '../Timeline/Timeline'
import Profile from '../Profile/Profile'
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
      timelineFormat: 'time',
      timelineLoading: false,
      profileLoading: false,
      reload: false,
      focusPage: 'timeline',
      atBottom: false
    }

    this.timeline = React.createRef()
    this.profile = React.createRef()

    this.handleCreateMeme = this.handleCreateMeme.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleTimelineLoad = this.handleTimelineLoad.bind(this)
    this.handleToTimeline = this.handleToTimeline.bind(this)
    this.handleProfileLoad = this.handleProfileLoad.bind(this)
    this.handleToProfile = this.handleToProfile.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
  }

  async componentDidMount() {
    if(localStorage.getItem('hasLoaded')!=='true') {
      //blurToFadeIn('.Main #subheader', 2000)
      //blurToFadeIn('.Main #header', 2000)
      //blurToFadeIn('div.Timeline', 2000)
      localStorage.setItem('hasLoaded', 'true')
    }
    this.setState({
      profileUsername: await this.props.userStorage.methods.getName(this.props.account).call().then(e => fromBytes(e)),
      profileAddress: await this.props.userStorage.methods.getUserAddr(this.props.account).call().then(e => fromBytes(e)),
      profileAccount: this.props.account,
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
    if(this.state.focusPage==='timeline' && !this.state.timelineLoading) {
      await this.timeline.loadNewMemes()
      await this.timeline.refreshMemes()
    } else if(this.state.focusPage==='profile' && !this.state.profileLoading) {
      await this.profile.loadProfile()
    }
  }
  handleTimelineLoad(timelineLoading) {
    this.setState({ timelineLoading: timelineLoading })
    console.log('timeline loading: ' + timelineLoading)
  }
  async handleToTimeline(e) {
    e.preventDefault()
    if(!this.state.timelineLoading) {
      this.setState({
        focusPage: 'timeline',
        timelineFormat: localStorage.getItem('pageInfo')
      })
      console.log('timeline loading: ' + this.state.timelineLoading)
    }
  }

  handleProfileLoad(profileLoading) {
    this.setState({
      profileLoading: profileLoading
    })
    console.log('profile loading: ' + profileLoading)
  }
  async handleToProfile(e) {
    console.log('CLICK')
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
            profileAccount: this.state.account,
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
                  handleToProfile={this.handleToProfileProfile}
                  handleReply={this.handleReply}
                  profileUsername={this.state.profileUsername}
                  profileAddress={this.state.profileAddress}
                  profileAccount={this.state.profileAccount}
                  atBottom={this.state.atBottom}
                  ref={Ref => this.profile=Ref}
                />
                : ''
          }
        </div>
      </div>
    )
  }
}

export default Main
