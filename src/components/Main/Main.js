import React from 'react'
import NavBar from '../NavBar/NavBar'
import SearchBar from '../SearchBar/SearchBar'
import Timeline from '../Timeline/Timeline'
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
      timelineLoading: true
    }

    this.timeline = React.createRef()

    this.handleCreateMeme = this.handleCreateMeme.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleTimelineLoad = this.handleTimelineLoad.bind(this)
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
    this.timeline.loadTimeline()
  }
  handleTimelineLoad(timelineLoading) {
    this.setState({ timelineLoading })
  }

  async loadTimeline() {
    this.timeline.loadTimeline()
  }

  render() {
    return(
      <div className="Main">
        <div className="Main-header">
          <NavBar
            account={this.state.account}
            handleMeme={this.handleCreateMeme}
            handleRefresh={this.handleRefresh}
          />
        </div>
        <div className="Main-body">
          <div className="Main-subheader">
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
          <Timeline
            account={this.state.account}
            userStorage={this.state.userStorage}
            memeStorage={this.state.memeStorage}
            memeCount={this.state.memeCount}
            interface={this.state.interface}
            timelineLoading={this.state.timelineLoading}
            handleLoading={this.handleTimelineLoad}
            ref={Ref => this.timeline=Ref}
          />
        </div>
      </div>
    )
  }
}

export default Main
