import React, { Component } from 'react'
import Web3 from 'web3'
import { ethErrors, serializeError } from 'eth-rpc-errors'
import Identicon from 'identicon.js'
import './App.css';
import NavBar from '../NavBar/NavBar'
import SearchBar from '../SearchBar/SearchBar'
import Timeline from '../Timeline/Timeline'
import CreateUser from '../CreateUser/CreateUser'

import UserInterface from '../../abis/UserInterface.json'
import UserFactory from '../../abis/UserFactory.json'
import UserStorage from '../../abis/UserStorage.json'
import MemeFactory from '../../abis/MemeFactory.json'
import MemeStorage from '../../abis/MemeStorage.json'
import UME from '../../abis/UME.json'

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

class App extends Component {
  async UNSAFE_componentWillMount() {
    await this.loadWeb3()
    await this.loadContracts()
  }
  async componentDidMount() {
    setInterval(() => this.loadContracts(), 1000)
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
            throw ethErrors.provider.unauthorized()
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
        loading: false
      })
      //if(userStorage.methods.getAddr(this.state.account).call({from:this.state.account}) != ETHER_ADDRESS) {
     // }
    }
    else {
      window.alert('UME not deployed to detected network')
    }
  }

  constructor(props) {
    super(props)


    this.state = {
      account: '',
      ume: null,
      memes: [],
      loading: true,
      registered: false
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
                  loading={this.state.loading}
                />
              </div>
              <div className="App-body">
                <div className="App-subheader">
                  <section className="App-subheader" id="title">
                    <a href="#home">
                      <p>
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
                  loading={this.state.loading}
                />
              </div>
            </div>
            : <CreateUser
                account={this.state.account}
              />
        }
      </div>
    );
  }
}

export default App;
