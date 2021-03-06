import React from 'react'
import { fadeIn } from '../../resources/Libraries/Animation'
import './DownvotePopup.css'

class DownvotePopup extends React.Component {
  constructor(props) {
    super(props)

    this.div = React.createRef()

      this.state = {
        account: this.props.account,
        memeId: this.props.memeId,
        umeBalance: parseInt(this.props.umeBalance),
        boostValue: 0,
        positionX: this.props.positionX,
        positionY: this.props.positionY,
        interface: this.props.interface
      }

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
      fadeIn('div#downvote-popup', 300)
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
      this.field.style.border = '0.2rem solid #4F56DF'
    }
    async handleChange(e) {
      e.preventDefault()
      await this.setState({ boostValue: parseInt(e.target.value )})
      this.validate()
      console.log(this.state.valid)
    }
    async handleClick(e) {
      this.props.handleBanner([
        'Waiting',
        'Downvote',
        this.state.memeId + '-downvote'
      ])
      e.preventDefault()
      if(this.state.valid) {
        await this.state.interface.methods
          .unBoostMeme(this.state.account, this.state.memeId, this.state.boostValue)
          .send({ from: this.state.account })
          .on('transactionHash', () => {
            this.props.handleBanner([
              'Writing',
              'Downvote',
              this.state.memeId + '-downvote'
            ])
          })
          .on('receipt', () => {
            this.props.handleBanner([
              'Success',
              'Downvote',
              this.state.memeId + '-downvote'
            ])
          })
          .catch(e => {
            this.props.handleBanner([
              'Cancel',
              'Downvote',
              this.state.memeId + '-downvote'
            ])
            console.error(e)
          })
        this.props.handleCloseProps()
      }
    }

    async increment() {
      if(!this.state.boostValue && this.state.boostValue<this.state.boostValue-5) this.setState({ boostValue: 5 })
      else if(this.state.boostValue>this.state.umeBalance-5) this.setState({ boostValue: this.state.umeBalance })
      else this.setState({ boostValue: this.state.boostValue + 5 })
      this.field.style.border = '0.2rem solid #4F56DF'
    }
    async decrement() {
      if(await !this.state.boostValue || await this.state.boostValue<5) {
        await this.setState({ boostValue: 0 })
      } else {
        await this.setState({ boostValue: this.state.boostValue - 5 })
      }
      this.field.style.border = '0.2rem solid #4F56DF'
    }

    async validate() {
      if(this.state.boostValue>0 && this.state.umeBalance >= this.state.boostValue) {
        this.button.style.backgroundColor = '#4F56DF'
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
          id="downvote-popup"
          ref={Ref=>this.div=Ref}
        >

          <form>
            <div id="boost">
              <label htmlFor="boost" id="boost" onClick={this.handleClick}>
                <span
                  id="boost"
                  ref={Ref=>this.button=Ref}
                >
                  Demote
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
                        step="5"
                        onChange={this.handleChange}
                        value={this.state.boostValue}
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

export default DownvotePopup
