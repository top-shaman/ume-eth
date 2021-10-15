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
      isMain: this.props.isMain,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
      userHasLiked: this.props.userHasLiked
    }
    this.like = React.createRef()
    this.liked = React.createRef()

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnterLike = this.handleMouseEnterLike.bind(this)
    this.handleMouseLeaveLike = this.handleMouseLeaveLike.bind(this)
    this.handleMouseEnterLiked = this.handleMouseEnterLiked.bind(this)
    this.handleMouseLeaveLiked = this.handleMouseLeaveLiked.bind(this)
  }
  async componentDidMount() {
    if(this.state.userHasLiked) {
      this.liked.style.filter = 'invert(0) sepia(1) brightness(0.4    ) saturate(10000%) hue-rotate(285deg)'
    }
    this.mounted = true
    await this.userHasLiked()
  }
  componentWillUnmount() {
    this.mounted = false
  }
  async handleClick(e) {
    if(!this.state.userHasLiked) {
      bobble('#' + this.like.id, 500)
    } else {
      bobble('#' + this.liked.id, 500)
    }
    await this.likeClick()
  }
  handleMouseEnterLike(e) {
    e.preventDefault()
    let brightnessStart = 0.7,
        brightnessEnd = 0.4,
        hue = 285,
        elementName = '#' + this.like.id
    filterIn(elementName, brightnessStart, brightnessEnd, hue, 200)
    this.props.handleOverLike(this.like.style.filter)
  }
  handleMouseLeaveLike(e) {
    e.preventDefault()
    let brightnessEnd = 0.6,
        brightnessStart = 0.4,
        hue = 285,
        elementName = '#' + this.like.id
    filterOut(elementName, brightnessStart, brightnessEnd, hue, 200)
    this.props.handleOverLike(this.like.style.filter)
  }
  handleMouseEnterLiked(e) {
    e.preventDefault()
    let elementName = '#' + this.liked.id
    bobble(elementName, 500)
  }
  handleMouseLeaveLiked(e) {
    e.preventDefault()
    let elementName = '#' + this.liked.id
    bobble(elementName, 500)
  }

  async likeClick() {
    await this.props.interface.methods.likeMeme(this.state.userAccount, this.state.memeId)
      .send({from: this.state.userAccount})
      .then(() => {
        if(!this.state.userHasLiked) {
          this.setState({
            userHasLiked: true,
            likes: this.state.likes+1
          })
          this.liked.style.filter = 'invert(0) sepia(1) brightness(0.4) saturate(10000%) hue-rotate(285deg)'
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
    if(this.state.userHasLiked!==userHasLiked) {
      this.setState({
        userHasLiked
      })
    }
  }

  render() {
    if(!this.state.isMain) {
      return(
        this.state.userHasLiked
          ? <p
              className="LikeButton-Liked"
              id={'liked-' + this.state.memeId}
              onClick={this.handleClick}
              onMouseEnter={this.handleMouseEnterLiked}
              onMouseLeave={this.handleMouseLeaveLiked}
              ref={Ref => this.liked=Ref}
            >
              <img className="like" src={Liked} alt="like button" id="like" width="16px" height="16px"/>
              <span className="like" id="like-count">{this.state.likes}</span>
            </p>
          : <p
              className="LikeButton"
              id={'like-' + this.state.memeId}
              onClick={this.handleClick}
              onMouseEnter={this.handleMouseEnterLike}
              onMouseLeave={this.handleMouseLeaveLike}
              ref={Ref => this.like=Ref}
          >
            <img className="like" src={Like} alt="like button" id="like" width="16px" height="16px"/>
            <span className="like" id="like-count">{this.state.likes}</span>
          </p>
      )
    }
    else {
      return(
        this.state.userHasLiked
          ? <p
              className="LikeButton-Liked"
              id={'liked-' + this.state.memeId}
              onClick={this.handleClick}
              onMouseEnter={this.handleMouseEnterLiked}
              onMouseLeave={this.handleMouseLeaveLiked}
              ref={Ref => this.liked=Ref}
            >
              <img className="like" src={Liked} alt="like button" id="like" width="21px" height="21px"/>
            </p>
          : <p
              className="LikeButton"
              id={'like-' + this.state.memeId}
              onClick={this.handleClick}
              onMouseEnter={this.handleMouseEnterLike}
              onMouseLeave={this.handleMouseLeaveLike}
              ref={Ref => this.like=Ref}
            >
              <img className="like" src={Like} alt="like button" id="like" width="21px" height="21px"/>
          </p>
      )
    }
  }
}

export default LikeButton
