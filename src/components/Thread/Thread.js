import React from 'react'
import ParentMeme from '../ThreadMeme/ParentMeme'
import ChildMeme from '../ThreadMeme/ChildMeme'
import ThreadMemeMain from '../ThreadMeme/ThreadMemeMain'
import Loader from '../Loader/Loader'
import { fromBytes } from '../../resources/Libraries/Helpers'
import "./Thread.css"


class Thread extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ume: null,
      memes: [],
      memesHTML: [],
      memeId: this.props.memeId,
      /*
      memeUsername: this.props.memeUsername,
      memeAddress: this.props.memeAddress,
      text: this.props.text,
      time: this.props.time,
      likes: this.props.likes,
      likers: this.props.likers,
      responses: this.props.responses,
      rememeCount: this.props.rememeCount,
      rememes: this.props.rememes,
      quoteCount: this.props.quoteCount,
      quoteMemes: this.props.quoteMemes,
      repostId: this.props.repostId,
      parentId: this.props.parentId,
      chainParentId: this.props.chainParentId,
      originId: this.props.originId,
      author: this.props.author,
      isVisible: this.props.isVisible,
      visibleText: this.props.visibleText,
      userHasLiked: this.props.userHasLiked,
      */
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userAccount: this.props.account,
      focusPage: 'thread',
      replyCount: null,
      parentCount: null,
      repliesToRender: 50,
      repliesNotRendered: null,
      repliesRendered: null,
      parentsToRender: 50,
      parentsNotRendered: null,
      parentsRendered: null,
      loading: false,
      refreshing: false,
      contractLoading: this.props.contractLoading,
      loadingBottom: false,
      allMemesLoaded: false,
      firstLoad: true,
      sortStyle: 'boost'
    }

    this.handleToProfile = this.handleToProfile.bind(this)
    this.handleToThread = this.handleToThread.bind(this)

    this.handleLoading = this.handleLoading.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)

    this.handleReply = this.handleReply.bind(this)
    this.handleLike = this.handleLike.bind(this)
    this.handleOverMeme = this.handleOverMeme.bind(this)
    this.handleOverButton = this.handleOverButton.bind(this)


    this.handleOverReply = this.handleOverReply.bind(this)
    this.handleOverLike = this.handleOverLike.bind(this)
    this.handleOverRememe = this.handleOverRememe.bind(this)
    this.handleOverUpvote = this.handleOverUpvote.bind(this)
    this.handleOverDownvote = this.handleOverDownvote.bind(this)

    this.handleUpvotePopup = this.handleUpvotePopup.bind(this)
    this.handleDownvotePopup = this.handleDownvotePopup.bind(this)
  }
  async componentDidMount() {
    clearInterval(this.intervalThread)
    if(this.state.firstLoad) {
      await this.loadThread()
      this.intervalThread = setInterval(async () => {
        //this.setState({ firstLoad: false })
        if(!this.state.firstLoad && !this.state.loadingBottom){
          //await this.loadNewMemes()
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
          //await this.loadOldMemes()
        }
      }, 200)
    }
  }
  componentWillUnmount() {
    clearInterval(this.intervalThread)
    this.props.handleLoading(false)
    this.mounted = false
  }
  handleToProfile(e) {
    console.log(e)
    if(!this.state.loading) {
      this.props.handleToProfile(e)
    }
  }
  handleToThread(e) {
    if(!this.state.loading) {
      this.props.handleToThread(e)
    }
  }
  handleRefresh(e) {
    this.props.handleRefresh(e)
  }

  handleReply(e) {
    console.log(e)
    this.props.handleReply(e)
  }
  handleLike(e) {

  }
  handleOverMeme(e) {
  }
  handleOverButton(e) {
  }
  handleLoading(e) {
    this.props.handleLoading(e)
  }
  handleOverReply(e) {
    console.log(e)
  }
  handleOverLike(e) {
  }
  handleOverRememe(e) {
  }
  handleOverUpvote(e) {
  }
  handleOverDownvote(e) {
  }
  handleUpvotePopup(e) {
    this.props.handleUpvotePopup(e)
  }
  handleDownvotePopup(e) {
    this.props.handleDownvotePopup(e)
  }

  // to be invoked upon page load
  async loadThread() {
    console.log('thread: Try Load Thread')
    if(this.state.firstLoad) {
      this.setState({ loading: true })
      await this.props.handleLoading(this.state.loading)
      console.log('load thread ' + new Date().toTimeString())

      // compile all meme id's
      let parentIds = await this.compileParents(),
          replyIds = await this.compileRepliesByBoost()
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            parentCount = parentIds.length,
            replyCount = replyIds.length,
            parents = [],
            replies = []
      let parentsToRender = this.state.parentsToRender,
          parentsNotRendered = parentCount - parentsToRender,
          parentsRendered = 0,
          parentsInQueue = 0,
          repliesToRender = this.state.repliesToRender,
          repliesNotRendered = replyCount - repliesToRender,
          repliesRendered = 0,
          repliesInQueue = 0

      // compile info to be used in component
      this.setState({
        parentId: await memeStorage.methods.getParentId(this.state.memeId).call(),
        responses: await memeStorage.methods.getResponses(this.state.memeId).call()
      })
      // set queue data to safe values
      if(replyCount>repliesToRender) {
        repliesNotRendered = replyCount - repliesToRender
      } else if(replyCount<=repliesToRender) {
        repliesToRender = replyCount
        repliesNotRendered = 0
      }
      if(parentCount>parentsToRender) {
        parentsNotRendered = parentCount - parentsToRender
      } else if(parentCount<=parentsToRender) {
        parentsToRender = parentCount
        parentsNotRendered = 0
      }
      if(this.state.firstLoad) {
        this.setState({
          parentCount,
          replyCount,
          //repliesNotRendered,
          parentIds,
          replyIds
        })
        // compile parents
        for(let i = 0; i < parentsToRender; i++) {
          const parentId = parentIds[parentsNotRendered + i],
                meme = await this.populateMeme(parentId, memeStorage, userStorage)
          parents.push(meme)
          parentsInQueue++
        }
        // compile replies
        for(let i = 0; i < repliesToRender; i++) {
          const replyId = replyIds[repliesNotRendered + i],
                meme = await this.populateMeme(replyId, memeStorage, userStorage)
          replies.push(meme)
          repliesInQueue++
        }
        const meme = await this.populateMeme(this.state.memeId, memeStorage, userStorage)

        //set new memes to state, sort to current sort style
        this.setState({
          parents,
          meme,
          replies
        })

        //console.log('parents ' + parents)
        //console.log('meme ' + meme)
        //console.log('replies ' + replies)

        await this.renderParents(parentsRendered, parentsInQueue, parentCount).catch(e => console.error(e))
        await this.renderMeme(meme).catch(e => console.error(e))
        await this.renderReplies(repliesRendered, repliesInQueue, replyCount).catch(e => console.error(e))

        //console.log('parentsHTML:')
        //console.log(this.state.parentsHTML)
        //console.log('memeHTML:')
        //console.log(this.state.memeHTML)
        //console.log('repliesHTML:')
        //console.log(this.state.repliesHTML)

        repliesRendered += repliesInQueue
        parentsRendered += parentsInQueue
        //console.log('first load: ' + this.state.firstLoad)
        this.setState({
          repliesNotRendered,
          parentsNotRendered,
          repliesRendered,
          parentsRendered,
          loading: false,
          firstLoad: false
        })
        if(repliesNotRendered===0) {
          this.setState({ allMemesLoaded: true })
        }
        //console.log('total memes: ' + memeCount)
        //console.log('memes rendered: ' + memesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)
        await this.props.handleLoading(this.state.loading)
      }
    }
    else {
      this.setState({
        loading: false
      })
      await this.props.handleLoading(this.state.loading)
    }
  }

  async refreshMemes() {
    console.log('thread: Try Refresh Memes')
    if(!this.state.loading && !this.state.loadingBottom && !this.state.refreshing) {
    console.log('refreshing memes ' + new Date().toTimeString())
      this.setState({
        refreshing: true
      })
      await this.props.handleRefresh(this.state.refreshing)

      const parents = await this.updateMemes(this.state.parents),
            meme = await this.updateMeme(),
            replies = await this.updateMemes(this.state.replies)

      await this.renderParents(parents.length, 0, parents.length).catch(e => console.error(e))
      await this.renderMeme(meme).catch(e => console.error(e))
      await this.renderReplies(replies.length, 0, replies.length).catch(e => console.error(e))
    }
    this.setState({
      refreshing: false
    })
    await this.props.handleRefresh(this.state.refreshing)
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
      userHasLiked: await likers.includes(this.state.userAccount),
    }
  }

  async renderParents(memesRendered, memesInQueue, memeCount) {
    const tempMemesHTML = [],
          tempMemes = this.state.parents
      //    memesToRender = this.state.memesToRender,
          //memesRendered = this.state.memesRendered,
          //memeCount = this.state.memeCount
    if(memeCount>0) {
      for(let i = 0; i < memesRendered+memesInQueue; i++) {
        const meme = tempMemes[i]
        //add Meme component to temporary array
        if(meme.isVisible) {
          tempMemesHTML.unshift(
            <ParentMeme
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
              chainParentId={meme.chainParentId}
              originId={meme.originId}
              author={meme.author}
              isVisible={meme.isVisible}
              isMain={false}
              handleToProfile={this.handleToProfile}
              handleToThread={this.handleToThread}
              handleRefresh={this.handleRefresh}
              handleReply={this.handleReply}
              handleLike={this.handleLike}
              handleOverMeme={this.handleOverMeme}
              handleOverButton={this.handleOverButton}
              handleOverReply={this.handleOverReply}
              handleOverLike={this.handleOverLike}
              handleOverRememe={this.handleOverRememe}
              handleOverUpvote={this.handleOverUpvote}
              handleOverDownvote={this.handleOverDownvote}
              handleUpvotePopup={this.handleUpvotePopup}
              handleDownvotePopup={this.handleDownvotePopup}
              interface={this.props.interface}
              memeStorage={this.props.memeStorage}
              userStorage={this.props.userStorage}
              userAccount={this.state.userAccount}
              userHasLiked={meme.userHasLiked}
              firstParent={i===memesRendered+memesInQueue-1}
            />
          )
        }
        //tempMemes[i-1].renderOrder = 0
      }
    }
    this.setState({
      parentsHTML: tempMemesHTML,
      parents: tempMemes
    })
    // memesHTML to function that marks rendered memes as 'alreadyRendered', sends to oldMemesHTML
    //await this.compileRenderedParents(memesRendered, memesInQueue)
  }

  async renderReplies(memesRendered, memesInQueue, memeCount) {
    const tempMemesHTML = [],
          tempMemes = this.state.replies
      //    memesToRender = this.state.memesToRender,
          //memesRendered = this.state.memesRendered,
          //memeCount = this.state.memeCount
    if(memeCount>0) {
      for(let i = 0; i < memesRendered+memesInQueue; i++) {
        const meme = tempMemes[i]
        //add Meme component to temporary array
        if(meme.isVisible) {
          tempMemesHTML.unshift(
            <ChildMeme
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
              isMain={false}
              handleToProfile={this.handleToProfile}
              handleToThread={this.handleToThread}
              handleLoading={this.handleLoading}
              handleRefresh={this.handleRefresh}
              handleReply={this.handleReply}
              handleLike={this.handleLike}
              handleOverMeme={this.handleOverMeme}
              handleOverButton={this.handleOverButton}
              handleOverReply={this.handleOverReply}
              handleOverLike={this.handleOverLike}
              handleOverRememe={this.handleOverRememe}
              handleOverUpvote={this.handleOverUpvote}
              handleOverDownvote={this.handleOverDownvote}
              handleUpvotePopup={this.handleUpvotePopup}
              handleDownvotePopup={this.handleDownvotePopup}
              interface={this.props.interface}
              memeStorage={this.props.memeStorage}
              userStorage={this.props.userStorage}
              userAccount={this.state.userAccount}
              userHasLiked={meme.userHasLiked}
              firstChild={i===memesRendered+memesInQueue-1}
              lastChild={i===0}
              finalChild={i===0}
            />
          )
        }
      }
    }
    this.setState({
      repliesHTML: tempMemesHTML,
      replies: tempMemes
    })
  }

  async renderMeme(meme) {
    let tempMeme = meme,
        tempMemeHTML
    if(meme.isVisible) {
      tempMemeHTML =
        <ThreadMemeMain
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
          chainParentId={meme.chainParentId}
          originId={meme.originId}
          author={meme.author}
          isVisible={meme.isVisible}
          isMain={true}
          handleToProfile={this.handleToProfile}
          handleToThread={this.handleToThread}
          handleRefresh={this.handleRefresh}
          handleReply={this.handleReply}
          handleLike={this.handleLike}
          handleOverMeme={this.handleOverMeme}
          handleOverButton={this.handleOverButton}
          handleOverReply={this.handleOverReply}
          handleOverLike={this.handleOverLike}
          handleOverRememe={this.handleOverRememe}
          handleOverUpvote={this.handleOverUpvote}
          handleOverDownvote={this.handleOverDownvote}
          handleUpvotePopup={this.handleUpvotePopup}
          handleDownvotePopup={this.handleDownvotePopup}
          interface={this.props.interface}
          memeStorage={this.props.memeStorage}
          userStorage={this.props.userStorage}
          userAccount={this.state.userAccount}
          userHasLiked={meme.userHasLiked}
        />
    }
    this.setState({
      memeHTML: tempMemeHTML,
      meme: tempMeme
    })
  }

  async compileParents() {
    let parents = [],
        //starting values for parentId
        currentId = this.state.memeId,
        parentId = await this.state.memeStorage.methods.getParentId(currentId).call(),
        parentParentId = await this.state.memeStorage.methods.getParentId(parentId).call()

    while(currentId!==parentParentId) {
      parents = [...parents, await parentId]

      currentId = parentId
      parentId = parentParentId
      parentParentId = await this.state.memeStorage.methods.getParentId(parentId).call()
    }
    return parents
  }
  async updateMemes(loadedMemes) {
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
        e.userHasLiked = e.likers.includes(this.state.userAccount)
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
    })
    return loadedMemes
  }
  async updateMeme() {
    const loadedMeme = this.state.meme
    const newResponses = await this.props.memeStorage.methods.getResponses(loadedMeme.memeId).call()
    const newLikers = await this.props.memeStorage.methods.getLikers(loadedMeme.memeId).call()
    const newRememes = await this.props.memeStorage.methods.getReposts(loadedMeme.memeId).call()
    const newQuoteMemes = await this.props.memeStorage.methods.getQuotePosts(loadedMeme.memeId).call()
    const newBoosts = await this.props.memeStorage.methods.getBoost(loadedMeme.memeId).call()
    if(loadedMeme.responses.length!==newResponses.length) {
      loadedMeme.responses = newResponses
    }
    if(loadedMeme.likes!==newLikers.length) {
      loadedMeme.likes = newLikers.length
      loadedMeme.likers = newLikers
      loadedMeme.userHasLiked = loadedMeme.likers.includes(this.state.userAccount)
    }
    if(loadedMeme.rememeCount!==newRememes.length){
      loadedMeme.rememeCount = newRememes.length
      loadedMeme.rememes = newRememes
    }
    if(loadedMeme.quoteCount!==newQuoteMemes.length){
      loadedMeme.quoteCount = newQuoteMemes.length
      loadedMeme.quoteMemes = newQuoteMemes
    }
    if(loadedMeme.boosts!==newBoosts) {
      loadedMeme.boosts = newBoosts
    }
    return loadedMeme
  }

  async compileRepliesByTime() {
    const memeIds = [...await this.state.memeStorage.methods.getResponses(this.state.memeId).call()]
    return memeIds
  }
  async compileRepliesByBoost() {
    const boostMap = [],
          memeIds = [...await this.state.memeStorage.methods.getResponses(this.state.memeId).call()]
    for(let i = 0; i < memeIds.length; i++) {
      const meme = await this.state.memeStorage.methods.memes(memeIds[i]).call()
      boostMap.push([meme.boosts, memeIds[i], meme.time])
    }
    boostMap.sort((a,b) => parseInt(a[0]) - parseInt(b[0]))

    const memeIdsByBoost = []
    boostMap.forEach(e => memeIdsByBoost.push(e[1]))

    //console.log(boostMap)
    return memeIdsByBoost
  }
  sortToStyle(style) {
    if(style==='time') {
      this.setState({
        memes: this.state.memes.sort((a,b)=> Date.parse(a.time)-Date.parse(b.time))
      })
    } else if(style==='boost') {
      this.setState({
        memes: this.state.memes.sort((a,b) =>
          a.boosts - b.boosts)
      })
    }
  }
  sortRepliesToStyle(style) {
    if(style==='time') {
      this.setState({
        replies: this.state.replies.sort((a,b)=> Date.parse(a.time)-Date.parse(b.time))
      })
    } else if(style==='boost') {
      this.setState({
        memes: this.state.replies.sort((a,b) =>
          a.boosts - b.boosts)
      })
    }
  }


  render() {
    return(
      <div className="Thread">
        { this.state.loading && !this.state.refreshing
          ? (this.state.replyCount===null || this.state.parentCount===null) && !this.state.refreshing
            ? <div id="loader">
                <Loader />
              </div>
            : this.state.loadingBottom
              ? <div id="loader">
                  {this.state.parentsHTML}
                  {this.state.memeHTML}
                  {this.state.repliesHTML}
                  <Loader />
                </div>
              : <div id="loader">
                  <Loader />
                  {this.state.parentsHTML}
                  {this.state.memeHTML}
                  {this.state.repliesHTML}
                </div>
          : this.state.replyCount>0 || this.state.parentCount>0 || this.state.meme
            ? this.state.allMemesLoaded
              ? <div id="loaded">
                  {this.state.parentsHTML}
                  {this.state.memeHTML}
                  {this.state.repliesHTML}
                </div>
              : <div id="loaded">
                  {this.state.parentsHTML}
                  {this.state.memeHTML}
                  {this.state.repliesHTML}
                </div>
            : <div id="loaded">
                <p id="loader">No memes yet!</p>
              </div>
        }
      </div>
    );
  }
}

export default Thread
