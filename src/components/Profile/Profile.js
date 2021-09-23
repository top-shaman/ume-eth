import React from 'react'
import Meme from "../Meme/Meme"
import { fromBytes } from '../../resources/Libraries/Helpers'
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
      memeIds: [],
      oldMemes: [],
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
      refreshing: false,
      allMemesLoaded: false,
      firstLoad: true,
      sortStyle: 'time'
    }

    this.handleToProfile = this.handleToProfile.bind(this)
    this.handleToThread = this.handleToThread.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleOverMeme = this.handleOverMeme.bind(this)
    this.handleOverButton = this.handleOverButton.bind(this)
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
        if(!this.state.firstLoad && !this.state.loadingBottom) {
          await this.loadNewMemes()
          await this.refreshMemes()
        }
      }, 10000)
    }
    this.mounted = true
  }
  componentDidUpdate() {
    if(this.props.atBottom && !this.state.firstLoad && this.state.memesNotRendered!==0 && !this.state.loadingBottom) {
      setTimeout(async () => {
        if(this.props.atBottom && !this.state.firstLoad && this.state.memesNotRendered!==0 && !this.state.loadingBottom) {
          await this.loadOldMemes()
        }
      }, 200)
    }
  }
  async componentWillUnmount() {
    clearInterval(this.intervalProfile)
    this.mounted = false
  }
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
  handleRefresh(e) {
    e.preventDefault()
    setTimeout(() => this.refreshMemes(), 1000)
  }
  handleReply(e) {
    this.props.handleReply(e)
  }
  handleOverMeme(e) {
  }
  handleOverButton(e) {
  }

  async loadProfile() {
    console.log('profile: Try Load Profile')
    if(this.state.firstLoad) {
      this.setState({ profileLoading: true })
      console.log('load profile ' + new Date().toTimeString())

      let memeIds

      // compile memes
      if(this.state.sortStyle==='time') {
        memeIds = await this.compileMemesByTime()
      } else if(this.state.sortStyle==='boost') {
        memeIds = await this.compileMemesByBoost()
      }

      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            userMemeCount = await memeIds.length,
            newMemes = []
      let memesToRender = await this.state.memesToRender,
          memesNotRendered = userMemeCount - memesToRender,
          memesRendered = 0,
          memesInQueue = 0

      // determine memes to queue
      if(userMemeCount>memesToRender) {
        memesNotRendered = userMemeCount - memesToRender
      } else if(userMemeCount<=memesToRender) {
        memesToRender = userMemeCount
        memesNotRendered = 0
      }

      if(this.state.firstLoad) {
        this.setState({
          userMemeCount,
          memesNotRendered,
          memeIds
        })
        // compile & populate queued Memes
        for(let i = 0; i < memesToRender; i++) {
          const memeId = memeIds[memesNotRendered + i],
                meme = await this.populateMeme(memeId, memeStorage, userStorage)
          newMemes.push(meme)
          memesInQueue++
        }
        this.setState({
          memes: newMemes,
          memesHTML: this.state.oldMemesHTML
        })
        await this.renderProfile(memesInQueue).catch(e => console.error(e))
        memesRendered += memesInQueue
        //console.log('first load: ' + this.state.firstLoad)
        this.setState({
          memesNotRendered,
          memesRendered,
          profileLoading: false,
          firstLoad: false
        })
        if(memesNotRendered===0) {
          this.setState({ allMemesLoaded: true })
        }
        //console.log('total memes: ' + userMemeCount)
        //console.log('memes rendered: ' + memesRendered)
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
    console.log('timeline: Try Loading New Memes')
    if(!this.state.firstLoad && !this.state.loadingBottom && !this.state.refreshing) {
      console.log('loading new memes' + new Date().toTimeString())
      // compile all memes, including new memes
      const memeIds = await this.compileMemesByTime(),
            userMemeCount = await memeIds.length,
            countDifference =  await userMemeCount - this.state.memeCount
      // see if there are any new memes, i.e. if countDifference greater than 0
      if(countDifference>0) {
        //begin loading if conditional met
        this.setState({ timelineLoading: true })
        const userStorage = await this.props.userStorage,
              memeStorage = await this.props.memeStorage
        let memesNotRendered = await this.state.memesNotRendered,
            memesRendered = await this.state.memesRendered,
            memesInQueue = 0,
            newMemes = []

        // add new memes to total of memes not yet rendered
        memesNotRendered += countDifference
        this.setState({
          userMemeCount,
          memeIds
        })
        // populate new memes
        for(let i = 0; i < countDifference; i++) {
          const memeId = memeIds[userMemeCount - countDifference + i]
          //console.log('meme Id: ' + memeId)
          const meme = await this.populateMeme(memeId, memeStorage, userStorage)
          newMemes.push(meme)
          memesInQueue++
        }
        // update state with new memes & replace current memesHTML with old memesHTML, while new HTML loads
        this.setState({ memes: this.state.memes.concat(newMemes) })
        if(this.state.sortStyle!=='time') this.sortToStyle(this.state.sortStyle)

        this.setState({
          memesHTML: this.state.oldMemesHTML
        })
        // render new HTML
        await this.renderProfile(memesInQueue).catch(e => console.error(e))
        // update queue values
        memesRendered += memesInQueue
        memesNotRendered -= memesInQueue
        //delay so animation can come in before refresh triggers
        setTimeout(() => {
          this.setState({
            memeIds: memeIds,
            memesNotRendered,
            memesRendered,
            timelineLoading: false
          })
        }, 200)
        //console.log('total memes: ' + userMemeCount)
        //console.log('memes rendered: ' + memesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)
        await this.props.handleLoading(this.state.timelineLoading)
      }
      else {
        this.setState({
          timelineLoading: false,
        })
      }
    }
  }
  // loads old memes below timeline section
  async loadOldMemes() {
    console.log('timeline: Try Load Old Memes')
    if(!this.state.firstLoad && this.props.atBottom && !this.state.loadingBottom && !this.state.refreshing) {
      this.setState({ loadingBottom: true })
      console.log('load old memes ' + new Date().toTimeString())
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            memeIds = await this.state.memeIds,
            userMemeCount = await memeIds.length,
            newMemes = []
      let memesToRender = await this.state.memesToRender,
          memesNotRendered = await this.state.memesNotRendered,
          memesRendered = await this.state.memesRendered,
          memesInQueue = 0

      // set memes to render to safe value
      if(memesNotRendered-memesToRender <= 0) {
        memesToRender = memesNotRendered
      }
      //console.log('memes rendered: ' + memesRendered)
      //console.log('old memes to render: ' + memesToRender)
      //console.log('old memes not yet rendered: ' + memesNotRendered)

      if(memesToRender!==0) {
        this.setState({
          timelineLoading: true,
          userMemeCount
        })
        for(let i = 0; i < memesToRender; i++) {
          const memeId = memeIds[memesNotRendered-memesToRender + i],

                meme = await this.populateMeme(memeId, memeStorage, userStorage)
          newMemes.push(meme)
          memesInQueue++
        }

        this.setState({ memes: newMemes.concat(this.state.memes) })
        if(this.state.sortStyle!=='time') this.sortToStyle(this.state.sortStyle)

        // sorting functionality
        this.setState({
          memesHTML: this.state.oldMemesHTML
        })
        await this.renderProfile(memesInQueue).catch(e => console.error(e))
        memesRendered += memesInQueue
        memesNotRendered -= memesInQueue
        this.setState({
          memesNotRendered,
          memesRendered,
          timelineLoading: false,
          loadingBottom: false
        })
        if(memesNotRendered===0) {
          this.setState({ allMemesLoaded: true })
        }
        //console.log('total memes: ' + userMemeCount)
        //console.log('memes rendered: ' + memesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)
        await this.props.handleLoading(this.state.timelineLoading)
      }
      else {
        this.setState({
          timelineLoading: false,
          loadingBottom: false
        })
      }
    }
  }
  async refreshMemes() {
    if(!this.state.profileLoading && !this.state.loadingBottom&& !this.state.refreshing) {
    console.log('refreshing memes ' + new Date().toTimeString())
      this.setState({
        profileLoading: true,
        refreshing: true
      })
      let loadedMemes = this.state.memes
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
          e.userHasLiked = e.likers.includes(this.props.account)
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
      this.setState({
        profileLoading: false,
        refreshing: false
      })
    }
  }

  // helper functions
  async populateMeme(memeId, memeStorage, userStorage) {
    const tempMeme = await memeStorage.methods.memes(memeId).call()
    const username = await userStorage.methods.users(tempMeme.author).call()
        .then(e => fromBytes(e.name))
        .then(e => e.toString())
    const address = await userStorage.methods.users(tempMeme.author).call()
        .then(e => fromBytes(e.userAddr))
        .then(e => e.toString())
    const likers = await memeStorage.methods.getLikers(memeId).call()
    return {
      memeId: await memeId,
      username: await username,
      address: await address,
      text: await tempMeme.text,
      time: new Date(tempMeme.time * 1000).toLocaleString(),
      boosts: await tempMeme.boosts,
      likes: await memeStorage.methods.getLikeCount(memeId).call(),
      likers: likers,
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
      alreadyRendered: false,
      userHasLiked: await likers.includes(this.props.account)
    }
  }

  async renderProfile(memesRendered) {
    const tempMemesHTML = [],
          tempMemes = this.state.memes,
      //    memesToRender = this.state.memesToRender,
          totalMemesRendered = this.state.memesRendered,
          userMemeCount = this.state.userMemeCount
    if(userMemeCount>0) {
      let meme
      for(let i = 0; i < totalMemesRendered+memesRendered; i++) {
        meme = tempMemes[i]
        //add Meme component to temporary array
        if(meme.isVisible) {
          tempMemesHTML.unshift(
            <Meme
              key={i+1}
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
              handleReply={this.handleReply}
              handleOverMeme={this.handleOverMeme}
              handleOverButton={this.handleOverButton}
              handleToThread={this.handleToThread}
              interface={this.props.interface}
              memeStorage={this.props.memeStorage}
              userAccount={this.props.account}
              userHasLiked={meme.userHasLiked}
            />
          )
        }
        tempMemes[i].alreadyRendered = true
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
    for(let i = 0; i < totalMemesRendered+memesRendered; i++) {
      const meme = memes[i]
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
            handleReply={this.handleReply}
            handleOverMeme={this.handleOverMeme}
            handleOverButton={this.handleOverButton}
            handleToThread={this.handleToThread}
            interface={this.props.interface}
            memeStorage={this.props.memeStorage}
            userAccount={this.props.account}
          />
        )
      }
    }
    this.setState({
      oldMemesHTML: tempMemesHTML
    })
  }

  async compileMemesByTime() {
    const memeIds = [...await this.state.userStorage.methods.getPosts(this.state.profileAccount).call()]
    return memeIds
  }
  async compileMemesByBoost() {
    const boostMap = [],
          memeIds = [...await this.state.userStorage.methods.getPosts(this.state.profileAccount).call()]
    for(let i = 0; i < memeIds.length; i++) {
      boostMap.push([await this.state.memeStorage.methods.getBoost(memeIds[i]).call(), memeIds[i]])
    }
    boostMap.sort((a,b) => parseInt(a[0]) - parseInt(b[0]))
    const memeIdsByBoost = []
    boostMap.forEach(e => memeIdsByBoost.push(e[1]))

    this.setState({
      memeIdsByBoost
    })
    return memeIdsByBoost
  }
  sortToStyle(style) {
    if(style==='time') {
      this.setState({
        memes: this.state.memes.sort((a,b)=> Date.parse(a.time)-Date.parse(b.time))
      })
    } else if(style==='boost') {
      this.setState({
        memes: this.state.memes.sort((a,b) => a.boosts - b.boosts)
      })
    }
  }
  render() {
    return(
      <div className="Profile">
        { this.state.profileLoading
          ? this.state.userMemeCount===null && !this.state.refreshing
            ? <div id="loader">
                <p id="loader">Loading...</p>
              </div>
            : this.state.loadingBottom
              ? <div id="loader-memes">
                  {this.state.oldMemesHTML}
                  <p id="loader">Loading...<br/></p>
                </div>
              : <div id="loader-memes">
                  <p id="loader">Loading...</p>
                  {this.state.oldMemesHTML}
                </div>
          : this.state.userMemeCount> 0
            ? this.state.allMemesLoaded
              ? <div id="loaded">
                  {this.state.memesHTML}
                  <p id="loader">All memes loaded!<br/></p>
                </div>
              : <div id="loaded">
                  {this.state.memesHTML}
                </div>
            : <div id="loaded">
                <p id="loader">No memes yet!</p>
              </div>
        }
      </div>
    );
  }
}

export default Profile
