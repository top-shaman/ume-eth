import react, {Component} from 'react'
import Web3 from 'web3'
import UserInterface from '../../abis/UserInterface.json'
import Meme from "../Meme/Meme"
import "./Timeline.css"


class Timeline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ume: null,
      memes: [],
      uInterface: null,
      memeStorage: null,
      memeCount: null,
      loading: true
    }
  }
  // helper functions
  async toBytes32(s) {
    return await window.web3.utils.fromAscii(s)
  }
  async fromBytes32(b) {
    return await window.web3.utils.toAscii(b)
  }

  async componentWillMount() {
    await this.loadTimeline()
  }

  async loadTimeline() {
    /*
    this.setState({ account: this.props.account })
    if(await this.state.memeCount>0) {
      for(let i = 1; i <= this.state.memeCount; i++) {
        const memeId = await this.props.uInterface.methods
          .encode(i).call({ from: this.state.account })
        const meme = await this.props.memeStorage.methods.memes(memeId).call()
        this.setState({ memes: [...this.state.memes, meme] })
      }
      this.setState({
        memes: this.state.memes.sort((a,b) => b.tipAmount - a.tipAmount),
        loading: false
      })
    }
    else {
      return "No memes uploaded yet"
    }
    */
  }



  render() {
    return(
      <div className="timeline">
        { this.state.loading
          ? <div id="loader" className="Content">
              <p>Loading...</p>
            </div>
          : <div id="loaded" className="Content">
               <Meme />
               {this.state.memeCount}
            </div>
        }
      </div>
    );
  }
}

export default Timeline
