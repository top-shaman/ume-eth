import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import ProfileThread from './ProfileThread'
import Tag from '../Tag/Tag'
import { toBytes, fromBytes, isolateAt, isolateHash, isolatePlain } from '../../resources/Libraries/Helpers'
import "./Profile.css"


class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userAccount: this.props.account,
      profileAccount: this.props.profileAccount,
      username: '',
      address: '',
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userMemeCount: this.props.userMemeCount,
      loading: false,
      infoLoading: true,
      refreshing: false
    }
    this.profile = React.createRef()

    this.handleToProfile = this.handleToProfile.bind(this)
    this.handleToThread = this.handleToThread.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleTag = this.handleTag.bind(this)

    this.handleReply = this.handleReply.bind(this)
    this.handleFollow = this.handleFollow.bind(this)

    this.handleLoading = this.handleLoading.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)

    this.handleUpvotePopup = this.handleUpvotePopup.bind(this)
    this.handleDownvotePopup = this.handleDownvotePopup.bind(this)
    this.handleBanner = this.handleBanner.bind(this)

  }
  // lifecycles
  async componentDidMount() {
    await this.compileProfile().catch(e=>console.error(e))
  }
  componentDidUpdate() {
  }
  componentWillUnmount() {
    this.props.handleLoading(false)
  }

  // handles
  handleToProfile(e) {
    if(!this.state.loading) {
      this.setState({ loading: e })
      this.props.handleToProfile(e)
    }
  }
  handleToThread(e) {
    if(!this.state.loading) {
      this.props.handleToThread(e)
    }
  }
  handleEdit(e) {
    this.props.handleEdit([
      this.state.username,
      this.state.address,
      this.state.bio
    ])
  }
  async handleTag(e) {
    const address = await toBytes(e).catch(e=>console.error(e)),
          account = await this.state.userStorage.methods.usersByUserAddr(address).call().catch(e=>console.error(e))
    if(account!=='0x0000000000000000000000000000000000000000') {
      this.props.handleToProfile(await account)
    }
  }
  handleReply(e) {
    this.props.handleReply(e)
  }
  async handleFollow(e) {
    e.preventDefault()
    this.props.handleBanner([
      'Waiting',
      'Follow',
      this.state.profileAccount
    ])
    await this.state.interface.methods
      .followUser(this.state.userAccount, this.state.profileAccount)
      .send({from: this.state.userAccount})
      .on('transactionHash', () => {
        this.props.handleBanner([
          'Writing',
          'Follow',
          this.state.profileAccount
        ])
      })
      .on('receipts', () => {
        this.props.handleBanner([
          'Success',
          'Follow',
          this.state.profileAccount
        ])
      })
      .then(() => this.compileProfile())
      .catch(e => {
        this.props.handleBanner([
          'Cancel',
          'Follow',
          this.state.profileAccount
        ])
        console.error(e)
      })
  }
  handleLoading(e) {
    this.props.handleLoading(e)
  }
  handleRefresh(e) {
    this.props.handleRefresh(e)
  }
  handleUpvotePopup(e) {
    this.props.handleUpvotePopup(e)
  }
  handleDownvotePopup(e) {
    this.props.handleDownvotePopup(e)
  }
  handleBanner(e) {
    this.props.handleBanner(e)
  }

  loadNewMemes() {
    this.profile.loadNewMemes()
  }
  refreshMemes() {
    this.profile.refreshMemes()
  }

  async compileProfile() {
    const username = await this.state.userStorage.methods.getName(this.state.profileAccount).call().then(e => fromBytes(e)),
          address = await this.state.userStorage.methods.getUserAddr(this.state.profileAccount).call().then(e => fromBytes(e)),
          isFollowing = await this.state.userStorage.methods.isFollowing(this.state.userAccount, this.state.profileAccount).call(),
          isFollower = await this.state.userStorage.methods.isFollower(this.state.userAccount, this.state.profileAccount).call(),
          following = await this.state.userStorage.methods.getFollowingCount(this.state.profileAccount).call(),
          followers = await this.state.userStorage.methods.getFollowerCount(this.state.profileAccount).call(),
          bio = await this.state.userStorage.methods.users(this.state.profileAccount).call().then(e => e.bio),
          time = await this.state.userStorage.methods.users(this.state.profileAccount).call().then(e => new Date(e.time*1000).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})),
          userMemeCount = await this.state.userStorage.methods.getPostCount(this.state.profileAccount).call()
    await this.formatText(await bio)
    this.setState({
      username,
      address,
      isFollowing,
      isFollower,
      following,
      followers,
      time,
      userMemeCount,
      infoLoading: false
    })
  }
  async formatText(text) {
    let plainMap = await isolatePlain(text).catch(e=>console.error(e)),
        atMap = await isolateAt(text).catch(e=>console.error(e)),
        hashMap = await isolateHash(text).catch(e=>console.error(e)),
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
    this.setState({ bio: formatted })
  }

  render() {
    return(
      <div className="Profile">
        { this.state.infoLoading
            ? ''
            : <div id="Profile">
                <div id="header">
                  <div id="left">
                    <ProfilePic
                      account={this.state.profileAccount}
                    />
                    <p id="info">
                      <span id="username">{this.state.username}</span>
                      <span id="address">{this.state.address}</span>
                    </p>
                  </div>
                  <div id="right">
                    { this.state.profileAccount===this.state.userAccount
                        ? <p
                            id="edit"
                            onClick={this.handleEdit}
                          >
                            Edit profile
                          </p>
                        : this.state.isFollower
                            ? <
                                p id="following"
                                onClick={this.handleFollow}
                              >
                                Following
                              </p>
                            : <
                                p id="follow"
                                onClick={this.handleFollow}
                              >
                                Follow
                              </p>
                    }
                  </div>
                </div>
                <div id="body">
                  <p id="bio">{this.state.bio}</p>
                  <span id="time">Joined {this.state.time}</span>
                </div>
                <div id="footer">
                  <p id="following-count">
                    <span id="count">
                      {this.state.following}
                    </span>
                    <span> Following</span>
                  </p>
                  <p id="follower-count">
                    <span id="count">
                      {this.state.followers}
                    </span>
                    { this.state.followers==='1'
                        ? <span> Follower</span>
                        : <span> Followers</span>
                    }
                  </p>
                </div>
              </div>
        }
        <ProfileThread
          account={this.state.userAccount}
          userStorage={this.state.userStorage}
          memeStorage={this.state.memeStorage}
          userMemeCount={this.state.userMemeCount}
          interface={this.state.interface}
          handleLoading={this.handleLoading}
          handleRefresh={this.handleRefresh}
          contractLoading={this.props.contractLoading}
          handleToProfile={this.handleToProfile}
          handleToThread={this.handleToThread}
          handleReply={this.handleReply}
          handleUpvotePopup={this.handleUpvotePopup}
          handleDownvotePopup={this.handleDownvotePopup}
          handleBanner={this.handleBanner}
          profileUsername={this.state.profileUsername}
          profileAddress={this.state.profileAddress}
          profileAccount={this.state.profileAccount}
          atBottom={this.props.atBottom}
          ref={Ref => this.profile=Ref}
        />
      </div>
    );
  }
}

export default Profile
