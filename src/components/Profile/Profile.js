import React from 'react'
import Meme from "../Meme/Meme"
import { toBytes, fromBytes } from '../../resources/Libraries/Helpers'
import "./Profile.css"


class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userAccount: this.props.account,
      profileAccount: this.props.profileAccount,
      username: this.props.profileUsername,
      address: this.props.profileAddress,
      ume: null,
      memes: [],
      memesHTML: [],
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userMemeCount: null,
      profileLoading: true,
      firstLoad: true
    }

    this.handleToProfile = this.handleToProfile.bind(this)
  }
  handleLoading(e) {
    //console.log('check')
  }
  async componentDidMount() {
    clearInterval(this.intervalProfile)
    await this.loadProfile()
    this.intervalProfile = setInterval(async () => {
      this.setState({ firstLoad: false })
      await this.loadProfile()
    }, 10000)
  }
  async componentWillUnmount() {
    clearInterval(this.intervalProfile)
  }
  handleToProfile(e) {
    this.props.handleToProfile(e)
    /*
    this.setState({
      memes: [],
      memesHTML: [],
      oldMemesHTML: [],
      userMemeCount: null,
      profileLoading: true
    })
    */
    //this.loadProfile()
  }

  async loadProfile() {
    console.log(this.state.userAccount)
    console.log(this.state.profileAccount)
    console.log('load profile ' + new Date().toTimeString())
    const memeStorage = this.state.memeStorage,
          userStorage = this.state.userStorage
    const userMemes = await userStorage.methods.getPosts(this.state.profileAccount).call()
    const userMemeCount = await userMemes.length
    const countDifference = await userMemeCount - await this.state.userMemeCount
    if(await userMemeCount > this.state.userMemeCount) {
      this.setState({
        userMemeCount,
        profileLoading: true
      })
      for(let i = userMemeCount - countDifference + 1; i <= userMemeCount; i++) {
        const memeId = userMemes[i-1]
        const tempMeme = await memeStorage.methods.memes(memeId).call()
        const meme = {
          memeId: memeId,
          username: await userStorage.methods.users(tempMeme.author).call()
            .then(e => fromBytes(e.name))
            .then(e => e.toString()),
          address: await userStorage.methods.users(tempMeme.author).call()
            .then(e => fromBytes(e.userAddr))
            .then(e => e.toString()),
          text: tempMeme.text,
          time: new Date(tempMeme.time * 1000).toLocaleString(),
          boosts: tempMeme.boosts,
          likes: await memeStorage.methods.getLikeCount(memeId).call(),
          likers: await memeStorage.methods.getLikers(memeId).call(),
          rememeCount: await memeStorage.methods.getRepostCount(memeId).call(),
          rememes: await memeStorage.methods.getReposts(memeId).call(),
          quoteCount: await memeStorage.methods.getQuotePostCount(memeId).call(),
          quoteMemes: await memeStorage.methods.getQuotePosts(memeId).call(),
          responses: await memeStorage.methods.getResponses(memeId).call(),
          tags: await memeStorage.methods.getTags(memeId).call(),
          repostId: tempMeme.repostId,
          parentId: tempMeme.parentId,
          originId: tempMeme.originId,
          author: tempMeme.author,
          isVisible: tempMeme.isVisible,
          alreadyRendered: false
        }
        this.setState({
          memes: [...this.state.memes, meme],
        })
      }

      if(!this.state.firstLoad)
        this.setState({ memesHTML: this.state.oldMemesHTML })
      if(this.state.userMemeCount!==null)
        await this.renderProfile().catch(e => console.error(e))
      this.props.handleLoading(this.state.profileLoading)
    }
    else {
      this.setState({
        profileLoading: false
      })
    }
  }
  async renderProfile() {
    let memesHTML = []
    const memes = this.state.memes,
          userMemeCount = this.state.userMemeCount
    for(let i = 1; i <= userMemeCount; i++) {
      const meme = memes[i-1]
      memesHTML.unshift(
        <Meme
          key={i}
          memeId={meme.memeId}
          username={meme.username}
          address={meme.address}
          text={meme.text}
          time={meme.time}
          boosts={meme.boosts}
          likes={meme.likes}
          likers={meme.likers}
          rememeCount={meme.rememeCount}
          rememes={meme.rememes}
          quoteCount={meme.quoteCount}
          quoteMemes={meme.quoteMemes}
          responses={meme.responses}
          tags={meme.tags}
          repostId={meme.repostId}
          parentId={meme.parentId}
          originId={meme.originId}
          author={meme.author}
          isVisible={meme.isVisible}
          renderOrder={i}
          alreadyRendered={
            this.state.memesHTML[i-1]!==undefined
              ? this.state.memesHTML[i-1].alreadyRendered
              : false
          }
          zIndex="0"
          handleToProfile={this.handleToProfile}
          interface={this.props.interface}
          memeStorage={this.props.memeStorage}
          userAccount={this.props.account}
        />
      )
    }
    this.setState({
      memesHTML,
      profileLoading: false
    })
    if(this.state.firstLoad) {
      this.compileRenderedMemes()
    }
  }
  compileRenderedMemes() {
    let temp = []
    const memes = this.state.memes,
          userMemeCount = this.state.userMemeCount
    for(let i = 1; i <= userMemeCount; i++) {
      const meme = memes[i-1]
      temp.unshift(
        <Meme
          key={i}
          memes={meme.memeId}
          username={meme.username}
          address={meme.address}
          text={meme.text}
          time={meme.time}
          boosts={meme.boosts}
          likes={meme.likes}
          likers={meme.likers}
          rememe={meme.rememeCount}
          rememe={meme.rememes}
          quoteCount={meme.quoteCount}
          quoteMemes={meme.quoteMemes}
          responses={meme.responses}
          tags={meme.tags}
          repostId={meme.repostId}
          parentId={meme.parentId}
          originId={meme.originId}
          author={meme.author}
          isVisible={meme.isVisible}
          renderOrder={meme.renderOrder}
          alreadyRendered={true}
          handleToProfile={this.handleToProfile}
          zIndex="5"
          interface={this.props.interface}
          memeStorage={this.props.memeStorage}
          userAccount={this.props.account}
        />
      )
    }
    this.setState({ oldMemesHTML: temp })
  }

  render() {
    return(
      <div className="Profile">
        { this.state.profileLoading
          ? this.state.userMemeCount===null
            ? <div id="loader">
                <p>Loading...</p>
              </div>
            : <div id="loader-memes">
                <p>Loading...</p>
                {this.state.oldMemesHTML}
              </div>
          : this.state.userMemeCount> 0
            ? <div id="loaded">
                {this.state.memesHTML}
              </div>
            : <div id="loaded">
                <p>No memes loaded yet!</p>
              </div>
        }
      </div>
    );
  }
}

export default Profile
