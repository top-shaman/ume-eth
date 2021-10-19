import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import ReplyMeme from '../Reply/ReplyMeme'
import Tag from '../Tag/Tag'
import { fadeIn, fadeOut, partialFadeIn, partialFadeOut, unBlur } from '../../resources/Libraries/Animation'
import { toBytes, isolatePlain, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
import './Reply.css'
import X from '../../resources/X-white.svg'
import autosize from 'autosize'

class Reply extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      replying: true,
      account: this.props.account,
      parentUsername: this.props.username,
      parentAddress: this.props.address,
      parentAuthor: this.props.author,
      parentText: this.props.text,
      memeId: this.props.memeId,
      parentId: this.props.parentId,
      chainParentId: this.props.chainParentId,
      originId: this.props.originId,
      repostId: this.props.repostId,
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
      memeText: localStorage.getItem('memeText')!==null ? localStorage.getItem('memeText') : '',
      visibleText: localStorage.getItem('memeText')!==null ? localStorage.getItem('memeText') : '',
      flag: '',
      validMeme: false
    }

    this.textarea = React.createRef()
    this.textBox = React.createRef()

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleMemeClick = this.handleMemeClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleToProfile = this.handleToProfile.bind(this)
  }

  componentDidMount() {
    const storage = localStorage.getItem('memeText')
    if(storage && !storage.match(/\s/g)) {
      const buttonText = document.querySelector('.Reply p#meme-button'),
            memeButton = document.querySelector('.Reply p#meme-button')
      this.setState({
        memeText: this.state.memeText!==null && this.state.memeText!=='null' ? '' : localStorage.getItem('memeText'),
        visibleText: this.state.memeText!==null && this.state.memeText!=='null' ? '' : localStorage.getItem('memeText'),
        validMeme: true
      })
      memeButton.style.backgroundColor = '#00CC89'
      memeButton.style.cursor = 'pointer'
      buttonText.style.color = '#FFFFFF'
    }
    fadeIn('.Reply div#container', 333)
    partialFadeIn('.Reply div#background', 100, 0.2)
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
          buttonText = document.querySelector('.Reply p#meme-button'),
          memeButton = document.querySelector('.Reply p#meme-button'),
          textBox = document.querySelector('.Reply div#text-box'),
          textarea = document.querySelector('.Reply textarea#meme-text')
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
    if(text.length>=412 && text.length<502) {
      this.setState({
        flag: <p id="flag-grey">{(512-text.length) + ' characters left'}</p>
      })
    } else if(text.length>=502 && text.length<=512) {
      this.setState({
        flag: <p id="flag-red">{(512-text.length) + ' characters left'}</p>
      })
    } else {
      this.setState({ flag: '' })
    }
    // change color of text if special sequence
    const formattedText = await this.formatText()
    this.setState({ visibleText: formattedText})

  }
  async handleMemeClick(e) {
    if(this.state.validMeme) {
      const tags = await this.validAts()
      this.state.interface.methods.newMeme(
        this.props.account,
        this.state.memeText,
        await tags, this.state.parentId, this.state.originId)
      .send({from: this.props.account})
      this.handleCloseClick(e)
      localStorage.setItem('memeText', '')
    }
  }
  async handleCloseClick(e) {
    localStorage.setItem('memeText', this.state.memeText)
    fadeOut('.Reply div#container', 500)
    partialFadeOut('.Reply div#background', 333, 0.2)
    unBlur('div.Main', 500)
    setTimeout(async () => {
      await this.setState({ replying: false })
      this.props.handleExitReply(await this.state.replying)
    }, 500)
  }
  handleReply(e) {
    this.setState({
      parentId: e[0],
      chainParentId: e[e.length-1]
    })
    //console.log(this.state.parentId)
    //console.log(this.state.originId)
  }
  async handleToProfile(e) {
    this.handleCloseClick(e)
    this.props.handleToProfile(e)
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
      <div className="Reply" id="Reply" >
        <div id="container">
          <section id="head">
            <img
              id="x"
              className="close"
              src={X}
              alt="close button"
              width="11px"
              onClick={this.handleCloseClick}
            />
          </section>
          <ReplyMeme
            username={this.state.parentUsername}
            address={this.state.parentAddress}
            author={this.state.parentAuthor}
            text={this.state.parentText}
            memeId={this.state.memeId}
            parentId={this.state.parentId}
            originId={this.state.originId}
            memeStorage={this.state.memeStorage}
            userStorage={this.state.userStorage}
            handleReply={this.handleReply}
            handleToProfile={this.handleToProfile}
          />
          <section id="body">
            <div id="profilePic">
              <ProfilePic
                id="profilePic"
                account={this.state.account}
              />
            </div>
            <form id="form">
              <div id="text-box" ref={Ref=>this.textBox=Ref}>
                <textarea
                  name="meme"
                  id="meme-text"
                  type="text"
                  autoComplete="off"
                  placeholder="Meme your reply"
                  rows="auto"
                  maxLength="512"
                  value={this.state.memeText}
                  onChange={this.handleTextChange}
                  ref={Ref=>this.textarea=Ref}
                  required/>
                <p id="text-box">
                  {this.state.visibleText}
                </p>
              </div>
              <div id="button-box">
                <div className="counter">{this.state.flag}</div>
                <p
                  id="meme-button"
                  onClick={this.handleMemeClick}
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

export default Reply
