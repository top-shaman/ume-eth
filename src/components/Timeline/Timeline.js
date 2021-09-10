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
      memesHTML: [],
      uInterface: null,
      memeStorage: null,
      userStorage: null,
      memeCount: null,
      timelineLoading: true,
      firstLoad: true
    }

  }
  handleLoading(e) {
    console.log('check')
  }
  async componentDidMount() {
    await this.loadTimeline()
    this.interval = setInterval(async () => {
      this.setState({ firstLoad: false })
      await this.loadTimeline()
    }, 10000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }

  async loadTimeline() {
    console.log('load timeline ' + new Date().toTimeString())
    const memeCount = await this.props.memeStorage.methods.memeCount().call()
    const countDifference = await memeCount - this.state.memeCount
    if(await memeCount > this.state.memeCount) {
      this.setState({
        memeCount,
        timelineLoading: true
      })
      const tempMemes = this.state.memes
      for(let i = memeCount - countDifference + 1; i <= memeCount; i++) {
        const memeId = await this.props.interface.methods
          .encode(i).call()
        const tempMeme = await this.props.memeStorage.methods.memes(memeId).call()
        const meme = {
          id: memeId,
          username: await this.props.userStorage.methods.users(tempMeme.author).call()
            .then(e => fromBytes(e.name))
            .then(e => e.toString()),
          address: await this.props.userStorage.methods.users(tempMeme.author).call()
            .then(e => fromBytes(e.userAddr))
            .then(e => e.toString()),
          text: tempMeme.text,
          time: new Date(tempMeme.time * 1000).toLocaleString(),
          boosts: tempMeme.boosts,
          likes: await this.props.memeStorage.methods.getLikeCount(memeId).call(),
          likers: await this.props.memeStorage.methods.getLikers(memeId).call(),
          rememeCount: await this.props.memeStorage.methods.getRepostCount(memeId).call(),
          rememes: await this.props.memeStorage.methods.getReposts(memeId).call(),
          quoteCount: await this.props.memeStorage.methods.getQuotePostCount(memeId).call(),
          quoteMemes: await this.props.memeStorage.methods.getQuotePosts(memeId).call(),
          responses: await this.props.memeStorage.methods.getResponses(memeId).call(),
          tags: await this.props.memeStorage.methods.getTags(memeId).call(),
          repostId: tempMeme.repostId,
          parentId: tempMeme.parentId,
          originId: tempMeme.originId,
          author: tempMeme.author,
          isVisible: tempMeme.isVisible
        }
        this.setState({
          memes: [...this.state.memes, meme],
        })
      }
      if(!this.state.firstLoad) this.setState({ oldMemesHTML: this.state.memesHTML })
      this.renderTimeline()
      this.props.handleLoading(this.state.timelineLoading)
    }
    else {
      this.setState({ timelineLoading: false })
    }
  }
  renderTimeline() {
    let memesHTML = []
    for(let i = 1; i <= this.state.memeCount; i++) {
      const meme = this.state.memes[i-1]
      memesHTML.unshift(
        <Meme
          key={i}
          memeId={meme.id}
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
        />
      )
    }
    this.setState({
      memesHTML,
      timelineLoading: false
    })
    if(this.state.firstLoad) this.setState({ oldMemesHTML: memesHTML })
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
