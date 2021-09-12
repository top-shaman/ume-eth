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
      focusPage: 'timeline'
    }

    this.timeline = React.createRef()
    this.profile = React.createRef()

    this.handleCreateMeme = this.handleCreateMeme.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleTimelineLoad = this.handleTimelineLoad.bind(this)
    this.handleToTimeline = this.handleToTimeline.bind(this)
    this.handleProfileLoad = this.handleProfileLoad.bind(this)
    this.handleToProfileNavbar = this.handleToProfileNavbar.bind(this)
    this.handleToProfileTimeline = this.handleToProfileTimeline.bind(this)
    this.handleToProfileProfile = this.handleToProfileProfile.bind(this)
  }

  async componentDidMount() {
    if(localStorage.getItem('hasLoaded')!=='true') {
      //blurToFadeIn('.Main #subheader', 2000)
      //blurToFadeIn('.Main #header', 2000)
      //blurToFadeIn('div.Timeline', 2000)
      localStorage.setItem('hasLoaded', 'true')
    }
    this.setState({
      profileUsername: await this.state.userStorage.methods.getName(this.props.account).call().then(e => fromBytes(e)),
      profileAddress: await this.state.userStorage.methods.getUserAddr(this.props.account).call().then(e => fromBytes(e)),
      profileAccount: this.state.account,
    })
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
    }
  }
  componentWillUnmount() {
    window.clearInterval()
  }

  handleCreateMeme(handleMeme) {
    this.setState({ creatingMeme: handleMeme })
    this.props.handleCreateMeme(handleMeme)
    //bobble()
    blur('.Main div#header', 500)
    blur('.Main div#body', 500)
  }
  async handleRefresh(e) {
    e.preventDefault()
    if(this.state.focusPage==='timeline') {
      await this.timeline.loadTimeline()
    } else if(this.state.focusPage==='profile') {
      await this.profile.loadProfile()
    }
  }
  handleTimelineLoad(timelineLoading) {
    this.setState({
      timelineLoading: timelineLoading[0],
      timelineLoading: timelineLoading[1]
    })
    console.log('timeline loading: ' + timelineLoading)
  }
  async handleToTimeline(e) {
    e.preventDefault()
    this.setState({
      focusPage: 'timeline',
      timelineFormat: localStorage.getItem('pageInfo')
    })
    console.log('timeline loading: ' + this.state.timelineLoading)
  }
  handleProfileLoad(profileLoading) {
    this.setState({
      profileLoading: profileLoading
    })
    console.log('profile loading: ' + profileLoading)
  }
  async handleToProfileNavbar(e) {
    console.log('profile loading: ' + this.state.profileLoading)
    if(this.state.profileAccount!==this.state.account) {
      this.setState({
        profileUsername: await this.state.userStorage.methods.getName(this.state.account).call().then(e => fromBytes(e)),
        profileAddress: await this.state.userStorage.methods.getUserAddr(this.state.account).call().then(e => fromBytes(e)),
        profileAccount: this.state.account
      })
    }
    this.setState({
      focusPage: 'profile'
    })
  }
  async handleToProfileTimeline(e) {
    this.setState({
      profileUsername: e[0],
      profileAddress: e[1],
      profileAccount: e[2]
    })
    this.setState({
      focusPage: 'profile',
    })
  }
      // check if loading User's profile from Navbar
      /*
      if(e==='navbar') {
        // check if loading profile from other profile
        if(this.state.profileAccount!==this.state.account ||
           localStorage.getItem('pageInfo')==='user') {
          e = [await this.state.userStorage.methods.getName(this.state.account).call().then(e => fromBytes(e)),
               await this.state.userStorage.methods.getUserAddr(this.state.account).call().then(e => fromBytes(e)),
               this.state.account]
          this.setState({
            profileUsername: e[0],
            profileAddress: e[1],
            profileAccount: e[2],
            profileLoading: true
          })
          localStorage.setItem('focusPage', 'profile')
          localStorage.setItem('pageInfo', e)
          this.profile.loadProfile()
          //window.location.reload()
        }
      // check if loading a profile from profile
      } else if(//this.state.focusPage==='profile' &&
                e.toString().split(',').length===3 &&
                this.state.profileAccount!==e[2]) {
        this.setState({
          profileUsername: e[0],
          profileAddress: e[1],
          profileAccount: e[2]
        })
        localStorage.setItem('focusPage', 'profile')
        localStorage.setItem('pageInfo', e)
        //window.location.reload()
      }
      */
  handleToProfileProfile(e) {
  }

  render() {
    return(
      <div className="Main">
        <div id="header">
          <NavBar
            account={this.state.account}
            handleMeme={this.handleCreateMeme}
            handleRefresh={this.handleRefresh}
            handleToTimeline={this.handleToTimeline}
            handleToProfile={this.handleToProfileNavbar}
          />
        </div>
        <div className="Main" id="body">
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
                timelineLoading={this.state.timelineLoading}
                handleLoading={this.handleTimelineLoad}
                handleToProfile={this.handleToProfileTimeline}
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
                  handleToProfile={this.handleToProfileProfile}
                  profileUsername={this.state.profileUsername}
                  profileAddress={this.state.profileAddress}
                  profileAccount={this.state.profileAccount}
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
