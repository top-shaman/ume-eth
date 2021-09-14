import React from 'react'
import Meme from "../Meme/Meme"
import { toBytes, fromBytes } from '../../resources/Libraries/Helpers'
import "./Timeline.css"


class Timeline extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ume: null,
      memes: [],
      oldMemesHTML: [],
      memesHTML: [],
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.memeStorage,
      memeCount: null,
      memesToRender: 50,
      memesNotRendered: null,
      memesRendered: 0,
      timelineLoading: false,
      loadingBottom: false,
      // refreshing: false,
      firstLoad: true,
      sortStyle: 'boost'
    }

    this.handleToProfile = this.handleToProfile.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }
  async componentDidMount() {
    clearInterval(this.intervalTimeline)
    if(this.state.firstLoad) {
      await this.loadTimeline()
      this.intervalTimeline = setInterval(async () => {
        //this.setState({ firstLoad: false })
        if(!this.props.atBottom && !this.state.firstLoad && !this.state.loadingBottom){
          await this.loadNewMemes()
          await this.refreshMemes()
        }
        else if (this.props.atBottom && !this.state.firstLoad && this.state.memesNotRendered!==0 && !this.state.loadingBottm) {
          await this.loadOldMemes()
        }
      }, 10000)
    }
    this.mounted = true
  }
  componentWillUnmount() {
    clearInterval(this.intervalTimeline)
    this.mounted = false
  }
  handleToProfile(e) {
    if(!this.state.timelineLoading) {
      this.props.handleToProfile(e)
    }
  }
  handleRefresh(e) {
    e.preventDefault()
    console.log('CHECK')
    setTimeout(() => this.refreshMemes(), 2000)
  }

  // to be invoked upon page load
  async loadTimeline() {
    console.log('timeline: Try Load Timeline')
    if(!this.state.timelineLoading) {
      console.log('load timeline ' + new Date().toTimeString())
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            uInterface = await this.props.interface,
            memes = await this.state.memes,
            memeCount = await memeStorage.methods.memeCount().call()
      let memesToRender = await this.state.memesToRender,
          memesNotRendered = memeCount - memesToRender,
          totalMemesRendered = 0,
          memesRendered = 0

      if(memeCount>memesToRender) {
        memesNotRendered = memeCount - memesToRender
      } else if(memeCount<memesToRender) {
        memesToRender = memeCount
        memesNotRendered = 0
      }

      if(this.state.firstLoad) {
        this.setState({
          timelineLoading: true,
          memeCount,
          memesNotRendered
        })
        for(let i = 1; i <= memesToRender; i++) {
          const adjustment = memesNotRendered + i
          const memeId = await uInterface.methods
            .encode(adjustment).call().catch(e => console.error(e))
          const meme = await this.populateMeme(memeId, i, memeStorage, userStorage)
          this.setState({
            memes: [...this.state.memes, meme],
          })
          this.sortToStyle(this.state.sortStyle)
          memesRendered++
        }
        this.setState({ memesHTML: this.state.oldMemesHTML })
        await this.renderTimeline(memesRendered).catch(e => console.error(e))
        totalMemesRendered += memesRendered
        //console.log('first load: ' + this.state.firstLoad)
        this.setState({
          memesNotRendered,
          memesRendered: totalMemesRendered,
          timelineLoading: false,
          firstLoad: false
        })
        //console.log('total memes: ' + memeCount)
        //console.log('memes rendered: ' + totalMemesRendered)
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

  //loads new memes above rendered section
  async loadNewMemes() {
    console.log('timeline: Try Loading New Memes')
    if(!this.state.firstLoad && !this.state.loadingBottom && !this.props.atBottom) {
      console.log('loading new memes' + new Date().toTimeString())
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            uInterface = await this.props.interface,
            memes = await this.state.memes,
            memeCount = await memeStorage.methods.memeCount().call()
      let memesToRender = await this.state.memesToRender,
          memesNotRendered = await this.state.memesNotRendered,
          totalMemesRendered = await this.state.memesRendered,
          memesRendered = 0
      const countDifference = await memeCount - await this.state.memeCount
      memesNotRendered += countDifference
      if(countDifference>0) {
        memesToRender = countDifference
        this.setState({
          timelineLoading: true,
          memeCount
        })
        for(let i = 1; i <= countDifference; i++) {
          const adjustment = memeCount - countDifference + i
          const memeId = await uInterface.methods
            .encode(adjustment).call().catch(e => console.error(e))
          const meme = await this.populateMeme(memeId, i, memeStorage, userStorage)
          this.setState({
            memes: [...this.state.memes, meme],
          })
          this.sortToStyle(this.state.sortStyle)
          memesRendered++
        }
        // sorting functionality
        this.setState({ memesHTML: this.state.oldMemesHTML })
        await this.renderTimeline(memesRendered).catch(e => console.error(e))
        totalMemesRendered += memesRendered
        memesNotRendered -= memesRendered
        this.setState({
          memesNotRendered,
          memesRendered: totalMemesRendered,
          timelineLoading: false
        })
        //console.log('total memes: ' + memeCount)
        //console.log('memes rendered: ' + totalMemesRendered)
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
    if(!this.state.firstLoad && this.props.atBottom && this.state.loadingBottom && !this.state.refreshing) {
      console.log('load old memes ' + new Date().toTimeString())
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            uInterface = await this.props.interface,
            memes = await this.state.memes,
            memeCount = await this.state.memeCount
      let memesToRender = await this.state.memesToRender,
          memesNotRendered = await this.state.memesNotRendered,
          totalMemesRendered = await this.state.memesRendered,
          memesRendered = 0

      if(memesNotRendered-memesToRender <= 0) {
        memesToRender = memesNotRendered
      }

      if(memesToRender!==0) {
        this.setState({
          timelineLoading: true,
          loadingBottom: true,
          memeCount
        })
        for(let i = 1; i <= memesToRender; i++) {
          const adjustment = memesNotRendered - memesToRender + i
          const memeId = await uInterface.methods
            .encode(adjustment).call().catch(e => console.error(e))
          const meme = await this.populateMeme(memeId, i, memeStorage, userStorage)
          this.setState({
            memes: [...this.state.memes, meme],
          })
          this.sortToStyle(this.state.sortStyle)
          memesRendered++
        }
        // sorting functionality
        this.setState({ memesHTML: this.state.oldMemesHTML })
        await this.renderTimeline(memesRendered).catch(e => console.error(e))
        totalMemesRendered += memesRendered
        memesNotRendered -= memesRendered
        this.setState({
          memesNotRendered,
          memesRendered: totalMemesRendered,
          timelineLoading: false,
          loadingBottom: false
        })
        //console.log('total memes: ' + memeCount)
        //console.log('memes rendered: ' + totalMemesRendered)
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
    console.log('timeline: Try Refresh Memes')
    if(!this.state.timelineLoading) {
    console.log('refreshing memes ' + new Date().toTimeString())
      let loadedMemes = this.state.memes
      this.setState({
        timelineLoading: true,
        refreshing: true
      })

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
          e.likes = await this.props.memeStorage.methods.getLikeCount(e.memeId).call()
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
      await this.renderTimeline(0).catch(e => console.error(e))
      this.setState({
        timelineLoading: false,
        refreshing: false
      })
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

  async renderTimeline(memesRendered) {
    const tempMemesHTML = [],
          tempMemes = this.state.memes,
      //    memesToRender = this.state.memesToRender,
          totalMemesRendered = this.state.memesRendered,
          memeCount = this.state.memeCount
    if(memeCount!==null) {
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
      <div className="Timeline">
        { this.state.timelineLoading
          ? this.state.memeCount===null
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
          : this.state.memeCount> 0
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

export default Timeline
