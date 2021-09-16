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
      oldMemes: [],
      memeIdsByBoost: [],
      oldMemesHTML: [],
      memesHTML: [],
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.memeStorage,
      memeCount: null,
      memesToRender: 50,
      memesNotRendered: null,
      memesRendered: null,
      timelineLoading: true,
      contractLoading: this.props.contractLoading,
      loadingBottom: false,
      refreshing: false,
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
        if(!this.state.firstLoad && !this.state.loadingBottom){
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
    setTimeout(() => this.refreshMemes(), 1000)
  }

  // to be invoked upon page load
  async loadTimeline() {
    console.log('timeline: Try Load Timeline')
    if(this.state.firstLoad) {
      this.setState({ timelineLoading: true })
      console.log('load timeline ' + new Date().toTimeString())
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            uInterface = await this.props.interface,
            memeCount = await memeStorage.methods.memeCount().call()
      let memesToRender = await this.state.memesToRender,
          memesNotRendered = memeCount - memesToRender,
          totalMemesRendered = 0,
          memesRendered = 0,
          memeIds
      //await memeIds.forEach(async e => console.log(await memeStorage.methods.getBoost(e).call()))
      //console.log(memeIds)
      //this.state.memeIdsByBoost.forEach(async a => {
        //console.log(await memeStorage.methods.getText(a).call())
      //})
      if(this.state.sortStyle==='time') {
        memeIds = await this.compileMemesByTime()
      } else if(this.state.sortStyle==='boost') {
        memeIds = await this.compileMemesByBoost(memeCount)
      }

      if(memeCount>memesToRender) {
        memesNotRendered = memeCount - memesToRender
      } else if(memeCount<memesToRender) {
        memesToRender = memeCount
        memesNotRendered = 0
      }

      if(this.state.firstLoad) {
        this.setState({
          memeCount,
          memesNotRendered
        })
        for(let i = 0; i < memesToRender; i++) {
          const memeId = memeIds[i+memesNotRendered],
                meme = await this.populateMeme(memeId, memeStorage, userStorage)
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
    if(!this.state.firstLoad && !this.state.loadingBottom && !this.state.refreshing) {
      console.log('loading new memes' + new Date().toTimeString())
      const memeCount = await this.state.memeStorage.methods.memeCount().call(),
            countDifference =  await memeCount - this.state.memeCount,
            oldMemes = this.state.oldMemes

      if(countDifference>0) {
        this.setState({ timelineLoading: true })
        const userStorage = await this.props.userStorage,
              memeStorage = await this.props.memeStorage,
              uInterface = await this.props.interface
        let memesToRender = await this.state.memesToRender,
            memesNotRendered = await this.state.memesNotRendered,
            totalMemesRendered = await this.state.memesRendered,
            memesRendered = 0,
            oldMemeIds = [],
            newMemeIds = [],
            memeIds

        if(this.state.sortStyle==='time') {
          memeIds = await this.compileMemesByTime()
        } else if(this.state.sortStyle==='boost') {
          memeIds = await this.compileMemesByBoost(memeCount)
        }
        /*
        const oldMemeIds = []
        oldMemes.forEach(e => oldMemeIds.push(e.id))
        newMemeIds = oldMemeIds.filter(e => {
          return !memeIds.includes(e)
        })
        */
        for(let i = 0; i < oldMemes.length; i++) {
          oldMemeIds.push(oldMemes[i].memeId)
        }
        let index = memeIds.indexOf(oldMemeIds[0])
        if(index!==-1) {
          newMemeIds = memeIds.slice(index).filter(e =>
            !oldMemeIds.includes(e)
          )
        } else if(index===-1) {
          index = memeIds.indexOf(oldMemes[oldMemes.length-1].memeId)
          newMemeIds = memeIds.slice(index)
        }
        memesNotRendered += newMemeIds.length //countDifference
        this.setState({
          memeCount
        })
        for(let i = 0; i < newMemeIds.length; i++) {//countDifference; i++) {
          const memeId = newMemeIds[i]//memeCount - countDifference + i]
          console.log('meme Id: ' + memeId)
          const meme = await this.populateMeme(memeId, memeStorage, userStorage)
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
    if(!this.state.firstLoad && this.props.atBottom && !this.state.loadingBottom && !this.state.refreshing) {
      this.setState({ loadingBottom: true })
      console.log('load old memes ' + new Date().toTimeString())
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            uInterface = await this.props.interface,
            memeCount = await memeStorage.methods.memeCount().call()
      let memesToRender = await this.state.memesToRender,
          memesNotRendered = await this.state.memesNotRendered,
          totalMemesRendered = await this.state.memesRendered,
          memesRendered = 0,
          memeIds //= await memeStorage.methods.getEncodedIds().call()

      if(this.state.sortStyle==='time') {
        memeIds = await this.compileMemesByTime()
      } else if(this.state.sortStyle==='boost') {
        memeIds = await this.compileMemesByBoost(memeCount)
      }
      console.log(memeIds)

      if(memesNotRendered-memesToRender <= 0) {
        memesToRender = memesNotRendered
      }

      if(memesToRender!==0) {
        this.setState({
          timelineLoading: true,
          memeCount
        })
        for(let i = 0; i < memesToRender; i++) {
          let memeId = memeIds[memesNotRendered-memesToRender +i]

          const meme = await this.populateMeme(memeId, memeStorage, userStorage)
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
    if(!this.state.timelineLoading && !this.state.loadingBottom && !this.state.refreshing) {
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
      await this.renderTimeline(0).catch(e => console.error(e))
      this.setState({
        timelineLoading: false,
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
      likes: await likers.length,
      likers: await likers,
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

  async renderTimeline(memesRendered) {
    const tempMemesHTML = [],
          tempMemes = this.state.memes,
      //    memesToRender = this.state.memesToRender,
          totalMemesRendered = this.state.memesRendered,
          memeCount = this.state.memeCount
    if(memeCount>0) {
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
      memes: tempMemes,
      oldMemes: tempMemes
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
            userhasLiked={meme.userHasLiked}
          />
        )
      }
    }
    const alreadyRendered = tempMemesHTML.slice(0, totalMemesRendered)
    const newRender = tempMemesHTML.slice(totalMemesRendered)
    this.setState({
      oldMemesHTML: tempMemesHTML
    })
  }
  async compileMemesByTime() {
    const memeIds = [...await this.state.memeStorage.methods.getEncodedIds().call()]
    return memeIds
  }
  async compileMemesByBoost(memeCount) {
    const boostMap = [],
          memeIds = [...await this.state.memeStorage.methods.getEncodedIds().call()]
    for(let i = 0; i < memeCount; i++) {
      const meme = await this.state.memeStorage.methods.memes(memeIds[i]).call()
      boostMap.push([meme.boosts, memeIds[i], meme.time])
    }
    boostMap.sort((a,b) => parseInt(a[0]) - parseInt(b[0]))

    /*
    const boosts = [],
          noBoosts = []
    boostMap.forEach(e => {
      if(parseInt(e[0])>0) boosts.push(e[1])
    })
    boostMap.forEach(e => {
      if(parseInt(e[0])===0) noBoosts.push(e[1])
    })
    const noBoostsSorted = noBoosts.sort((a,b) => parseInt(a[2])-parseInt(b[2]))
    const memeIdsByBoost = noBoostsSorted.concat(boosts)
    /*const memeIdsByBoost = []
    boostMap.forEach(e => memeIdsByBoost.push(e[1]))
    */
    const memeIdsByBoost = []
    boostMap.forEach(e => memeIdsByBoost.push(e[1]))
/*
    this.setState({
      memeIdsByBoost
    })
    */
    //console.log(boostMap)
    return memeIdsByBoost
  }
  sortToStyle(style) {
    if(style==='time') {
      this.setState({
        memes: this.state.memes.sort((a,b)=> Date.parse(a.time)-Date.parse(b.time))
      })
      return
    } else if(style==='boost') {
      this.setState({
        memes: this.state.memes.sort((a,b) =>
          a.boosts - b.boosts)
      })
    }
  }

  render() {
    return(
      <div className="Timeline">
        { this.state.timelineLoading
          ? this.state.memeCount===null && !this.state.refreshing
            ? <div id="loader">
                <p>Loading...</p>
              </div>
            : this.state.loadingBottom
              ? <div id="loader-memes">
                  {this.state.oldMemesHTML}
                  <p>Loading...<br/></p>
                </div>
              : <div id="loader-memes">
                  <p>Loading...</p>
                  {this.state.oldMemesHTML}
                </div>
          : this.state.memeCount > 0
            ? this.state.memesNotRendered===0
              ? <div id="loaded">
                  {this.state.memesHTML}
                  <p>All memes loaded!<br/></p>
                </div>
              : <div id="loaded">
                  {this.state.memesHTML}
                </div>
            : <div id="loaded">
                <p>No memes yet!</p>
              </div>
        }
      </div>
    );
  }
}

export default Timeline
