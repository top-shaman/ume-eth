import React from 'react'
import './UpvotePopup.css'
import Plus from '../../resources/+.svg'
import Minus from '../../resources/-.svg'

class UpvotePopup extends React.Component {
  constructor(props) {
    super(props)

    this.div = React.createRef()

      this.state = {
        account: this.props.account,
        memeId: this.props.memeId,
        umeBalance: this.props.umeBalance,
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
      console.log(this.state.umeBalance)
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
      this.field.style.border = '0.2rem solid #00CC89'
    }
    async handleChange(e) {
      e.preventDefault()
      await this.setState({ boostValue: e.target.value })
      this.validate()
      console.log(this.state.valid)
    }
    async handleClick(e) {
      e.preventDefault()
      console.log(this.state.boostValue)
      console.log(this.state.umeBalance)
      if(this.state.valid) {
        await this.state.interface.methods.boostMeme(this.state.account, this.state.memeId, this.state.boostValue).send({ from: this.state.account })
        this.props.handleClose()
      }
    }

    increment(e) {
      e.preventDefault()
      this.input.stepUp()
    }
    decrement(e) {
      e.preventDefault()
      this.input.stepDown()
    }

    async validate() {
      if(this.state.boostValue>0 && this.state.umeBalance >= this.state.boostValue) {
        this.button.style.backgroundColor = '#00CC89'
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
                  Boost
                </span>
              </label>
              <div
                id="boost-field"
                onFocus={this.handleFocus}
                ref={Ref=>this.field=Ref}
              >
                <span id="decrease" onClick={this.decrement}>
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
                        list="defaultNumbers"
                        onChange={this.handleChange}
                        ref={Ref=>this.input=Ref}
                        required>
                      </input>
                    : ''
              }
              <span id="increase" onClick={this.increment}>
                +
              </span>
            </div>
            <datalist id="defaultNumbers">
              <option value="5"/>
              <option value="10"/>
              <option value="25"/>
              <option value="50"/>
              <option value="100"/>
            </datalist>
          </div>
        </form>
      </div>
    )
  }

}

export default UpvotePopup
