import React from 'react'
import { bobble, filterIn, filterOut } from '../../resources/Libraries/Animation'
import Like from '../../resources/heart.svg'
import Liked from '../../resources/heart-filled.svg'
import './LikeButton.css'

class LikeButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      memeId: this.props.memeId,
      userAccount: this.props.userAccount,
      likes: this.props.likes,
      parentId: this.props.parentId,
      reponses: this.props.responses,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
      userHasLiked: this.props.userHasLiked
    }
    this.like = React.createRef()

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }
  async componentDidMount() {
    await this.userHasLiked()
  }
  async handleClick(e) {
    bobble('div#\\3' + this.state.memeId + '  p.' + e.target.className, 500)
    await this.likeClick()
  }
  handleMouseEnter(e) {
    e.preventDefault()
    let brightnessEnd, hue, elementName,
        brightnessStart = 0.7
    if(e.target.id==='like-button' &&
      this.like.style.filter!=='invert(0) sepia(1) brightness(0.4) saturate(10000%) hue-rotate(285deg)') {
      brightnessEnd = 0.4
      hue = 285
      elementName = 'div#\\3' + this.state.memeId + '  p#like-button'
      filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    } else if(e.target.id==='like-button-liked') {
      elementName = 'div#\\3' + this.state.memeId + '  p#like-button-liked'
      bobble(elementName, 500)
    }
  }
  handleMouseLeave(e) {
    e.preventDefault()
    let brightnessStart, hue, elementName,
        brightnessEnd = 0.6
    if(e.target.id==='like-button' || e.target.id==='like' || e.target.id==='like-count') {
      brightnessStart = 0.4
      hue = 285
      elementName = 'div#\\3' + this.state.memeId + '  p#like-button'
      filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    }
    else if(e.target.id==='like-button-liked') {
      elementName = 'div#\\3' + this.state.memeId + '  p#like-button-liked'
      bobble(elementName, 500)
    }
  }

  async likeClick() {
    console.log('accessing account: ' + this.props.userAccount)
    console.log('memeId: ' + this.state.memeId)
    await this.state.interface.methods.likeMeme(this.state.userAccount, this.state.memeId)
      .send({from: this.state.userAccount})
      .then(() => {
        if(!this.state.userHasLiked) {
          this.setState({
            userHasLiked: true,
            likes: this.state.likes+1
          })
          this.props.handleLike([this.state.memeId, this.state.userHasLiked, this.state.likes])
        }
        else {
          this.setState({
            userHasLiked: false,
            likes: this.state.likes-1
          })
          this.props.handleLike([this.state.memeId, this.state.userHasLiked, this.state.likes])
        }
      })
  }
  async userHasLiked() {
    const userHasLiked = await this.state.memeStorage.methods.getLikers(this.state.memeId).call()
      .then(e => e.includes(this.props.userAccount))
    if(userHasLiked) {
      const element = document.getElementById('like-button-liked')
      element.style.filter = 'invert(0) sepia(1) brightness(0.4) saturate(10000%) hue-rotate(285deg)'
    }
    this.setState({
      userHasLiked
    })
  }

  render() {
    return(
      this.state.userHasLiked
        ? <p
            className="like"
            id="like-button-liked"
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            ref={Ref => this.like=Ref}
          >
            <img className="like" src={Liked} alt="like button" id="like" width="13px" height="13px"/>
            <span className="like" id="like-count">{this.state.likes}</span>
          </p>
        : <p
            className="like"
            id="like-button"
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            ref={Ref => this.like=Ref}
          >
            <img className="like" src={Like} alt="like button" id="like" width="13px" height="13px"/>
            <span className="like" id="like-count">{this.state.likes}</span>
          </p>
    )
  }
}

export default LikeButton
