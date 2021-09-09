import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import { fadeIn, fadeOut, partialFadeIn, partialFadeOut, unBlur } from '../../resources/Libraries/Animation'
import './CreateMeme.css'
import X from '../../resources/X-white.svg'
import autosize from 'autosize'

class CreateMeme extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      creatingMeme: true,
      userStorage: this.props.userStorage,
      interface: this.props.interface,
      memeText: '',
      visibleText: '',
      validMeme: false
    }

    this.textarea = React.createRef()

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleMemeClick = this.handleMemeClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
  }

  componentDidMount() {
    const textBox = document.querySelector('.CreateMeme div#text-box')
    const storage = localStorage.getItem('memeText')
    //this.textarea.style.height = textBox.clientHeight + 'px'
    fadeIn('.CreateMeme div#container', 333)
    partialFadeIn('.CreateMeme div#background', 100, 0.2)
    if(storage && !storage.match(/\s/g)) {
      const buttonText = document.querySelector('.CreateMeme p#meme-button'),
            memeButton = document.querySelector('.CreateMeme p#meme-button')
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

  async handleTextChange(e) {
    e.preventDefault()
    this.setState({ memeText: e.target.value })
    const text = await e.target.value,
          buttonText = document.querySelector('.CreateMeme p#meme-button'),
          memeButton = document.querySelector('.CreateMeme p#meme-button'),
          textBox = document.querySelector('.CreateMeme div#text-box'),
          textarea = document.querySelector('.CreateMeme textarea#meme-text')
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
  async handleMemeClick(e) {
    const textarea = document.querySelector('.CreateMeme textarea#meme-text')
    if(this.state.validMeme) {
      const tags = await this.compileTags()
      this.state.interface.methods.newMeme(
        this.props.account,
        this.state.memeText,
        tags, '0x0', '0x0')
      .send({from: this.props.account})
      this.handleCloseClick(e)
      localStorage.clear()
    }
  }
  async handleCloseClick(e) {
    localStorage.setItem('memeText', this.state.memeText)
    fadeOut('.CreateMeme div#container', 500)
    partialFadeOut('.CreateMeme div#background', 333, 0.2)
    unBlur('div.App-header', 500)
    unBlur('div.App-body', 500)
    setTimeout(async () => {
      await this.setState({ creatingMeme: false })
      this.props.handleExitMeme(await this.state.creatingMeme)
    }, 500)
  }

  async isolatePlain() {
    const regex = /([^@#](?=\w){0,31})(?<![@#]\w{0,31})([^@#]|([@#](?!\w)))*/g
    //const regex = /(?<![@#]\w*)[^@#]*/g
    const plainMap = []
    let exec
    while((exec = regex.exec(this.state.memeText)) !== null) {
      plainMap.push([regex.lastIndex-exec[0].length, exec[0], 'plain'])
    }
    return plainMap
  }
  async isolateAt() {
    const regex = /@\w{1,31}/g
    const atMap = []
    let exec
    while((exec = regex.exec(this.state.memeText)) !== null) {
      atMap.push([regex.lastIndex-exec[0].length, exec[0], 'at'])
    }
    return atMap
  }
  async isolateHash() {
    const regex = /#\w{1,31}/g
    const hashMap = []
    let exec
    while((exec = regex.exec(this.state.memeText)) !== null) {
      hashMap.push([regex.lastIndex-exec[0].length, exec[0], 'hash'])
    }
    return hashMap
  }
  async formatText() {
    let plainMap = await this.isolatePlain(),
        atMap = await this.isolateAt(),
        hashMap = await this.isolateHash(),
        combined = [],
        formatted = []
    combined = plainMap.concat(atMap, hashMap)
      .sort((a,b) => a[0]-b[0])
    if(combined!==null) {
      combined.forEach(elem => {
        if(elem[2]==='plain')
          formatted.push(<span id="plain">{elem[1]}</span>)
        else if(elem[2]==='at')
          formatted.push(<span id="at">{elem[1]}</span>)
        else if(elem[2]==='hash')
          formatted.push(<span id="hash">{elem[1]}</span>)
      })
    }
    console.log(formatted)
    return formatted
  }
  async compileTags() {
    const memeText = this.state.memeText,
          at = /@\w+/g,
          tags = memeText.match(at)
    return tags
  }

  render() {
    return(
      <div className="CreateMeme" id="CreateMeme" >
        <div id="container">
          <section id="head">
            <img
              id="x"
              className="close"
              src={X}
              width="11px"
              onClick={this.handleCloseClick}
            />
          </section>
          <section id="body">
            <div id="profilePic">
              <ProfilePic
                id="profilePic"
                account={this.props.account}
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
                  rows="5"
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
                  onClick={this.handleMemeClick}
                >
                  Meme
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

export default CreateMeme
