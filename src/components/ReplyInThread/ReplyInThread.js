import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
//import { fadeIn, partialFadeIn} from '../../resources/Libraries/Animation'
import { toBytes, fromBytes, isolatePlain, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
import './ReplyInThread.css'
import autosize from 'autosize'

const emptyId = '0x0000000000000000000000000000000000000000000000000000000000000000'

class ReplyInThread extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      creatingMeme: true,
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
      memeText: localStorage.getItem('memeText'),
      visibleText: localStorage.getItem('memeText'),
      responses: this.props.responses,
      flagText: '',
      flag: '',
      replyingTo: [],
      replyChain: [],
      parentId: emptyId,
      originId: emptyId,
      repostId: emptyId,
      validMeme: false
    }
    this.div = React.createRef()
    this.body = React.createRef()
    this.textarea = React.createRef()
    this.textBox = React.createRef()

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleReplyClick = this.handleReplyClick.bind(this)
  }

  componentDidMount() {
    const storage = localStorage.getItem('memeText')
    if(storage && !storage.match(/\s/g)) {
      const buttonText = document.querySelector('.ReplyInThread p#reply-submit'),
            memeButton = document.querySelector('.ReplyInThread p#reply-submit')
      this.setState({
        memeText: localStorage.getItem('memeText'),
        visibleText: localStorage.getItem('memeText'),
        validMeme: true
      })

      memeButton.style.backgroundColor = '#00CC89'
      memeButton.style.cursor = 'pointer'
      buttonText.style.color = '#FFFFFF'
    }

    if(this.state.responses.length > 0) {
      this.div.style.margin = '0 1rem'
      this.div.style.paddingBottom = '1rem'
      this.div.style.borderBottom = '0.05rem solid #667777'
    }
    if(this.state.memeText.length!==0) {
      this.textBox.style.marginTop = '0.3rem'
      this.body.style.height = '1.1rem'
    }

    this.replyingTo()
    //this.textarea.focus()
    autosize(this.textarea)
    this.mounted = true
  }
  componentDidUpdate() {
    if(this.state.memeText.length>0) {
      this.body.style.height = 'auto'
    } else {
      this.body.style.height = '1.3rem'
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  async handleTextChange(e) {
    e.preventDefault()
    this.setState({ memeText: e.target.value })
    const text = await e.target.value,
          buttonText = document.querySelector('.ReplyInThread p#reply-submit'),
          memeButton = document.querySelector('.ReplyInThread p#reply-submit'),
          textBox = document.querySelector('.ReplyInThread div#reply-text-box'),
          textarea = document.querySelector('.ReplyInThread textarea#reply-text')
    textBox.style.height = textarea.clientHeight + 'px'
    // check text validity
    if(text.match(/\s/g)) {
      this.setState({ validMeme: text.length!==text.match(/\s/g).length })
      memeButton.style.cursor = 'default'
      memeButton.style.backgroundColor = '#334646'
      buttonText.style.color = '#AABBAA'
    } else if(text.length>0 && text.length<=512) {
      memeButton.style.cursor = 'pointer'
      memeButton.style.backgroundColor = '#00CC89'
      buttonText.style.backgroundColor = '#FFFFFF'
      this.setState({ validMeme: true })
    } else if(e.target.value==='') {
      memeButton.style.cursor = 'default'
      memeButton.style.backgroundColor = '#334646'
      buttonText.style.color = '#AABBAA'
      this.setState({ validMeme: false })
    }
    if(this.state.validMeme) {
      memeButton.style.cursor = 'pointer'
      memeButton.style.backgroundColor = '#00CC89'
      buttonText.style.color = '#FFFFFF'
    }
    if(this.state.validMeme) {
      memeButton.style.cursor = 'pointer'
      memeButton.style.backgroundColor = '#00CC8    9'
      buttonText.style.color = '#FFFFFF'
    }
    if(text.length>=412 && text.length<502) {
      this.setState({
        flagText: (512-text.length) + ' characters left',
      })
      this.setState({
        flag: <p id="flag-grey">{this.state.flagText}</p>
      })
    } else if(text.length>=502 && text.length<=512) {
      this.setState({
        flagText: (512-text.length) + ' characters left',
      })
      this.setState({
        flag: <p id="flag-red">{this.state.flagText}</p>
      })
      } else {
      this.setState({ flag: '' })
    }
    if(window.innerWidth< 465) {
      this.setState({
        flagText: this.state.flagText.split(' ')[0]
      })
    }
    // change color of text if special sequence
    const formattedText = await this.formatText()
    this.setState({ visibleText: formattedText})
    localStorage.setItem('memeText', this.state.memeText)

  }
  async handleReplyClick(e) {
    if(this.state.validMeme) {
      const tags = await this.validAts()
      this.state.interface.methods.newMeme(
        this.props.userAccount,
        this.state.memeText,
        await tags, this.state.parentId, this.state.originId)
      .send({from: this.props.userAccount})
      localStorage.setItem('memeText', '')
    }
  }
  async formatText() {
    let text = this.state.memeText,
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
          formatted.push(<span key={i} id="at">{elem[1]}</span>)
        else if(elem[2]==='hash')
          formatted.push(<span key={i} id="hash">{elem[1]}</span>)
        i++
      })
    }
    return formatted
  }
  async validAts() {
    let ats = [],
        validAts = [],
        tempMap = await isolateAt(this.state.memeText)
    if(tempMap.length!==null) tempMap.forEach(elem => ats.push(elem[1]))
    if(ats.length>0) {
      for(let i = 0; i < ats.length; i++) {
        let elem32 = await this.toBytes32(ats[i])
        if(await this.state.userStorage.methods.userAddressExists(elem32).call()) {
          let address = await this.state.userStorage.methods.usersByUserAddr(elem32).call()
          validAts.push(address)
        }
      }
      return validAts
    }
    return []
  }

  async toBytes32(text) {
    const textBytes = await toBytes(text)
    return await this.state.interface.methods.bytesToBytes32(textBytes).call()
  }

  async replyingTo() {
    let replies= [],
        hasParent = true,
        //starting values for parentId & parentAddress
        replyId = this.props.memeId,
        replyAddress = this.props.address,
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
    this.setState({
      replyingTo,
      parentId: this.state.replyChain[0],
      originId: this.state.replyChain[this.state.replyChain.length-1]
    })
    this.props.handleReplyThread(this.state.replyChain)
  }

  render() {
    return(
      <div className="ReplyInThread" id="ReplyInThread" ref={Ref=>this.div=Ref}>
        <div id="reply-container">
          <div id="reply-body" ref={Ref=>this.body=Ref}>
            <div id="reply-profilePic">
              <ProfilePic
                id="profilePic"
                account={this.props.userAccount}
              />
            </div>
            <form id="reply-form">
              <section id="reply-header">
                { document.activeElement===this.textarea
                  ? <p id="replying"><span id="replying">Replying to </span>{this.state.replyingTo}</p>
                  : <p id="replying"><span id="replying"></span></p>
                }

              </section>
              <div id="reply-text-box" ref={Ref=>this.textBox=Ref}>
                <textarea
                  name="meme"
                  id="reply-text"
                  type="text"
                  autoComplete="off"
                  placeholder="Meme your reply"
                  rows="1"
                  maxLength="512"
                  value={this.state.memeText}
                  onChange={this.handleTextChange}
                  ref={Ref=>this.textarea=Ref}
                  required/>
                <p id="text-box">
                  {this.state.visibleText}
                </p>
              </div>
            </form>
          </div>
          <div id="reply-button-box">
            <div className="counter">{this.state.flag}</div>
            <p
              id="reply-submit"
              onClick={this.handleReplyClick}
            >
              Reply
            </p>
          </div>
        </div>
      </div>
    )
  }

}

export default ReplyInThread
