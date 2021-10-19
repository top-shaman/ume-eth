import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import Loader from '../Loader/Loader'
import { fromBytes } from '../../resources/Libraries/Helpers'
import './Stats.css'
import Logo from '../../resources/UME-green.svg'

class Stats extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: this.props.account,
      username: '',
      address: '',
      memes: 0,
      totalLikes: 0,
      followers: 0,
      umeBalance: 0,
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      ume: this.props.ume,
      statsLoading: true,
    }

    this.handleToProfile = this.handleToProfile.bind(this)
  }
  async componentDidMount() {
    await this.setInfo().catch(e=>console.error(e))
    this.mounted = true
  }
  componentWillUnmount() {
    this.mounted = false
  }

  handleToProfile(e) {
    e.preventDefault()
    this.props.handleToProfile(this.state.account)
  }

  async setInfo() {
    const username = await this.state.userStorage.methods.getName(this.state.account).call()
                       .then(elem => fromBytes(elem)),
          address = await this.state.userStorage.methods.getUserAddr(this.state.account).call()
                       .then(elem => fromBytes(elem)),
          memes = await this.state.userStorage.methods.getPostCount(this.state.account).call().then(elem => parseInt(elem)),
          totalLikes = await this.calculateLikes(),
          followers = await this.state.userStorage.methods.getFollowerCount(this.state.account).call(),
      umeBalance = await this.state.ume.methods.balanceOf(this.state.account).call().then(balance => new Intl.NumberFormat('en-IN', {}).format(balance))
    this.setState({
      username,
      address,
      memes,
      totalLikes,
      followers,
      umeBalance,
      statsLoading: false
    })
    this.props.handleBalance(umeBalance)
  }
  async calculateLikes() {
    const memeIds = await this.state.userStorage.methods.getPosts(this.state.account).call()
    let likes = 0
    for(let i = 0; i < memeIds.length; i++) {
      likes += await this.state.memeStorage.methods.getLikeCount(memeIds[i]).call().then(likeCount => parseInt(likeCount))
    }
    return likes
  }

  render() {
    return(
      <div id="stats-container">
      { this.state.statsLoading
          ? <div id="loader"><Loader/></div>
          : <div id="stats">
              <div id="stats-header">
                <a href={this.state.address.split(1)} onClick={this.handleToProfile}>
                  <ProfilePic account={this.state.account} />
                </a>
                <p id="info">
                  <a href={this.state.address.split(1)} onClick={this.handleToProfile}>
                    <span id="username">{this.state.username}</span>
                  </a>
                  <br/>
                  <a href={this.state.address.split(1)} onClick={this.handleToProfile}>
                    <span id="address">{this.state.address}</span>
                  </a>
                </p>
              </div>
              <div id="stats-body">
                <p id="stats">
                  <span id="label">Memes: </span>
                  <span id="data">{this.state.memes}</span>
                  <br/>
                  <span id="label">Likes: </span>
                  <span id="data">{this.state.totalLikes}</span>
                  <br/>
                  <span id="label">Followers: </span>
                  <span id="data">{this.state.followers}</span>
                </p>
                <p id="balance">
                  <span id="bold-label">UME</span><span id="label"> balance: </span>
                  <br/>
                  <span id="data">
                    <img id="logo" src={Logo} alt="logo"/>
                    {this.state.umeBalance}
                  </span>
                </p>

              </div>
            </div>
        }
      </div>
    )
  }

}

export default Stats
