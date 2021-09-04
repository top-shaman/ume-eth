import React from 'react'
import Web3 from 'web3'
import { ethErrors, serializeError } from 'eth-rpc-errors'
import Identicon from 'identicon.js'
import './App.css';
import NavBar from '../NavBar/NavBar'
import SearchBar from '../SearchBar/SearchBar'
import Timeline from '../Timeline/Timeline'
import Enter from '../Enter/Enter'
import CreateUser from '../CreateUser/CreateUser'
import CreateMeme from '../CreateMeme/CreateMeme'

import UserInterface from '../../abis/UserInterface.json'
import UserFactory from '../../abis/UserFactory.json'
import UserStorage from '../../abis/UserStorage.json'
import MemeFactory from '../../abis/MemeFactory.json'
import MemeStorage from '../../abis/MemeStorage.json'
import UME from '../../abis/UME.json'

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

export function easeInOut (t, b, c) {
  if ((t /= 1 / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      account: undefined,
      uInterface: null,
      uStorage: null,
      memeStorage: null,
      ume: null,
      memes: [],
      loading: true,
      walletRequest: false,
      registered: false,
      entered: false
    }

    this.handleEntered = this.handleEntered.bind(this)
    this.handleCreateMeme = this.handleCreateMeme.bind(this)
  }

  handleEntered(hasEntered) {
    this.setState({ entered: hasEntered })
  }
  handleCreateMeme(handleMeme) {
    this.setState({ creatingMeme: handleMeme })
    this.blur('div.App-header', 100)
    this.blur('div.App-body', 100)
    console.log(this.state.creatingMeme)
  }

  async componentDidMount() {
    this.fadeIn('.App', 2000)
    // check if account exists, load defaults if no account
    if(this.state.account===undefined) {
      console.log('first load')
      await this.loadWeb3()
      await this.loadContracts()
      setInterval(() => {
        this.loadContracts()
      }, 5000)
    }
    // automatically emit account updates
    const checkEntered = localStorage.getItem('hasEntered')
    if(checkEntered)
      this.setState({ entered: true })
    if(window.ethereum) {
      this.listen()
    }
  }
  async componentWillUnmount() {
    window.clearInterval()
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
  listen() {
    window.ethereum.on('accountsChanged', account => {
      console.log('account change detected ' + account)
      if (this.state.account!==undefined) {
        console.log('account disconnected')
        this.setState({ registered: false })
        localStorage.clear()
        this.loadContracts()
        this.request()
      } else if (this.state.account===undefined) { // account works
        console.log('account connected')
        this.loadContracts()
      }
    })
    window.ethereum.on('chainChanged', change => {
      console.log('chain change detected')
      this.loadContracts(
      window.location.reload()
    )})
  }
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      //await window.ethereum.enable()
      //if(!this.state.account) this.listen()
      this.request()
      //
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
      const userCount = await userStorage.methods.userCount().call()
      console.log('user count: ' + userCount)
      await this.loadProfile()
      this.setState({
        loading: false
      })
    }
    else {
      window.alert('UME not deployed to detected network')
    }
  }

  async loadProfile() {
    if(await this.profileExists()) {
      this.setState({ registered: true })
      //this.loadContracts()
    }
    else this.setState({ registerd: false })
  }
  async profileExists() {
    if(this.state.account!==undefined) {
      return await this.state.userStorage.methods.userExists(this.state.account).call()
    }
    //this.loadContracts()
  }

  fadeIn(element, duration) {
    const elements = document.querySelectorAll(element)
    let start = performance.now()
    requestAnimationFrame(function animation(time) {
      let fractionOfTime = (time - start) / duration
      if (fractionOfTime > 1) fractionOfTime = 1
      let progress = easeInOut(fractionOfTime, 0, 1)
      elements.forEach(e => {
        e.style.opacity = progress
        e.style.filter = 'blur(' + (3/progress - 3) + 'px)'
      })
      if (fractionOfTime < 1) requestAnimationFrame(animation)
    })
  }
  fadeOut(element, duration) {
    const elements = document.querySelectorAll(element)
    let start = performance.now()
    requestAnimationFrame(function animation(time) {
      let fractionOfTime = (time - start) / duration
      if (fractionOfTime > 1) fractionOfTime = 1
      let progress = easeInOut(fractionOfTime, 1, -1)
      elements.forEach(e => e.style.opacity = progress)
      if (fractionOfTime < 1) requestAnimationFrame(animation)
    })
  }
  blur(element, duration) {
    const elements = document.querySelectorAll(element)
    let start = performance.now()
    requestAnimationFrame(function animation(time) {
      let fractionOfTime = (time - start) / duration
      if (fractionOfTime > 1) fractionOfTime = 1
      let progress = easeInOut(fractionOfTime, 0, 1)
      elements.forEach(e => {
        e.style.filter = 'blur(' + (4 * progress) + 'px)'
      })
      if (fractionOfTime < 1) requestAnimationFrame(animation)
    })
  }

  render() {

    return (
      <div className="App">
        { this.state.account!==undefined
          ? this.state.registered
            ? <div className="App">
                { this.state.creatingMeme
                  ? <CreateMeme /> : ''
                }
                <div className="App-header">
                  <NavBar
                    account={this.state.account}
                    loading={this.state.loadingContract}
                    handleMeme={this.handleCreateMeme}
                  />
                </div>
                <div className="App-body">
                  <div className="App-subheader">
                    <section className="App-subheader" id="title">
                      <a href="#home">
                        <p id="subheader">
                          uMe
                        </p>
                      </a>
                    </section>
                    <section className="App-subheader" id="searchBar">
                      <SearchBar
                        userStorage={this.state.userStorage}
                        memeStorage={this.state.memeStorage}
                      />
                    </section>
                  </div>
                  <Timeline
                    account={this.state.account}
                    userStorage={this.state.userStorage}
                    memeStorage={this.state.memeStorage}
                    memeCount={this.state.memeCount}
                    interface={this.state.interface}
                    loading={this.state.loading}
                  />
                </div>
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
              : <div className="NoWallet">
                  <p className="NoWallet" id="p1">Please connect MetaMask Wallet</p>
                  <p className="NoWallet" id="p2">(You may have to refresh page)</p>
                </div>
        }
      </div>
    );
  }
}

export default App;
