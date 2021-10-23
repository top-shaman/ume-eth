import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import { fadeIn, fadeOut, partialFadeIn, partialFadeOut, unBlur } from '../../resources/Libraries/Animation'
import { toBytes, isolatePlain, isolateAt, isolateHash } from '../../resources/Libraries/Helpers'
import './CreateMeme.css'
import X from '../../resources/X-white.svg'
import autosize from 'autosize'

const emptyId = '0x0000000000000000000000000000000000000000000000000000000000000000'

class CreateMeme extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      creatingMeme: true,
      userStorage: this.props.userStorage,
      interface: this.props.interface,
      memeText: localStorage.getItem('memeText')!==undefined ? localStorage.getItem('memeText') : '',
      visibleText: localStorage.getItem('memeText')!==undefined ? localStorage.getItem('memeText') : '',
      flag: '',
      parentId: emptyId,
      chainParentId: emptyId,
      originId: emptyId,
      repostId: emptyId,
      validMeme: false
    }

    this.textarea = React.createRef()
    this.textBox = React.createRef()

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleMemeClick = this.handleMemeClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    const background = document.querySelector('.CreateMeme div#background'),
          container = document.querySelector('.CreateMeme div#container')
    background.style.top = this.props.offsetY + 'px'

    if(window.innerWidth<580) {
      container.style.top = 'calc(0% + ' + this.props.offsetY +'px)'
    } else {
      container.style.top = 'calc(15% + ' + this.props.offsetY + 'px)'
    }

    const storage = localStorage.getItem('memeText')
    if(storage && !storage.match(/\s/g)) {
      const buttonText = document.querySelector('.CreateMeme p#meme-button'),
            memeButton = document.querySelector('.CreateMeme p#meme-button')
      this.setState({
        memeText: this.state.memeText!=='null' || this.state.memeText!==null ? '' : localStorage.getItem('memeText'),
        visibleText: this.state.memeText!=='null' || this.state.memeText!==null ? '' : localStorage.getItem('memeText'),
        validMeme: true
      })
      console.log(this.textBox.clientHeight)
      memeButton.style.backgroundColor = '#00CC89'
      memeButton.style.cursor = 'pointer'
      buttonText.style.color = '#FFFFFF'
    }
    fadeIn('.CreateMeme div#container', 333)
    partialFadeIn('.CreateMeme div#background', 100, 0.2)
    this.textarea.focus()
    autosize(this.textarea)
  }
  componentDidUpdate() {
    const container = document.querySelector('.CreateMeme div#container'),
          background = document.querySelector('.CreateMeme div#background')
    background.style.top = this.props.offsetY + 'px'
    if(this.state.windowWidth!==window.innerWidth) {
      this.setState({ windowWidth: window.innerWidth })
      this.setState({ windowHeight: window.innerHeight })
    }
    if(this.state.windowWidth<580) {
      container.style.top = 'calc(0% + ' + this.props.offsetY +'px)'
    } else {
      container.style.top = 'calc(15% + ' + this.props.offsetY + 'px)'
    }
  }

  componentWillUnmount() {
    window.addEventListener('resize', null)
    this.mounted = false
  }

  async handleTextChange(e) {
    e.preventDefault()
    this.setState({ memeText: e.target.value })
    const text = await e.target.value,
          buttonText = document.querySelectorAll('.CreateMeme p#meme-button'),
          memeButton = document.querySelectorAll('.CreateMeme p#meme-button'),
          textBox = document.querySelector('.CreateMeme div#text-box'),
          textarea = document.querySelector('.CreateMeme textarea#meme-text')
    textBox.style.height = textarea.clientHeight + 'px'
    // check text validity
    if(text.match(/\s/g)) {
      this.setState({ validMeme: text.length!==text.match(/\s/g).length })
      memeButton.forEach(elem => {
        elem.style.cursor = 'default'
        elem.style.backgroundColor = '#334646'
      })
      buttonText.forEach(elem => elem.style.color = '#AABBAA')
    } else if(text.length>0 && text.length<=512) {
      memeButton.forEach(elem => {
        elem.style.cursor = 'pointer'
        elem.style.backgroundColor = '#00CC89'
      })
      buttonText.forEach(elem => elem.style.backgroundColor = '#FFFFFF')
      this.setState({ validMeme: true })
    } else if(e.target.value==='') {
      memeButton.forEach(elem => {
        elem.style.cursor = 'default'
        elem.style.backgroundColor = '#334646'
      })
      buttonText.forEach(elem => elem.style.color = '#AABBAA')
      this.setState({ validMeme: false })
    }
    if(this.state.validMeme) {
      memeButton.forEach(elem => {
        elem.style.cursor = 'pointer'
        elem.style.backgroundColor = '#00CC89'
      })
      buttonText.forEach(elem => elem.style.color = '#FFFFFF')
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
      this.props.handleBanner([
          'Waiting',
          'Meme',
          this.state.memeText
        ])
      const tags = await this.validAts()
      await this.state.interface.methods.newMeme(
          this.props.account,
          this.state.memeText,
          await tags, this.state.parentId, this.state.originId)
      .send({from: this.props.account})
      .on('transactionHash', () => {
        this.props.handleBanner([
          'Writing',
          'Meme',
          this.state.memeText
        ])
        this.handleCloseClick()
      })
      .on('receipt', () => {
        this.props.handleBanner([
          'Success',
          'Meme',
          this.state.memeText
        ])
      })
      .catch(e => {
        this.props.handleBanner([
          'Cancel',
          'Meme',
          this.state.memeText
        ])
        console.error(e)
      })
      localStorage.setItem('memeText', '')
    }
  }
  async handleCloseClick(e) {
    localStorage.setItem('memeText', this.state.memeText)
    fadeOut('.CreateMeme div#container', 500)
    partialFadeOut('.CreateMeme div#background', 333, 0.2)
    unBlur('div.Main', 500)
    setTimeout(async () => {
      await this.setState({ creatingMeme: false })
      this.props.handleExitCreate(await this.state.creatingMeme)
    }, 500)
  }
  handleResize(ContainerSize, event) {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    })
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
    <div
      className="CreateMeme"
      id="CreateMeme"
    >
      <div id="container">
        <section id="head">
          <img
            id="x"
            className="close"
            alt="close button"
            src={X}
            width="13px"
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
            <div id="text-box" ref={Ref=>this.textBox=Ref}>
              <textarea
                name="meme"
                id="meme-text"
                type="text"
                autoComplete="off"
                placeholder="What's the meme"
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
                Meme
              </p>
            </div>
          </form>
        </section>
        <div id="button-box-small">
          <div className="counter">{this.state.flag}</div>
            <p
              id="meme-button"
              onClick={this.handleMemeClick}
            >
              Meme
            </p>
          </div>
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
