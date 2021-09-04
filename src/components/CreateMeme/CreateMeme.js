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
      interface: this.props.interface,
      memeText: '',
      validMeme: false
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleMemeClick = this.handleMemeClick.bind(this)
    this.handleCloseClick = this.handleCloseClick.bind(this)
  }

  componentDidMount() {
    fadeIn('div.CreateMeme-container', 333)
    partialFadeIn('div.CreateMeme-background', 100, 0.2)
    const storage = localStorage.getItem('memeText')
    if(storage && !storage.match(/\s/g)) {
      const buttonText = document.querySelector('p#memeButton.CreateMeme')
      const memeButton = document.querySelector('p#memeButton.CreateMeme')
      this.setState({
        memeText: localStorage.getItem('memeText'),
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
    const text = await this.state.memeText
    const buttonText = document.querySelector('p#memeButton.CreateMeme')
    const memeButton = document.querySelector('p#memeButton.CreateMeme')
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
  }
  async handleMemeClick(e) {
    const textarea = document.querySelector('textarea#meme.meme-text')
    const tags = []
    if(this.state.validMeme) {
      console.log('meme button click')
      console.log(this.state.memeText)
      this.state.interface.methods.newMeme(
        this.props.account,
        this.state.memeText,
        tags, '0x0', '0x0')
      .send({from: this.props.account})
      this.handleCloseClick(e)
    }
  }
  async handleCloseClick(e) {
    console.log('bg click')
    localStorage.setItem('memeText', this.state.memeText)
    fadeOut('div.CreateMeme-container', 500)
    partialFadeOut('div.CreateMeme-background', 333, 0.2)
    unBlur('div.App-header', 500)
    unBlur('div.App-body', 500)
    setTimeout(async () => {
      await this.setState({ creatingMeme: false })
      this.props.handleExitMeme(await this.state.creatingMeme)
    }, 500)
  }


  render() {
    return(
      <div id="CreateMeme" handleExitMeme={this.handleExitMeme}>
        <div className="CreateMeme-container">
          <section className="CreateMeme-head">
            <img
              id="x"
              className="close"
              src={X}
              width="11px"
              onClick={this.handleCloseClick}
            />
          </section>
          <section className="CreateMeme-body">
            <div className="CreateMeme-profilePic">
              <ProfilePic
                id="memeText-profilePic"
                className="CreateMeme"
                account={this.props.account}
              />
            </div>
            <form className="CreateMeme-form">
              <div className="CreateMeme-textBox">
                <textarea
                  id="meme"
                  name="meme"
                  className="meme-text"
                  type="text"
                  autoComplete="off"
                  placeholder="What's the meme"
                  rows="5"
                  value={this.state.memeText}
                  onChange={this.handleTextChange}
                  ref={c=>this.textarea=c}
                  required />
              </div>
              <div className="CreateMeme-buttonBox">
                <p
                  id="memeButton"
                  className="CreateMeme"
                  onClick={this.handleMemeClick}
                >
                  Meme
                </p>
              </div>
            </form>
          </section>
        </div>
        <div
          className="CreateMeme-background"
          onClick={this.handleCloseClick}
        >
        </div>
      </div>
    )
  }

}

export default CreateMeme
