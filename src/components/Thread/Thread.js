import React from 'react'
import ThreadMeme from '../ThreadMeme/ThreadMeme'
import ThreadMemeMain from '../ThreadMeme/ThreadMemeMain'
import { fromBytes } from '../../resources/Libraries/Helpers'
import "./Thread.css"


class Thread extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ume: null,
      memes: [],
      oldMemes: [],
      oldMemesHTML: [],
      memesHTML: [],
      memeId: this.props.memeId,
      memeUsername: this.props.memeUsername,
      memeAddress: this.props.memeAddress,
      text: this.props.text,
      time: this.props.time,
      responses: this.props.responses,
      likes: this.props.likes,
      likers: this.props.likers,
      rememeCount: this.props.rememeCount,
      rememes: this.props.rememes,
      quoteCount: this.props.quoteCount,
      quoteMemes: this.props.quoteMemes,
      repostId: this.props.repostId,
      parentId: this.props.parentId,
      originId: this.props.originId,
      author: this.props.author,
      isVisible: this.props.isVisible,
      visibleText: this.props.visibleText,
      userHasLiked: this.props.userHasLiked,
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
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
      threadLoading: false,
      contractLoading: this.props.contractLoading,
      loadingBottom: false,
      refreshing: false,
      allMemesLoaded: false,
      firstLoad: true,
      sortStyle: 'boost'
    }

    this.handleToProfile = this.handleToProfile.bind(this)
    this.handleToThread = this.handleToThread.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleOverMeme = this.handleOverMeme.bind(this)
    this.handleOverButton = this.handleOverButton.bind(this)
  }
  async componentDidMount() {
    clearInterval(this.intervalThread)
    if(this.state.firstLoad) {
      await this.loadThread()
      this.intervalThread = setInterval(async () => {
        //this.setState({ firstLoad: false })
        if(!this.state.firstLoad && !this.state.loadingBottom){
          //await this.loadNewMemes()
          //await this.refreshMemes()
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
    this.mounted = false
  }
  handleToProfile(e) {
    if(!this.state.threadLoading) {
      this.props.handleToProfile(e)
    }
  }
  handleToThread(e) {
    if(!this.state.threadLoading) {
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

  // to be invoked upon page load
  async loadThread() {
    console.log('thread: Try Load Thread')
    if(this.state.firstLoad) {
      this.setState({ threadLoading: true })
      console.log('load thread ' + new Date().toTimeString())

      // compile all meme id's
      let parentIds = await this.compileParents(),
          replyIds = this.state.responses
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
          repliesToRender = this.state.parentsToRender,
          repliesNotRendered = replyCount - repliesToRender,
          repliesRendered = 0,
          repliesInQueue = 0

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

        console.log('parents ' + parents)
        console.log('meme ' + meme)
        console.log('replies ' + replies)

        this.setState({
          parentsHTML: this.state.oldParentsHTML,
          repliesHTML: this.state.oldRepliesHTML
        })
        // render memes to HTML & store in oldMemesHTML for refresh
        await this.renderThread(parents, parentsRendered, parentsInQueue, parentCount).catch(e => console.error(e))
        await this.renderMeme().catch(e => console.error(e))
        await this.renderThread(replies, repliesRendered, repliesInQueue, replyCount).catch(e => console.error(e))

        console.log('parentsHTML ' + this.state.parentsHTML)
        console.log('memeHTML ' + this.state.memeHTML)
        console.log('repliesHTML ' + this.state.repliesHTML)

        this.setState({
          parentsHTML: this.state.oldParentsHTML,
          repliesHTML: this.state.oldRepliesHTML
        })
        // render memes to HTML & store in oldMemesHTML for refresh
        await this.renderThread(parents, parentsRendered, parentsInQueue, parentCount).catch(e => console.error(e))
        await this.renderMeme().catch(e => console.error(e))
        await this.renderThread(replies, repliesRendered, repliesInQueue, replyCount).catch(e => console.error(e))
        repliesRendered += repliesInQueue
        parentsRendered += parentsInQueue
        //console.log('first load: ' + this.state.firstLoad)
        this.setState({
          repliesNotRendered,
          parentsNotRendered,
          repliesRendered,
          parentsRendered,
          threadLoading: false,
          firstLoad: false
        })
        if(repliesNotRendered===0) {
          this.setState({ allMemesLoaded: true })
        }
        //console.log('total memes: ' + memeCount)
        //console.log('memes rendered: ' + memesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)
        await this.props.handleLoading(this.state.threadLoading)
      }
    }
    else {
      this.setState({
        threadLoading: false
      })
    }
  }

  // Thread by Time sort
/*
  //loads new memes above rendered section
  async loadNewMemes() {
    console.log('thread: Try Loading New Memes')
    if(!this.state.firstLoad && !this.state.loadingBottom && !this.state.refreshing) {
      console.log('loading new memes' + new Date().toTimeString())
      // compile all memes, including new memes
      const memeIds = await this.compileMemesByTime(),
            memeCount = await memeIds.length,
            countDifference =  await memeCount - this.state.memeCount
      // see if there are any new memes, i.e. if countDifference greater than 0
      if(countDifference>0) {
        //begin loading if conditional met
        this.setState({ threadLoading: true })
        const userStorage = await this.props.userStorage,
              memeStorage = await this.props.memeStorage,
              uInterface = await this.props.interface
        let memesToRender = await this.state.memesToRender,
            memesNotRendered = await this.state.memesNotRendered,
            memesRendered = await this.state.memesRendered,
            memesInQueue = 0,
            newMemes = []

        // add new memes to total of memes not yet rendered
        memesNotRendered += countDifference
        this.setState({
          memeCount,
          memeIds
        })
        // populate new memes
        for(let i = 0; i < countDifference; i++) {
          const memeId = memeIds[memeCount - countDifference + i]
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
        await this.renderThread(memesInQueue).catch(e => console.error(e))
        // update queue values
        memesRendered += memesInQueue
        memesNotRendered -= memesInQueue
        //delay so animation can come in before refresh triggers
        setTimeout(() => {
          this.setState({
            memeIds: memeIds,
            memesNotRendered,
            memesRendered,
            threadLoading: false
          })
        }, 200)
        //console.log('total memes: ' + memeCount)
        //console.log('memes rendered: ' + memesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)
        await this.props.handleLoading(this.state.threadLoading)
      }
      else {
        this.setState({
          threadLoading: false,
        })
      }
    }
  }
  // loads old memes below thread section
  async loadOldMemes() {
    console.log('thread: Try Load Old Memes')
    if(!this.state.firstLoad && this.props.atBottom && !this.state.loadingBottom && !this.state.refreshing) {
      this.setState({ loadingBottom: true })
      console.log('load old memes ' + new Date().toTimeString())
      const userStorage = await this.props.userStorage,
            memeStorage = await this.props.memeStorage,
            uInterface = await this.props.interface,
            memeIds = await this.state.memeIds,
            memeCount = await memeIds.length,
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
          threadLoading: true,
          memeCount
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
        await this.renderThread(memesInQueue).catch(e => console.error(e))
        memesRendered += memesInQueue
        memesNotRendered -= memesInQueue
        this.setState({
          memesNotRendered,
          memesRendered,
          threadLoading: false,
          loadingBottom: false
        })
        if(memesNotRendered===0) {
          this.setState({ allMemesLoaded: true })
        }
        //console.log('total memes: ' + memeCount)
        //console.log('memes rendered: ' + memesRendered)
        //console.log('memes not yet rendered: ' + memesNotRendered)
        await this.props.handleLoading(this.state.threadLoading)
      }
      else {
        this.setState({
          threadLoading: false,
          loadingBottom: false
        })
      }
    }
  }
  async refreshMemes() {
    console.log('thread: Try Refresh Memes')
    if(!this.state.threadLoading && !this.state.loadingBottom && !this.state.refreshing) {
    console.log('refreshing memes ' + new Date().toTimeString())
      let loadedMemes = this.state.memes
      this.setState({
        threadLoading: true,
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
      await this.renderThread(0).catch(e => console.error(e))
      this.setState({
        threadLoading: false,
        refreshing: false
      })
    }
  }
  */
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
      userHasLiked: await likers.includes(this.props.account),
    }
  }

  async renderThread(memes, memesRendered, memesInQueue, memeCount) {
    const tempMemesHTML = [],
          tempMemes = memes
      //    memesToRender = this.state.memesToRender,
          //memesRendered = this.state.memesRendered,
          //memeCount = this.state.memeCount
    if(memeCount>0) {
      let meme
      for(let i = 0; i < memesRendered+memesInQueue; i++) {
        meme = tempMemes[i]
        //add Meme component to temporary array
        if(meme.isVisible) {
          tempMemesHTML.unshift(
            <ThreadMeme
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
                this.state.replies===memes
                ? this.state.repliesHTML!==undefined
                  ? meme.alreadyRendered
                  : false
                : this.state.parents===memes
                  ? this.state.parentsHTML!==undefined
                    ? meme.alreadyRendered
                    : false
                  : false
              }
              handleToProfile={this.handleToProfile}
              handleToThread={this.handleToThread}
              handleRefresh={this.handleRefresh}
              handleReply={this.handleReply}
              handleOverMeme={this.handleOverMeme}
              handleOverButton={this.handleOverButton}
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
    if(memes===this.state.parents) {
      this.setState({
        parentsHTML: tempMemesHTML,
        parents: tempMemes
      })
    } else if(memes===this.state.replies) {
      this.setState({
        repliesHTML: tempMemesHTML,
        replies: tempMemes
      })
    }
    // memesHTML to function that marks rendered memes as 'alreadyRendered', sends to oldMemesHTML
    await this.compileRenderedMemes(tempMemes, memesRendered, memesInQueue)
  }
  async compileRenderedMemes(memes, memesRendered, memesInQueue) {
    const tempMemesHTML = [],
          tempMemes = memes
        //  memesToRender = this.state.memesToRender,
      //  memesRendered = this.state.memesRendered
    for(let i = 0; i < memesRendered+memesInQueue; i++) {
      const meme = tempMemes[i]
      if(meme.isVisible) {
        tempMemesHTML.unshift(
          <ThreadMeme
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
            handleToThread={this.handleToThread}
            handleRefresh={this.handleRefresh}
            handleReply={this.handleReply}
            handleOverMeme={this.handleOverMeme}
            handleOverButton={this.handleOverButton}
            interface={this.props.interface}
            memeStorage={this.props.memeStorage}
            userAccount={this.props.account}
            userhasLiked={meme.userHasLiked}
          />
        )
      }
    }
    if(memes===this.state.parents) {
      this.setState({
        oldParentsHTML: tempMemesHTML
      })
    } else if(memes===this.state.replies) {
      this.setState({
        oldRepliesHTML: tempMemesHTML
      })
    }
  }
  async renderMeme() {
    const meme = this.state.meme
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
          originId={meme.originId}
          author={meme.author}
          isVisible={meme.isVisible}
    //      renderOrder={meme.renderOrder}
          alreadyRendered={
            this.state.meme===meme
            ? this.state.memeHTML!==undefined
              ? meme.alreadyRendered
              : false
            : false
          }
          handleToProfile={this.handleToProfile}
          handleToThread={this.handleToThread}
          handleRefresh={this.handleRefresh}
          handleReply={this.handleReply}
          handleOverMeme={this.handleOverMeme}
          handleOverButton={this.handleOverButton}
          interface={this.props.interface}
          memeStorage={this.props.memeStorage}
          userAccount={this.props.account}
          userHasLiked={meme.userHasLiked}
        />
    }
    tempMeme.alreadyRendered = true
    this.setState({
      memeHTML: tempMemeHTML,
      meme: tempMeme
    })
    // memesHTML to function that marks rendered memes as 'alreadyRendered', sends to oldMemesHTML
    await this.compileRenderedMeme()
  }
  async compileRenderedMeme() {
    let tempMemeHTML
    const meme = this.state.meme
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
          handleToThread={this.handleToThread}
          handleRefresh={this.handleRefresh}
          handleReply={this.handleReply}
          handleOverMeme={this.handleOverMeme}
          handleOverButton={this.handleOverButton}
          interface={this.props.interface}
          memeStorage={this.props.memeStorage}
          userAccount={this.props.account}
          userhasLiked={meme.userHasLiked}
        />
    }
  /*
    const alreadyRendered = tempMemesHTML.slice(0, memesRendered)
    const newRender = tempMemesHTML.slice(memesRendered)
    */
    this.setState({
      oldMemeHTML: tempMemeHTML
    })
  }
  async compileParents() {
    let parents = [],
        //starting values for parentId
        currentId = this.state.memeId,
        parentId = this.state.parentId,
        parentParentId = await this.state.memeStorage.methods.getParentId(parentId).call()
    console.log('parent: ' + parentId)
    console.log('parent\'s parent: ' + parentParentId)

    while(currentId!==parentParentId) {
      parents = [...parents, await parentId]

      currentId = parentId
      parentId = parentParentId
      parentParentId = await this.state.memeStorage.methods.getParentId(parentId).call()
    }
    console.log(parents)
    return parents
  }

  async compileMemesByTime() {
    const memeIds = [...await this.state.memeStorage.methods.getEncodedIds().call()]
    return memeIds
  }
  async compileMemesByBoost() {
    const boostMap = [],
          memeIds = [...await this.state.memeStorage.methods.getEncodedIds().call()]
    for(let i = 0; i < memeIds.length; i++) {
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
    } else if(style==='boost') {
      this.setState({
        memes: this.state.memes.sort((a,b) =>
          a.boosts - b.boosts)
      })
    }
  }

  render() {
    return(
      <div className="Thread">
        { this.state.threadLoading
          ? (this.state.replyCount===null || this.state.parentCount===null) && !this.state.refreshing
            ? <div id="loader">
                <p id="loader">Loading...</p>
              </div>
            : this.state.loadingBottom
              ? <div id="loader-memes">
                  {this.state.oldParentsHTML}
                  {this.state.oldMemeHTML}
                  {this.state.oldRepliesHTML}
                  <p id="loader">Loading...<br/></p>
                </div>
              : <div id="loader-memes">
                  <p id="loader">Loading...</p>
                  {this.state.oldParentsHTML}
                  {this.state.oldMemeHTML}
                  {this.state.oldRepliesHTML}
                </div>
          : !this.state.refreshing
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
