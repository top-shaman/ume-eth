import React from 'react'
import Web3 from 'web3'
import UserInterface from '../../abis/UserInterface.json'
import Meme from "../Meme/Meme"
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
      userStorage: this.props.userStorage,
      memeCount: null,
      refreshed: this.props.refreshed,
      loading: this.props.loading
    }
  }
  // helper functions
  async toBytes32(s) {
    return await window.web3.utils.fromAscii(s)
  }
  async fromBytes32(b) {
    return await window.web3.utils.toUtf8(b)
  }
  async componentDidMount() {
    this.loadTimeline()
  }

  async loadTimeline() {
    this.setState({
      account: this.props.account,
      loading: true
    })
    const memeCount = await this.props.memeStorage.methods.memeCount().call()
    if(await memeCount > 0 && memeCount > this.state.memeCount) {
      this.setState({ memeCount })
      for(let i = 1; i <= memeCount; i++) {
        const memeId = await this.props.interface.methods
          .encode(i).call()
        const tempMeme = await this.props.memeStorage.methods.memes(memeId).call()
        const meme = {
          id: memeId,
          username: await this.props.userStorage.methods.users(tempMeme.author).call()
            .then(e => this.fromBytes32(e.name))
            .then(e => e.toString()),
          address: await this.props.userStorage.methods.users(tempMeme.author).call()
            .then(e => this.fromBytes32(e.userAddr))
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
      this.setState({
        memes: this.state.memes.sort((a,b) => Date.parse(b.time)/1000 - Date.parse(a.time)/1000),
        loading: false
      })
      this.renderTimeline()
    }
    else {
      return "No memes uploaded yet"
    }
  }

  async updateTimeline() {
    const memeCount = await this.props.memeStorage.methods.memeCount().call()
    const memeDifference = memeCount - this.state.memeCount
    console.log('check')
    if(await memeCount > 0 && await memeCount > this.state.memeCount) {
      this.setState({ memeCount })
      for(let i = memeCount - memeDifference + 1; i <= memeCount; i++) {
        const memeId = await this.props.interface.methods
          .encode(i).call()
        const tempMeme = await this.props.memeStorage.methods.memes(memeId).call()
        const meme = {
          id: memeId,
          username: await this.props.userStorage.methods.users(tempMeme.author).call()
            .then(e => this.fromBytes32(e.name))
            .then(e => e.toString()),
          address: await this.props.userStorage.methods.users(tempMeme.author).call()
            .then(e => this.fromBytes32(e.userAddr))
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
        const memeHTML =
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
          //console.log(meme.props.text)
        this.setState({
          memes: [...this.state.memes, meme],
          memesHTML: [...this.state.memesHTML, memeHTML]
        })
      }
      this.setState({
        memes: this.state.memes.sort((a,b) => Date.parse(b.time)/1000 - Date.parse(a.time)/1000),
        loading: false
      })
      this.renderTimeline()
    }
    else {
      return "No memes uploaded yet"
    }
  }

  renderTimeline() {
    let memesHTML = []
    for(let i = 0; i < this.state.memeCount; i++) {
      const meme = this.state.memes[i]
      memesHTML.push(
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
    this.setState({memesHTML})
  }



  render() {
    return(
      <div className="timeline">
        { this.props.loading
          ? <div id="loader" className="Content">
              <p>Loading...</p>
            </div>
          : <div id="loaded" className="Content">
            {
               this.state.memesHTML
            }
            </div>
        }
      </div>
    );
  }
}

export default Timeline
