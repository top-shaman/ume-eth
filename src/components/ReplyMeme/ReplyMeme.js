import React, {Component} from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import { isolatePlain, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
import { fadeIn, zipUp, bobble, clickBobble, filterOut } from '../../resources/Libraries/Animation'
import "./ReplyMeme.css"

import Reply from '../../resources/reply.svg'
import Like from '../../resources/heart.svg'
import Liked from '../../resources/heart-filled.svg'
import Rememe from '../../resources/rememe.svg'
import Arrow from '../../resources/arrow.svg'

const emptyAddress = '0x0000000000000000000000000000000000000000000000000000000000000000'

class ReplyMeme extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.username,
      address: this.props.address,
      author: this.props.author,
      text: this.props.text,
      memeId: this.props.memeId,
      visibleText: this.props.text,
      replyingTo: '',
      interface: this.props.interface,
      memeStorage: this.props.memeStorage,
      userAccount: this.props.userAccount,
      userHasLiked: this.props.userHasLiked
    }
    this.div = React.createRef()
  }
  // lifecycle functions
  async componentDidMount() {
    await this.replyingTo()
    await this.formatText()
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
    const replyingTo= []
    let hasParent = true,
        parentAddress = this.state.address,
        key = 1
    console.log(this.state.username)
    if(hasParent) {
      replyingTo.unshift(<span id="parent" key={key}>{parentAddress}</span>)
      const parentId = await this.state.memeStorage.methods.getParentId(this.state.memeId).call()
      console.log(parentId)

      if(parentId===emptyAddress) hasParent = false
      console.log(replyingTo)
    }
    if(replyingTo.length>1) replyingTo.join(<span id="replying">, </span>)
    this.setState({ replyingTo })
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
