import React from 'react'
import Web3 from 'web3'
import { blurToFadeIn, fadeOut} from '../../resources/Libraries/Animation'
import './App.css';
import Main from '../Main/Main'
import Enter from '../Enter/Enter'
import CreateUser from '../CreateUser/CreateUser'
import CreateMeme from '../CreateMeme/CreateMeme'
import Reply from '../Reply/Reply'
import NoWallet from '../NoWallet/NoWallet'

import UserInterface from '../../abis/UserInterface.json'
import UserStorage from '../../abis/UserStorage.json'
import MemeStorage from '../../abis/MemeStorage.json'
import UME from '../../abis/UME.json'


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      account: undefined,
      uInterface: null,
      uStorage: null,
      memeStorage: null,
      ume: null,
      memeIdsByBoost: [],
      contractLoading: true,
      registered: false,
      entered: false,
      creatingMeme: false,
      replying: false
    }

    this.handleEntered = this.handleEntered.bind(this)
    this.handleCreateMeme = this.handleCreateMeme.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleExitCreate = this.handleExitCreate.bind(this)
    this.handleExitReply = this.handleExitReply.bind(this)
  }

  handleEntered(entered) {
    this.setState({ entered })
  }
  handleCreateMeme(creatingMeme) {
    this.setState({ creatingMeme })
  }
  handleReply(replying) {
    this.setState({ replying })
  }
  handleExitCreate(creatingMeme) {
    this.setState({ creatingMeme })
  }
  handleExitReply(replying) {
    this.setState({ replying })
  }

  async componentDidMount() {
    console.log('mount')
    if(localStorage.getItem('hasLoaded')!=='true')
      blurToFadeIn('div.App', 2000)
    // check if account exists, load defaults if no account
    if(this.state.account===undefined) {
      console.log('first load')
      await this.loadWeb3().catch(e => console.error(e))
      await this.loadContracts().catch(e => console.error(e))
      /*
      setInterval(() => {
        this.loadContracts()
      }, 5000)
      */
    }
    // automatically emit account updates
    const checkEntered = localStorage.getItem('hasEntered')
    if(checkEntered) {
      this.setState({ entered: true })
    }
    if(window.ethereum) {
      this.chainListen()
    }
  }
  async componentWillUnmount() {
    window.clearInterval()
    fadeOut('.App', 1500)
  }

  async request() {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .catch((e) => {
        if(e.code === 4001) {
          console.log('Please connect to MetaMask.')
          this.request()
        } else {
          console.error(e)
        }
      })
  }
  chainListen() {
    window.ethereum.on('accountsChanged', account => {
      console.log('account change detected ' + account)
      if (this.state.account!==undefined) {
        console.log('account disconnected')
        this.setState({
          registered: false,
          contractLoading: true
        })
        localStorage.clear()
        this.loadContracts().catch(e => console.error(e))
        this.request()
      } else if (this.state.account===undefined) { // account works
        console.log('account connected')
        this.setState({ contractLoading: true })
        this.loadContracts().catch(e => console.error(e))
      }
    })
    window.ethereum.on('message', message => {
      console.log('chain change detected')
        this.setState({ contractLoading: true })
      this.loadContracts().catch(e => console.error(e))
    })
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      this.request()
    } else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying Metamask!')
    }
  }

  async loadContracts() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const netId = await web3.eth.net.getId()
    const umeNetData = UME.networks[netId]
    const interfaceNetData = UserInterface.networks[netId]
    const userStorageNetData= UserStorage.networks[netId]
    const memeStorageNetData= MemeStorage.networks[netId]

    if(umeNetData && interfaceNetData && userStorageNetData && memeStorageNetData) {
      const ume = new web3.eth.Contract(UME.abi, umeNetData.address)
      const memeStorage = new web3.eth.Contract(MemeStorage.abi, memeStorageNetData.address)
      const userStorage = new web3.eth.Contract(UserStorage.abi, userStorageNetData.address)
      const uInterface = new web3.eth.Contract(UserInterface.abi, interfaceNetData.address)
      // app state from BlockChain
      this.setState({
        ume,
        userStorage,
        memeStorage,
        interface: uInterface
      })
      let memeCount = await memeStorage.methods.memeCount().call()
      console.log('meme count: ' + memeCount)
      const userMemeCount = await userStorage.methods.getPosts(this.state.account).call().then(e => e.length)
      this.setState({
        memeCount,
        userMemeCount
      })
      console.log('user meme count: ' + userMemeCount)
      const userCount = await userStorage.methods.userCount().call()
      console.log('user count: ' + userCount)
      this.setState({
        contractLoading: false
      })

      console.log(this.state.contractLoading)
      await this.loadAccount().catch(e => console.error(e))
    }
    else {
      window.alert('UME not deployed to detected network')
    }
  }

  async loadAccount() {
    const profileExists = async () => {
      if(this.state.account!==undefined)
        return await this.state.userStorage.methods.userExists(this.state.account).call()
    }
    if(await profileExists()) {
      console.log('account exists')
      this.setState({ registered: true })
    } else if(window.ethereum) {
      this.setState({ registered: false })
      console.log('wallet not connected')
    } else if(await profileExists()===false) {
      this.setState({ registered: false })
      console.log('account doesn\'t exist')
    }
  }

  render() {
    return (
      <div className="App">
        { this.state.account!==undefined
          ? this.state.registered
            ? <div className="App">
                { this.state.creatingMeme || this.state.replying
                  ? !this.state.replying
                    ? <CreateMeme
                        account={this.state.account}
                        handleExitCreate={this.handleExitCreate}
                        userStorage={this.state.userStorage}
                        interface={this.state.interface}
                      />
                    : <Reply
                        account={this.state.account}
                        username={this.state.replying[0]}
                        address={this.state.replying[1]}
                        author={this.state.replying[2]}
                        text={this.state.replying[3]}
                        memeId={this.state.replying[4]}
                        parentId={this.state.replying[5]}
                        originId={this.state.replying[6]}
                        handleExitReply={this.handleExitReply}
                        userStorage={this.state.userStorage}
                        memeStorage={this.state.memeStorage}
                        interface={this.state.interface}
                      />
                  : ''
                }
                <Main
                  account={this.state.account}
                  userStorage={this.state.userStorage}
                  memeStorage={this.state.memeStorage}
                  interface={this.state.interface}
                  memeCount={this.state.memeCount}
                  userMemeCount={this.state.userMemeCount}
                  memeIdsByBoost={this.state.memeIdsByBoost}
                  contractLoading={this.state.contractLoading}
                  handleCreateMeme={this.handleCreateMeme}
                  handleReply={this.handleReply}
                />
              </div>
            : this.state.entered
              ? <CreateUser
                  account={this.state.account}
                  hasEntered={this.state.entered}
                  interface={this.state.interface}
                  / >
              : <Enter
                  account={this.state.account}
                  hasEntered={this.handleEntered}
                />
          : <NoWallet />
        }
      </div>
    );
  }
}

export default App;
