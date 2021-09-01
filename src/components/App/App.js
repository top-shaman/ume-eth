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

import UserInterface from '../../abis/UserInterface.json'
import UserFactory from '../../abis/UserFactory.json'
import UserStorage from '../../abis/UserStorage.json'
import MemeFactory from '../../abis/MemeFactory.json'
import MemeStorage from '../../abis/MemeStorage.json'
import UME from '../../abis/UME.json'

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      account: '',
      ume: null,
      memes: [],
      loadingContract: true,
      walletConnected: false,
      registered: false,
      entered: false
    }

    this.handleEntered = this.handleEntered.bind(this)

  }

  handleEntered(hasEntered) {
    this.setState({ entered: hasEntered })
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadContracts()
    // automatically emit account updates
    window.ethereum.on('accountsChanged', accounts => {
      console.log('account change detected')
      this.loadContracts()
    })
    const checkEntered = localStorage.getItem('hasEntered')
    if(checkEntered)
      this.setState({ entered: true })
  }
  async componentDidUpdate() {
    if(!this.state.walletConnected) {
      localStorage.clear()
      setInterval(async () => await this.loadWeb3(), 3000)
    }
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      //await window.ethereum.enable()
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .catch((e) => {
          if(e.code === 4001) {
            console.log('Please connect to MetaMask.')
          } else {
            console.error(e)
          }
        })
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
      const userStorage = new web3.eth.Contract(UserStorage.abi, interfaceNetData.address)
      const uInterface = new web3.eth.Contract(UserInterface.abi, userStorageNetData.address)
      const memeStorage = new web3.eth.Contract(MemeStorage.abi, memeStorageNetData.address)
      // app state from BlockChain
      this.setState({
        ume,
        userStorage,
        uInterface,
        memeStorage
      })
      let memeCount = await memeStorage.methods.memeCount().call()
      console.log(memeCount)
      //const memeCount = await memeStorage.methods
      //  .memeCount().call({from: this.state.account}).then(e => e.toNumber())
      //console.log(memeCount)
      //this.setState({ memeCount })
      this.setState({
        loadingContract: false
      })
      //if(userStorage.methods.getAddr(this.state.account).call({from:this.state.account}) != ETHER_ADDRESS) {
     // }
    }
    else {
      window.alert('UME not deployed to detected network')
    }
  }


  render() {

    return (
      <div className="App">
        { this.state.registered
          ? <div className="App">
              <div className="App-header">
                <NavBar
                  account={this.state.account}
                  loading={this.state.loadingContract}
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
                  memeStorage={this.state.memeStorage}
                  memeCount={this.state.memeCount}
                  uInterface={this.state.uInterface}
                  loading={this.state.loadingContract}
                />
              </div>
            </div>
            : this.state.entered
              ? <CreateUser
                  account={this.state.account}
                  hasEntered={this.state.entered}
                / >
              : this.state.account===undefined
                ? <p className="NoWallet" id="p1">Please connect MetaMask Wallet</p>
                : <Enter
                    account={this.state.account}
                    hasEntered={this.handleEntered}
                  />
        }
      </div>
    );
  }
}

export default App;
