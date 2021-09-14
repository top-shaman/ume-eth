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
      oldMemesHTML: [],
      memesHTML: [],
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userMemeCount: null,
      memesToRender: 50,
      memesNotRendered: null,
      memesRendered: 0,
      profileLoading: false,
      firstLoad: true,
      sortStyle: 'time'
    }

    this.handleToProfile = this.handleToProfile.bind(this)
  }
  async componentDidMount() {
    console.log(this.state.userAccount)
    console.log(this.state.profileAccount)
    console.log(this.state.address)
    console.log(this.state.username)
    clearInterval(this.intervalProfile)
    if(this.state.firstLoad) {
      await this.loadProfile()
      this.intervalProfile = setInterval(async () => {
        //this.setState({ firstLoad: false })
        await this.loadProfile()
        if(!this.props.atBottom && !this.state.firstLoad && !this.state.loadingBottom) {
          await this.loadNewMemes()
          await this.refreshMemes()
        }
        else if (this.props.atBottom && !this.state.firstLoad && this.state.memesNotRendered!==0 && !this.state.loadingBottom) {
          await this.loadOldMemes()
        }
      }, 10000)
    }
    this.mounted = true
  }
  async componentWillUnmount() {
    clearInterval(this.intervalProfile)
    this.mounted = false
  }
  handleToProfile(e) {
    if(!this.state.profileLoading) {
      this.props.handleToProfile(e)
    }
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
  handleRefresh(e) {
    e.preventDefault()
    setTimeout(() => this.refreshMemes(), 2000)
  }

  async loadProfile() {
    if(!this.state.profileLoading) {
      console.log('load profile ' + new Date().toTimeString())
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            userMemes = await userStorage.methods.getPosts(await this.state.profileAccount).call(),
            userMemeCount = userMemes.length

      let memesToRender = await this.state.memesToRender,
          memesNotRendered = userMemeCount - memesToRender,
          totalMemesRendered = 0,
          memesRendered = 0

      if(userMemeCount>memesToRender) {
        memesNotRendered = userMemeCount - memesToRender
      } else if(userMemeCount<memesToRender) {
        memesToRender = userMemeCount
        memesNotRendered = 0
      }

      if(this.state.firstLoad) {
        this.setState({
          profileLoading: true,
          userMemeCount,
          memesNotRendered
        })
        for(let i = 0; i < memesToRender; i++) {
          const memeId = userMemes[i+memesNotRendered]
          const meme = await this.populateMeme(memeId, i, memeStorage, userStorage)
          this.setState({
            memes: [...this.state.memes, meme],
          })
          this.sortToStyle(this.state.sortStyle)
          memesRendered++
        }
        this.setState({ memesHTML: this.state.oldMemesHTML })
        await this.renderProfile(memesRendered).catch(e => console.error(e))
        totalMemesRendered += memesRendered
        //console.log('first load: ' + this.state.firstLoad)
        this.setState({
          memesNotRendered,
          memesRendered: totalMemesRendered,
          profileLoading: false,
          firstLoad: false
        })
        //console.log('total memes: ' + userMemeCount)
        //console.log('memes rendered: ' + totalMemesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)
        await this.props.handleLoading(this.state.profileLoading)
      }
      else {
        this.setState({
          profileLoading: false,
        })
      }
    }
  }

  //loads new memes above rendered section
  async loadNewMemes() {
    if(!this.state.firstLoad && !this.state.loadingBottom && !this.props.atBottom) {
      console.log('loading new memes' + new Date().toTimeString())
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            userMemes = await userStorage.methods.getPosts(this.state.profileAccount).call(),
            userMemeCount = userMemes.length

      let memesToRender = await this.state.memesToRender,
          memesNotRendered = await this.state.memesNotRendered,
          totalMemesRendered = await this.state.memesRendered,
          memesRendered = 0
      const countDifference = await userMemeCount - await this.state.userMemeCount
      memesNotRendered += countDifference
      if(countDifference>0) {
        memesToRender = countDifference
        this.setState({
          profileLoading: true,
          userMemeCount
        })
        for(let i = 0; i < countDifference; i++) {
          const adjustment = userMemeCount - countDifference
          //figure out how to calculate proper memeId
          const memeId = userMemes[i+adjustment]
          const meme = await this.populateMeme(memeId, i, memeStorage, userStorage)
          this.setState({
            memes: [...this.state.memes, meme],
          })
          this.sortToStyle(this.state.sortStyle)
          memesRendered++
        }
        // sorting functionality
        this.setState({ memesHTML: this.state.oldMemesHTML })
        await this.renderProfile(memesRendered).catch(e => console.error(e))
        totalMemesRendered += memesRendered
        memesNotRendered -= memesRendered
        this.setState({
          memesNotRendered,
          memesRendered: totalMemesRendered,
          profileLoading: false
        })
        //console.log('total memes: ' + userMemeCount)
        //console.log('memes rendered: ' + totalMemesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)
        await this.props.handleLoading(this.state.profileLoading)
      }
      else {
        this.setState({
          profileLoading: false,
        })
      }
    }
  }

  // loads old memes below profile section
  async loadOldMemes() {
    if(!this.state.firstLoad && this.props.atBottom && this.state.loadingBottom) {
      console.log('load old memes ' + new Date().toTimeString())
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            uInterface = await this.props.interface,
            userMemes = await userStorage.methods.getPosts(this.state.profileAccount).call(),
            userMemeCount = userMemes.length
      let memesToRender = await this.state.memesToRender,
          memesNotRendered = await this.state.memesNotRendered,
          totalMemesRendered = await this.state.memesRendered,
          memesRendered = 0

      if(memesNotRendered-memesToRender <= 0) {
        memesToRender = memesNotRendered
      }

      if(memesToRender!==0) {
        this.setState({
          profileLoading: true,
          loadingBottom: true,
          userMemeCount
        })
        for(let i = 0; i < memesToRender; i++) {
          const adjustment = memesNotRendered - memesToRender + i
          const memeId = userMemes[i+adjustment]
          const meme = await this.populateMeme(memeId, i, memeStorage, userStorage)
          this.setState({
            memes: [...this.state.memes, meme],
          })
          this.sortToStyle(this.state.sortStyle)
          memesRendered++
        }
        // sorting functionality
        this.setState({ memesHTML: this.state.oldMemesHTML })
        await this.renderProfile(memesRendered).catch(e => console.error(e))
        totalMemesRendered += memesRendered
        memesNotRendered -= memesRendered
        this.setState({
          memesNotRendered,
          memesRendered: totalMemesRendered,
          profileLoading: false,
          loadingBottom: false
        })
        //console.log('total memes: ' + userMemeCount)
        //console.log('memes rendered: ' + totalMemesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)
        await this.props.handleLoading(this.state.profileLoading)
      }
      else {
        this.setState({
          profileLoading: false,
          loadingBottom: false
        })
      }
    }
  }

  async refreshMemes() {
    if(!this.state.profileLoading) {
    console.log('refreshing memes ' + new Date().toTimeString())
      let loadedMemes = this.state.memes
      this.setState({ profileLoading: true })

      loadedMemes.forEach(async e => {
        const newResponses = await this.props.memeStorage.methods.getResponses(e.memeId).call()
        const newLikers = await this.props.memeStorage.methods.getLikers(e.memeId).call()
        const newRememes = await this.props.memeStorage.methods.getReposts(e.memeId).call()
        const newQuoteMemes = await this.props.memeStorage.methods.getQuotePosts(e.memeId).call()
        const newBoosts = await this.props.memeStorage.methods.getBoost(e.memeId).call()
        if(e.responses.length!==newResponses.length) {
          e.responses = newResponses
        }
        if(e.likes!==newLikers.length) {
          e.likes = newLikers.length
          e.likers = newLikers
        }
        if(e.rememeCount!==newRememes.length){
          e.rememeCount = newRememes.length
          e.rememes = newRememes
        }
        if(e.quoteCount!==newQuoteMemes.length){
          e.quoteCount = newQuoteMemes.length
          e.quoteMemes = newQuoteMemes
        }
        if(e.boosts!==newBoosts) {
          e.boosts = newBoosts
        }
        e.alreadyRendered = true
      })

      this.sortToStyle(this.state.sortStyle)
      this.setState({ memesHTML: this.state.oldMemesHTML })
      await this.renderProfile(0).catch(e => console.error(e))
      this.setState({ profileLoading: false })
    }


  }

  // helper functions
  async populateMeme(memeId, count, memeStorage, userStorage) {
    const tempMeme = await memeStorage.methods.memes(memeId).call()
    const username = await userStorage.methods.users(tempMeme.author).call()
        .then(e => fromBytes(e.name))
        .then(e => e.toString())
    const address = await userStorage.methods.users(tempMeme.author).call()
        .then(e => fromBytes(e.userAddr))
        .then(e => e.toString())
    return {
      memeId: await memeId,
      username: await username,
      address: await address,
      text: await tempMeme.text,
      time: new Date(tempMeme.time * 1000).toLocaleString(),
      boosts: await tempMeme.boosts,
      likes: await memeStorage.methods.getLikeCount(memeId).call(),
      likers: await memeStorage.methods.getLikers(memeId).call(),
      rememeCount: await memeStorage.methods.getRepostCount(memeId).call(),
      rememes: await memeStorage.methods.getReposts(memeId).call(),
      quoteCount: await memeStorage.methods.getQuotePostCount(memeId).call(),
      quoteMemes: await memeStorage.methods.getQuotePosts(memeId).call(),
      responses: await memeStorage.methods.getResponses(memeId).call(),
      tags: await memeStorage.methods.getTags(memeId).call(),
      repostId: await tempMeme.repostId,
      parentId: await tempMeme.parentId,
      originId: await tempMeme.originId,
      author: await tempMeme.author,
      isVisible: await tempMeme.isVisible,
      //renderOrder: 0,
      alreadyRendered: false
    }
  }

  async renderProfile(memesRendered) {
    const tempMemesHTML = [],
          tempMemes = this.state.memes,
      //    memesToRender = this.state.memesToRender,
          totalMemesRendered = this.state.memesRendered,
          userMemeCount = this.state.userMemeCount
    if(userMemeCount!==null) {
      let meme
      for(let i = 1; i <= totalMemesRendered+memesRendered; i++) {
        meme = tempMemes[i-1]
        //add Meme component to temporary array
        if(meme.isVisible) {
          tempMemesHTML.unshift(
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
        //      renderOrder={meme.renderOrder}
              alreadyRendered={
                this.state.memesHTML!==undefined
                  ? meme.alreadyRendered
                  : false
              }
              handleToProfile={this.handleToProfile}
              handleRefresh={this.handleRefresh}
              interface={this.props.interface}
              memeStorage={this.props.memeStorage}
              userAccount={this.props.account}
            />
          )
        }
        tempMemes[i-1].alreadyRendered = true
        //tempMemes[i-1].renderOrder = 0
      }
    }
    this.setState({
      memesHTML: tempMemesHTML,
      memes: tempMemes
    })
    // memesHTML to function that marks rendered memes as 'alreadyRendered', sends to oldMemesHTML
    await this.compileRenderedMemes(memesRendered)
  }
  async compileRenderedMemes(memesRendered) {
    const tempMemesHTML = [],
          memes = this.state.memes,
        //  memesToRender = this.state.memesToRender,
          totalMemesRendered = this.state.memesRendered
    for(let i = 1; i <= totalMemesRendered+memesRendered; i++) {
      const meme = memes[i-1]
      if(meme.isVisible) {
        tempMemesHTML.unshift(
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
      //      renderOrder={meme.renderOrder}
            alreadyRendered={true}
            handleToProfile={this.handleToProfile}
            handleRefresh={this.handleRefresh}
            interface={this.props.interface}
            memeStorage={this.props.memeStorage}
            userAccount={this.props.account}
          />
        )
      }
    }
    this.setState({
      oldMemesHTML: tempMemesHTML,
    })
  }
  sortToStyle(style) {
    if(style==='time') {
      this.setState({
        memes: this.state.memes.sort((a,b)=> Date.parse(a.time)-Date.parse(b.time))
      })
    } else if(style=='boost') {
      this.setState({
        memes: this.state.memes.sort((a,b) => a.boosts - b.boosts)
      })
    }
  }
  render() {
    return(
      <div className="Profile">
        { this.state.profileLoading
          ? this.state.userMemeCount===null
            ? <div id="loader">
                <p>Loading...</p>
              </div>
            : this.state.loadingBottom
              ? <div id="loader-memes">
                  {this.state.oldMemesHTML}
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
