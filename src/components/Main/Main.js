import React from 'react'
import NavBar from '../NavBar/NavBar'
import SearchBar from '../SearchBar/SearchBar'
import Timeline from '../Timeline/Timeline'
import Profile from '../Profile/Profile'
import { blurToFadeIn, fadeOut, blur, unBlur, bobble } from '../../resources/Libraries/Animation'
import './Main.css'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: this.props.account,
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
      memeCount: this.props.memeCount,
      timelineLoading: true,
      profileLoading: true,
      focusPage: 'timeline'
    }

    this.timeline = React.createRef()
    this.profile = React.createRef()

    this.handleCreateMeme = this.handleCreateMeme.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleTimelineLoad = this.handleTimelineLoad.bind(this)
    this.handleToTimeline = this.handleToTimeline.bind(this)
    this.handleProfileLoad = this.handleProfileLoad.bind(this)
    this.handleToProfile = this.handleToProfile.bind(this)
  }

  componentDidMount() {
    blurToFadeIn('.Main-subheader', 2000)
    blurToFadeIn('.Main-header', 2000)
    blurToFadeIn('div.Timeline', 2000)
  }
  componentWillUnmount() {
    window.clearInterval()
  }

  handleCreateMeme(handleMeme) {
    this.setState({ creatingMeme: handleMeme })
    this.props.handleCreateMeme(handleMeme)
    //bobble()
    blur('div.App-header', 500)
    blur('div.App-body', 500)
  }
  handleRefresh(e) {
    e.preventDefault()
    if(this.state.focusPage==='timeline') {
      this.timeline.loadTimeline()
    } else if(this.state.focusPage==='profile') {
      this.profile.loadProfile()
    }
  }
  handleToTimeline(e) {
    e.preventDefault()
    if(this.state.focusPage!=='timeline') {
      this.setState({
        timelineLoading: true,
        focusPage: 'timeline'
      })
    } else {
      this.timeline.loadTimeline()
    }
  }
  handleTimelineLoad(timelineLoading) {
    this.setState({ timelineLoading })
  }
  handleProfileLoad(profileLoading) {
    this.setState({ profileLoading })
  }
  async handleToProfile(e) {
    if(e==='navbar') {
      e = [await this.state.userStorage.methods.getName(this.props.account).call(),
          await this.state.userStorage.methods.getUserAddr(this.props.account).call(),
          await this.state.account]
    }
    if(this.state.focusPage!=='profile') {
      this.setState({
        timelineLoading: true,
        focusPage: 'profile',
        profileUsername: e[0],
        profileAddress: e[1],
        profileAccount: e[2]
      })
    } else {
      this.profile.loadProfile()
    }
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
            handleToProfile={this.handleToProfile}
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
          { this.state.focusPage==='timeline'
            ? <Timeline
                account={this.state.account}
                userStorage={this.state.userStorage}
                memeStorage={this.state.memeStorage}
                memeCount={this.state.memeCount}
                interface={this.state.interface}
                timelineLoading={this.state.timelineLoading}
                handleLoading={this.handleTimelineLoad}
                handleToProfile={this.handleToProfile}
                ref={Ref => this.timeline=Ref}
              />
            : this.state.focusPage==='profile'
              ? <Profile
                  account={this.state.account}
                  userStorage={this.state.userStorage}
                  memeStorage={this.state.memeStorage}
                  memeCount={this.state.memeCount}
                  interface={this.state.interface}
                  profileLoading={this.state.profileLoading}
                  handleLoading={this.handleProfileLoad}
                  handleToProfile={this.handleToProfile}
                  profileUsername={this.state.profileUsername}
                  profileAddress={this.state.profileAddress}
                  profileAccount={this.state.profileAccount}
                  ref={Ref => this.profile=Ref}
                />
              : this.state.setState({focusPage: 'timeline'})
          }
        </div>
      </div>
    )
  }
}

export default Main
