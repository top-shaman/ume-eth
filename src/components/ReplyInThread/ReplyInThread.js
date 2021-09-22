import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import { fadeIn, partialFadeIn} from '../../resources/Libraries/Animation'
import { toBytes, isolatePlain, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
import './ReplyInThread.css'
import autosize from 'autosize'

const emptyId = '0x0000000000000000000000000000000000000000000000000000000000000000'

class ReplyInThread extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      creatingMeme: true,
      userStorage: this.props.userStorage,
      interface: this.props.interface,
      memeText: '',
      visibleText: '',
      parentId: emptyId,
      originId: emptyId,
      repostId: emptyId,
      validMeme: false
    }

    this.textarea = React.createRef()

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleReplyClick = this.handleReplyClick.bind(this)
  }

  componentDidMount() {
    const storage = localStorage.getItem('memeText')
    fadeIn('.ReplyInThread div#container', 333)
    partialFadeIn('.ReplyInThread div#background', 100, 0.2)
    if(storage && !storage.match(/\s/g)) {
      const buttonText = document.querySelector('.ReplyInThread p#meme-button'),
            memeButton = document.querySelector('.ReplyInThread p#meme-button')
      this.setState({
        memeText: localStorage.getItem('memeText'),
        visibleText: localStorage.getItem('memeText'),
        validMeme: true
      })
      memeButton.style.backgroundColor = '#00CC89'
      memeButton.style.cursor = 'pointer'
      buttonText.style.color = '#FFFFFF'
    }
    this.textarea.focus()
    autosize(this.textarea)
  }

  componentWillUnmount() {
    this.mounted = false
  }

  async handleTextChange(e) {
    e.preventDefault()
    this.setState({ memeText: e.target.value })
    const text = await e.target.value,
          buttonText = document.querySelector('.ReplyInThread p#meme-button'),
          memeButton = document.querySelector('.ReplyInThread p#meme-button'),
          textBox = document.querySelector('.ReplyInThread div#text-box'),
          textarea = document.querySelector('.ReplyInThread textarea#meme-text')
    textBox.style.height = textarea.clientHeight + 'px'
    // check text validity
    if(text.match(/\s/g)) {
      this.setState({ validMeme: text.length!==text.match(/\s/g).length })
      memeButton.style.cursor = 'default'
      memeButton.style.backgroundColor = '#334646'
      buttonText.style.color = '#AABBAA'
    } else if(text.length>0) {
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
    // change color of text if special sequence
    const formattedText = await this.formatText()
    this.setState({ visibleText: formattedText})

  }
  async handleReplyClick(e) {
    if(this.state.validMeme) {
      const tags = await this.validAts()
      this.state.interface.methods.newMeme(
        this.props.userAccount,
        this.state.memeText,
        await tags, this.state.parentId, this.state.originId)
      .send({from: this.props.userAccount})
      this.handleCloseClick(e)
      localStorage.clear()
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

  render() {
    return(
      <div className="ReplyInThread" id="ReplyInThread" >
        <div id="container">
          <section id="header">
            {/* reply chain goes here */}
          </section>
          <section id="body">
            <div id="profilePic">
              <ProfilePic
                id="profilePic"
                account={this.props.userAccount}
              />
            </div>
            <form id="form">
              <div id="text-box">
                <textarea
                  name="meme"
                  id="meme-text"
                  type="text"
                  autoComplete="off"
                  placeholder="What's the meme"
                  rows="1"
                  value={this.state.memeText}
                  onChange={this.handleTextChange}
                  ref={Ref=>this.textarea=Ref}
                  required/>
                <p id="text-box">
                  {this.state.visibleText}
                </p>
              </div>
              <div id="button-box">
                <p
                  id="meme-button"
                  onClick={this.handleReplyClick}
                >
                  Reply
                </p>
              </div>
            </form>
          </section>
        </div>
        <div
          id="background"
          onClick={this.handleCloseClick}
        >
        </div>
      </div>
    )
  }

}

export default ReplyInThread
