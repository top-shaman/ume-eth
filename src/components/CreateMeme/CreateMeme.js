import React from 'react'
import ProfilePic from '../ProfilePic/ProfilePic'
import { fadeIn, fadeOut, partialFadeIn, partialFadeOut, unBlur } from '../../resources/Libraries/Animation'
import './CreateMeme.css'
import autosize from 'autosize'

class CreateMeme extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      creatingMeme: true,
      memeText: '',
      validMeme: false
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleMemeClick = this.handleMemeClick.bind(this)
    this.handleBgClick = this.handleBgClick.bind(this)
  }
  componentDidMount() {
    fadeIn('div.CreateMeme-container', 333)
    partialFadeIn('div.CreateMeme-background', 100, 0.2)
    if(localStorage.getItem('memeText'))
      this.setState({ memeText: localStorage.getItem('memeText') })
    this.textarea.focus()
    autosize(this.textarea)
  }

  async handleTextChange(e) {
    e.preventDefault()
    this.setState({ memeText: e.target.value })
    await this.checkIfValid(e.target.value)
    const text = await this.state.memeText
    if(text.match(/\s/g))
      this.setState({ validMeme: text.length!==text.match(/\s/g).length })
    else if(text.length>0)
      this.setState({ validMeme: true })
    console.log(this.state.validMeme)
  }
  handleMemeClick(e) {
    if(this.state.validMeme)
    console.log('meme button click')
  }
  async handleBgClick(e) {
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

  checkIfValid(text) {
  }

  render() {
    return(
      <div id="CreateMeme" handleExitMeme={this.handleExitMeme}>
        <div className="CreateMeme-container">
          <section className="CreateMeme-head">
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
          onClick={this.handleBgClick}
        >
        </div>
      </div>
    )
  }

}

export default CreateMeme
