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
      memesRendered: null,
      timelineLoading: false,
      firstLoad: true,
      loadOldMemes: true,
    }

    this.handleToProfile = this.handleToProfile.bind(this)
  }
  handleLoading(e) {
    //console.log('check')
  }
  async componentDidMount() {
    clearInterval(this.intervalTimeline)
    await this.loadTimeline()
    if(this.state.firstLoad) {
      this.intervalTimeline = setInterval(async () => {
        this.setState({ firstLoad: false })
        await this.loadTimeline()
      }, 10000)
    }
  }
  componentDidUpdate() {
    if(this.props.atBottom) {
      console.log('check')
    }
  }
  componentWillUnmount() {
    clearInterval(this.intervalTimeline)
  }
  handleToProfile(e) {
    this.props.handleToProfile(e)
  }

  async loadTimeline() {
    console.log('load timeline ' + new Date().toTimeString())
    const userStorage = await this.props.userStorage,
          memeStorage = await this.props.memeStorage,
          uInterface = await this.props.interface,
          memes = await this.state.memes,
          memeCount = await memeStorage.methods.memeCount().call()
    let memesToRender = await this.state.memesToRender,
        memesNotRendered = await this.state.memesNotRendered,
        totalMemesRendered = await this.state.memesRendered,
        memesRendered = 0
    // find memes 'above' visible meme render
    const countDifference = await memeCount - await this.state.memeCount
    if(memesNotRendered===null && memesToRender < memeCount) {
      // find memes 'under' visible meme render
      memesNotRendered = memeCount - memesToRender
    } else if (!this.state.firstLoad && countDifference>0) {
      memesToRender = countDifference
    } else if (memesNotRendered>0 && memesToRender < memeCount) {
      memesNotRendered = memeCount - memesToRender - totalMemesRendered
    } else if (memesNotRendered!==0 && memesNotRendered < memesToRender) {
      memesToRender = memesNotRendered
    } else if (totalMemesRendered===memeCount) {
      memesNotRendered = 0
      memesToRender = countDifference
    }
    console.log('meme count before load: ' + memeCount)
    console.log('memes not yet rendered before load: ' + memesNotRendered)
    console.log('memes rendered before load: ' + totalMemesRendered)

    if(await memeCount > await this.state.memeCount) {
      this.setState({
        timelineLoading: true,
        memeCount,
        memesNotRendered
      })
      //for(let i = memeCount - countDifference + 1; i <= memeCount; i++) {
      for(let i = 1; i <= memesToRender; i++) {
        const adjustment = memesNotRendered + i
        const memeId = await uInterface.methods
          .encode(adjustment).call().catch(e => console.error(e))
        const tempMeme = await memeStorage.methods.memes(memeId).call()
        const username = await userStorage.methods.users(tempMeme.author).call()
            .then(e => fromBytes(e.name))
            .then(e => e.toString())
        const address = await userStorage.methods.users(tempMeme.author).call()
            .then(e => fromBytes(e.userAddr))
            .then(e => e.toString())
        const meme = {
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
          renderOrder: adjustment,
          alreadyRendered: false
        }
        this.setState({
          memes: [...this.state.memes, meme],
        })
        this.setState({
          memes: this.state.memes.sort((a,b)=> a.time-b.time)
        })
        memesRendered++
      }
      //if(!this.state.firstLoad)
      this.setState({ memesHTML: this.state.oldMemesHTML })
      await this.renderTimeline().catch(e => console.error(e))
      totalMemesRendered += memesRendered
      this.setState({
        memesRendered,
        timelineLoading: false,
        memesRendered: totalMemesRendered
      })
      console.log('total memes: ' + memeCount)
      console.log('memes rendered: ' + totalMemesRendered)
      console.log('memes not yet rendered: ' + memesNotRendered)
      await this.props.handleLoading(this.state.timelineLoading)
    }
    else {
      this.setState({
        timelineLoading: false,
      })
    }
  }

  async renderTimeline() {
    const tempMemesHTML = [],
          tempOldMemesHTML = [],
          tempMemes = this.state.memes,
          memesToRender = this.state.memesToRender,
          memesRendered = this.state.memesRendered,
          memeCount = this.state.memeCount
    console.log(memesToRender)
    if(memeCount!==null) {
      let notRenderedIndex = 0
      let meme
      for(let i = 1; i <= memesToRender+memesRendered; i++) {
        meme = tempMemes[i-1]
        //set the index of last rendered element, so cascade starts at new elements
        /*
        if(i>1 && !this.state.firstLoad) {
          notRenderedIndex = tempMemes[i-2].alreadyRendered &&
                             this.state.memesHTML[i-1]===undefined
                               ? i-1 : 0
        }
        */
        //add Meme component to temporary array
        console.log(meme.isVisible)
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
              renderOrder={meme.renderOrder}
              alreadyRendered={
                this.state.memesHTML!==undefined
                  ? meme.alreadyRendered
                  : false
              }
              handleToProfile={this.handleToProfile}
              interface={this.props.interface}
              memeStorage={this.props.memeStorage}
              userAccount={this.props.account}
            />
          )
        }
        tempMemes[i-1].alreadyRendered = true
      }
    }
    this.setState({
      memesHTML: tempMemesHTML,
      memes: tempMemes,
      timelineLoading: false
    })
    // memesHTML to function that marks rendered memes as 'alreadyRendered', sends to oldMemesHTML
    await this.compileRenderedMemes()
  }
  async compileRenderedMemes() {
    const tempMemesHTML = [],
          memes = this.state.memes,
          memesToRender = this.state.memesToRender,
          memesRendered = this.state.memesRendered
    for(let i = 1; i <= memesToRender+memesRendered; i++) {
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
            renderOrder={meme.renderOrder}
            alreadyRendered={true}
            handleToProfile={this.handleToProfile}
            interface={this.props.interface}
            memeStorage={this.props.memeStorage}
            userAccount={this.props.account}
          />
        )
      }
    }
    this.setState({ oldMemesHTML: tempMemesHTML })
  }

  render() {
    return(
      <div className="Timeline">
        { this.state.timelineLoading
          ? this.state.memeCount===null
            ? <div id="loader">
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
