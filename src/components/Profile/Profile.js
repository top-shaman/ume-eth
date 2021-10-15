import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import ProfileThread from './ProfileThread'
import { fromBytes } from '../../resources/Libraries/Helpers'
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

    this.handleToProfile = this.handleToProfile.bind(this)
    this.handleToThread = this.handleToThread.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleFollow = this.handleFollow.bind(this)

    this.handleLoading = this.handleLoading.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)

    this.handleUpvotePopup = this.handleUpvotePopup.bind(this)
    this.handleDownvotePopup = this.handleDownvotePopup.bind(this)

  }
  // lifecycles
  async componentDidMount() {
    console.log(this.state.profileAccount)
    await this.compileProfile()
    console.log(this.state.profileAccount)
    console.log(this.state.username)
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
  handleReply(e) {
    this.props.handleReply(e)
  }
  async handleFollow(e) {
    e.preventDefault()
    await this.state.interface.methods.followUser(this.state.userAccount, this.state.profileAccount).send({from: this.state.userAccount}).then(() => this.compileProfile())
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
    this.setState({
      username,
      address,
      isFollowing,
      isFollower,
      following,
      followers,
      bio,
      time,
      userMemeCount,
      infoLoading: false
    })
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
