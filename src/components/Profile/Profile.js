import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import ProfileThread from './ProfileThread'
import "./Profile.css"


class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userAccount: this.props.account,
      profileAccount: this.props.profileAccount,
      username: this.props.profileUsername,
      address: this.props.profileAddress,
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userMemeCount: this.props.userMemeCount,
      profileLoading: false,
      refreshing: false,
      atBottom: this.props.atBottom
    }

    this.handleToProfile = this.handleToProfile.bind(this)
    this.handleToThread = this.handleToThread.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleLoading = this.handleLoading.bind(this)
  }
  // lifecycles
  async componentDidMount() {
    console.log('profile user: ' + this.state.userAccount)
    console.log('profile account: ' + this.state.profileAccount)
    console.log('profile address: ' + this.state.address)
    console.log('profile username: ' + this.state.username)

    await this.compileProfile()
  }
  componentDidUpdate() {
  }
  componentWillUnmount() {
    this.props.handleLoading(false)
  }

  // handles
  handleToProfile(e) {
    if(!this.state.profileLoading) {
      this.props.handleToProfile(e)
    }
  }
  handleToThread(e) {
    if(!this.state.profileLoading) {
      this.props.handleToThread(e)
    }
  }
  handleEdit(e) {
    this.props.handleEdit([
      this.state.username,
      this.state.bio
    ])
  }
  handleReply(e) {
    this.props.handleReply(e)
  }
  handleLoading(e) {
    this.props.handleLoading(e)
  }

  async compileProfile() {
    const isFollowing = await this.state.userStorage.methods.isFollowing(this.state.userAccount, this.state.profileAccount).call(),
          isFollower = await this.state.userStorage.methods.isFollower(this.state.userAccount, this.state.profileAccount).call(),
          following = await this.state.userStorage.methods.getFollowingCount(this.state.profileAccount).call(),
          followers = await this.state.userStorage.methods.getFollowerCount(this.state.profileAccount).call(),
          bio = await this.state.userStorage.methods.users(this.state.profileAccount).call().then(e => e.bio),
      time = await this.state.userStorage.methods.users(this.state.profileAccount).call().then(e => new Date(e.time*1000).toLocaleDateString(undefined, {month: 'long', year: 'numeric'}))
    this.setState({
      isFollowing,
      isFollower,
      following,
      followers,
      bio,
      time
    })
    console.log(this.state.following + '\n' +
                this.state.followers + '\n' +
                this.state.bio + '\n' +
                this.state.time
    )
  }

  render() {
    return(
      <div className="Profile">
        <div id="Profile">
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
                  : this.state.isFollowing
                      ? <p id="following">Following</p>
                      : <p id="follow">Follow</p>
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
              { this.state.followers===1
                  ? <span> Follower</span>
                  : <span> Followers</span>
              }
            </p>
          </div>
        </div>
        <ProfileThread
          account={this.state.account}
          userStorage={this.state.userStorage}
          memeStorage={this.state.memeStorage}
          userMemeCount={this.state.userMemeCount}
          interface={this.state.interface}
          profileLoading={this.state.profileLoading}
          handleLoading={this.handleLoading}
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
      </div>
    );
  }
}

export default Profile
