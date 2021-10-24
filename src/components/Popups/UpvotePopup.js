import React from 'react'

import { fadeIn } from '../../resources/Libraries/Animation'

import './UpvotePopup.css'

class UpvotePopup extends React.Component {
  constructor(props) {
    super(props)


      this.state = {
        account: this.props.account,
        memeId: this.props.memeId,
        umeBalance: parseInt(this.props.umeBalance),
        boostValue: 0,
        positionX: this.props.positionX,
        positionY: this.props.positionY,
        interface: this.props.interface
      }

      this.div = React.createRef()
      this.input = React.createRef()
      this.field = React.createRef()
      this.button = React.createRef()

      this.increment = this.increment.bind(this)
      this.decrement = this.decrement.bind(this)
      this.handleFocus = this.handleFocus.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleClick = this.handleClick.bind(this)
    }
    componentDidMount() {
      fadeIn('div#upvote-popup', 300)
      this.div.style.left = `${this.state.positionX}px`
      if(parseFloat(this.state.positionY)<150) {
        this.div.style.top = `${parseFloat(this.state.positionY) + 135}px`
      } else {
        this.div.style.top = `${this.state.positionY}px`
      }
      this.div.style.display = 'block'
    }
    componentDidUpdate() {
      this.div.style.left = `${this.props.positionX}px`
      if(parseFloat(this.state.positionY)<150) {
        this.div.style.top = `${parseFloat(this.state.positionY) + 135}px`
      } else {
        this.div.style.top = `${this.state.positionY}px`
      }
    }

    handleFocus(e) {
      e.preventDefault()
      this.field.style.border = '0.2rem solid #FF4500'
    }
    async handleChange(e) {
      e.preventDefault()
      await this.setState({ boostValue: parseFloat(e.target.value) })
      await this.validate()
      console.log(this.state.valid)
    }
    async handleClick(e) {
      this.props.handleBanner([
        'Waiting',
        'Upvote',
        this.state.memeId + '-upvote'
      ])
      e.preventDefault()
      if(this.state.valid) {
        await this.state.interface.methods
          .boostMeme(this.state.account, this.state.memeId, this.state.boostValue)
          .send({ from: this.state.account })
          .on('transactionHash', () => {
            this.props.handleBanner([
              'Writing',
              'Upvote',
              this.state.memeId + '-upvote'
            ])
          })
          .on('receipt', () => {
            this.props.handleBanner([
              'Success',
              'Upvote',
              this.state.memeId + '-upvote'
            ])
          })
          .catch(e => {
            this.props.handleBanner([
              'Cancel',
              'Upvote',
              this.state.memeId + '-upvote'
            ])
            console.error(e)
          })
        this.props.handleClose()
      }
    }

    async increment(e) {
      if(!this.state.boostValue && this.state.boostValue<this.state.boostValue-5) this.setState({ boostValue: 5 })
      else if(this.state.boostValue>this.state.umeBalance-5) this.setState({ boostValue: this.state.umeBalance })
      else this.setState({ boostValue: this.state.boostValue + 5 })
      this.field.style.border = '0.2rem solid #FF4500'
    }
    async decrement(e) {
      if(await !this.state.boostValue || await this.state.boostValue<5) {
        await this.setState({ boostValue: 0 })
      } else {
        await this.setState({ boostValue: this.state.boostValue - 5 })
      }
      this.field.style.border = '0.2rem solid #FF4500'
    }

    async validate() {
      if(this.state.boostValue>0 && this.state.umeBalance >= this.state.boostValue) {
        this.button.style.backgroundColor = '#FF4500'
        this.button.style.color = '#FFFFFF'
        this.button.style.cursor = 'pointer'
        await this.setState({ valid: true })
      } else {
        this.button.style.backgroundColor = '#667777'
        this.button.style.color = '#CCDDDD'
        this.button.style.cursor = 'default'
        await this.setState({ valid: false })
      }
    }

    render() {
      return(
        <div
          id="upvote-popup"
          ref={Ref=>this.div=Ref}
        >

          <form>
            <div id="boost">
              <label htmlFor="boost" id="boost" onClick={this.handleClick}>
                <span
                  id="boost"
                  ref={Ref=>this.button=Ref}
                >
                  Promote
                </span>
              </label>
              <div
                id="boost-field"
                onFocus={this.handleFocus}
                ref={Ref=>this.field=Ref}
              >
                <span id="decrease" onClick={async () => this.decrement().then(()=> this.validate())}>
                  -
                </span>
                { this.state.umeBalance
                    ? <input
                        type="number"
                        id="boost"
                        name="boost"
                        min="0"
                        max={this.state.umeBalance}
                        value={this.state.boostValue}
                        step="5"
                        onChange={this.handleChange}
                        ref={Ref=>this.input=Ref}
                        required>
                      </input>
                    : ''
              }
              <span id="increase" onClick={async () => this.increment().then(()=> this.validate())}>
                +
              </span>
            </div>
          </div>
        </form>
      </div>
    )
  }

}

export default UpvotePopup
