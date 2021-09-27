import React, {Component} from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import { fromBytes, isolatePlain, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
import "./ReplyMeme.css"

class ReplyMeme extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.username,
      address: this.props.address,
      author: this.props.author,
      text: this.props.text,
      memeId: this.props.memeId,
      parentId: this.props.parentId,
      visibleText: this.props.text,
      replyingTo: '',
      replyChain: [],
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userStorage: this.props.userStorage,
      userAccount: this.props.userAccount,
      userHasLiked: this.props.userHasLiked
    }
    this.div = React.createRef()
  }
  // lifecycle functions
  async componentDidMount() {
    await this.replyingTo()
    await this.formatText()
    this.mounted = true
  }
  async componentWillUnmount() {
    this.mounted = false
  }
  async formatText() {
    let text = this.props.text,
        plainMap = await isolatePlain(text),
        atMap = await isolateAt(text),
        hashMap = await isolateHash(text),
        combined = [],
        formatted = []
    combined = plainMap.concat(atMap, hashMap)
      .sort((a,b) => a[0]-b[0])
    if(combined!==null) {
      let i = 0
      combined.forEach(elem => {
        if(elem[2]==='plain')
          formatted.push(<span key={i} id="plain">{elem[1]}</span>)
        else if(elem[2]==='at')
          formatted.push(<a key={i} href={`/${elem[1].slice(1)}`} id="at">{elem[1]}</a>)
        else if(elem[2]==='hash')
          formatted.push(<a key={i} href={`/${elem[1]}`} id="hash">{elem[1]}</a>)
        i++
      })
    }
    this.setState({ visibleText: formatted })
  }
  async replyingTo() {
    let replies= [],
        hasParent = true,
        //starting values for parentId & parentAddress
        replyId = this.state.memeId,
        replyAddress = this.state.address,
        parentId = await this.state.memeStorage.methods.getParentId(replyId).call(),
        key = 1

    while(hasParent) {
      if(await replyId===await parentId) hasParent = false
      replies.push(<span value={await replyId} id="parent" key={key}>{replyAddress}</span>)
      this.setState({ replyChain: [...this.state.replyChain, await replyId] })

      replyId = parentId
      replyAddress = await this.state.userStorage.methods.usersByMeme(replyId).call()
        .then(e => this.state.userStorage.methods.getUserAddr(e).call())
        .then(e => fromBytes(e))
      parentId = await this.state.memeStorage.methods.getParentId(replyId).call()

      key++
    }
    replies = replies.filter((elem, index) => {
      console.log(index)
      if(replies[index+1]!==undefined) {
        return elem.props.children!==replies[index+1].props.children
      } else return true
    })
    let replyingTo = [],
        numReplies = replies.length
    for(let i = 0; i < numReplies; i++) {
      replyingTo.push(replies[i])
      if(i!==numReplies-1) {
        replyingTo.push(<span id="replying">{', '}</span>)
      }
    }
    this.setState({ replyingTo })
    this.props.handleReply(this.state.replyChain)
  }

  render() {
    return(
      <div className="ReplyMeme" ref={Ref => this.div=Ref}>
        <div
          id="parentProfilePic"
        >
          <ProfilePic account={this.state.author} id="ReplyMeme"/>
          <div className="vl"/>
        </div>
        <div id="meme-body">
          <div id="meme-header">
            <a
              id="username"
              href={this.state.address.slice(1)}
            >
              {this.state.username}
            </a>
            <span id="address">{this.state.address}</span>
            <span id="time">{this.state.time}</span>
          </div>
          <p id="meme-text">
            {this.state.visibleText}
          </p>
          <p id="replying"><span id="replying">Replying to </span>{this.state.replyingTo}</p>
        </div>
      </div>
      );
    }
}

export default ReplyMeme
