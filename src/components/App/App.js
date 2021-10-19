import React from 'react'
import Web3 from 'web3'
import { expandToFadeOut, blurToFadeIn, fadeOut} from '../../resources/Libraries/Animation'
import './App.css';
import Main from '../Main/Main'
import Enter from '../Enter/Enter'
import CreateUser from '../CreateUser/CreateUser'
import CreateMeme from '../CreateMeme/CreateMeme'
import Reply from '../Reply/Reply'
import EditProfile from '../EditProfile/EditProfile'
import NoWallet from '../NoWallet/NoWallet'
import PageLoader from '../Loader/PageLoader'

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
      umeBalance: null,
      memeIdsByBoost: [],
      connected: false,
      contractLoading: true,
      registered: false,
      entered: false,
      creatingMeme: false,
      replying: false,
      editing: false,
      offsetY: 0,
      appHeight: window.innerHeight
    }

    this.app = React.createRef()
    this.main = React.createRef()

    this.handleEntered = this.handleEntered.bind(this)

    this.handleCreateMeme = this.handleCreateMeme.bind(this)
    this.handleExitCreate = this.handleExitCreate.bind(this)

    this.handleReply = this.handleReply.bind(this)
    this.handleExitReply = this.handleExitReply.bind(this)
    this.handleToProfile = this.handleToProfile.bind(this)

    this.handleEdit = this.handleEdit.bind(this)
    this.handleExitEdit = this.handleExitEdit.bind(this)

    this.handleScroll = this.handleScroll.bind(this)
  }

  // lifecycle methods
  async componentDidMount() {
    // check if has previously loaded, so page can know to blur
    //if(localStorage.getItem('hasLoaded')!=='true')
    // check if account exists, load defaults if no account
    if(this.state.account===undefined) {
      // load Web3 & UME contracts
      await this.loadWeb3().catch(e => console.error(e))
      await this.loadContracts().catch(e => console.error(e))
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
  componentDidUpdate() {
    console.log(window.innerHeight)
    console.log(this.state.appHeight)
  }
  async componentWillUnmount() {
    window.clearInterval()
    fadeOut('.App', 1500)
  }

  // handles
  handleEntered(entered) {
    this.setState({ entered })
  }
  handleToProfile(e) {
    this.main.handleToProfile(e)
  }

  handleCreateMeme(creatingMeme) {
    const app = document.querySelectorAll('div.App')
    app.forEach(e => e.style.overflow = 'hidden')
    this.setState({ creatingMeme })
  }
  handleExitCreate(creatingMeme) {
    const app = document.querySelectorAll('div.App')
    app.forEach(e => e.style.overflow = 'auto')
    this.setState({ creatingMeme })
  }

  handleReply(replying) {
    const app = document.querySelectorAll('div.App')
    app.forEach(e => e.style.overflow = 'hidden')
    this.setState({ replying })
  }
  handleExitReply(replying) {
    const app = document.querySelectorAll('div.App')
    app.forEach(e => e.style.overflow = 'auto')
    this.setState({ replying })
  }
  handleEdit(editing) {
    const app = document.querySelectorAll('div.App')
    app.forEach(e => e.style.overflow = 'hidden')
    this.setState({ editing })
  }
  handleExitEdit(editing) {
    const app = document.querySelectorAll('div.App')
    app.forEach(e => e.style.overflow = 'auto')
    this.setState({ editing })
  }
  handleScroll(e) {
    if(e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight+150) {
      this.setState({ atBottom: true })
    }
    else this.setState({ atBottom: false })
    this.setState({
      offsetY: e.target.scrollTop,
      appHeight: e.target.clientHeight
    })
  }

  async request() {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .catch((e) => {
        if(e.code === 4001) {
          this.setState({ connected: false })
          console.log('Please connect to MetaMask.')
          this.request()
        } else {
          this.setState({ connected: false })
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
      console.log(message)
      //this.setState({ contractLoading: true })
      //this.loadContracts().catch(e => console.error(e))
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
    const web3 = window.web3,
          accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // retrieve NetId into constants
    const netId = await web3.eth.net.getId(),
          umeNetData = UME.networks[netId],
          interfaceNetData = UserInterface.networks[netId],
          userStorageNetData = UserStorage.networks[netId],
          memeStorageNetData = MemeStorage.networks[netId]

    // check if Contract netData is valid
    if(umeNetData && interfaceNetData && userStorageNetData && memeStorageNetData) {
      const ume = new web3.eth.Contract(UME.abi, umeNetData.address),
            memeStorage = new web3.eth.Contract(MemeStorage.abi, memeStorageNetData.address),
            userStorage = new web3.eth.Contract(UserStorage.abi, userStorageNetData.address),
            uInterface = new web3.eth.Contract(UserInterface.abi, interfaceNetData.address)
      // app state from BlockChain
      this.setState({
        ume,
        userStorage,
        memeStorage,
        interface: uInterface
      })
      // retrieve Blockchain data for development purposes, display to console
      const memeCount = await memeStorage.methods.memeCount().call().catch(e=>console.error(e)),
            userMemeCount = await userStorage.methods.getPosts(this.state.account).call().then(e => e.length).catch(e=>console.error(e)),
            userCount = await userStorage.methods.userCount().call().catch(e=>console.error(e)),
            umeBalance = await ume.methods.balanceOf(this.state.account).call().then(elem => parseInt(elem)).catch(e=>console.error(e))
      this.setState({
        memeCount,
        userMemeCount,
        umeBalance
      })

      console.log('meme count: ' + memeCount)
      console.log('user meme count: ' + userMemeCount)
      console.log('user count: ' + userCount)

      // load Account
      await this.loadAccount().catch(e => console.error(e))
      // mark contract as loaded
      if(this.state.contractLoading) {
        if(this.state.registered) {
          expandToFadeOut('div.PageLoader', 2000)
          fadeOut('div#Border-Spinner', 200)
          setTimeout(()=> {
            this.setState({ contractLoading: false })
            blurToFadeIn('div.App', 1000)
          }, 2000)
        } else {
          fadeOut('div#Border-Spinner', 800)
          fadeOut('div.PageLoader', 1000)
          setTimeout(()=> {
            this.setState({ contractLoading: false })
          }, 1000)
        }
      }
    }
    else {
      window.alert('UME not deployed to detected network')
    }
  }

  async loadAccount() {
    // helper function to return whether or not user exists on blockchain
    const profileExists = async () => {
      if(this.state.account!==undefined)
        return await this.state.userStorage.methods.userExists(this.state.account).call().catch(e=>console.error(e))
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
      <div
        className="App"
        onResize={this.handleResize}
      >
        { this.state.contractLoading && this.state.account!==undefined
            ? <PageLoader/>
            : this.state.account===undefined
              ? <NoWallet />
              : this.state.registered
                ? <div
                    className="App"
                    onScroll={this.handleScroll}
                    ref={Ref=>this.app=Ref}
                  >
                    { this.state.creatingMeme || this.state.replying || this.state.editing
                      ? this.state.creatingMeme
                        ? <CreateMeme
                            account={this.state.account}
                            offsetY={this.state.offsetY}
                            handleExitCreate={this.handleExitCreate}
                            userStorage={this.state.userStorage}
                            interface={this.state.interface}
                          />
                        : this.state.replying
                          ? <Reply
                              account={this.state.account}
                              username={this.state.replying[0]}
                              address={this.state.replying[1]}
                              author={this.state.replying[2]}
                              text={this.state.replying[3]}
                              memeId={this.state.replying[4]}
                              parentId={this.state.replying[5]}
                              originId={this.state.replying[6]}
                              offsetY={this.state.offsetY}
                              handleExitReply={this.handleExitReply}
                              handleToProfile={this.handleToProfile}
                              userStorage={this.state.userStorage}
                              memeStorage={this.state.memeStorage}
                              interface={this.state.interface}
                            />
                          : this.state.editing
                            ? <EditProfile
                                account={this.state.account}
                                username={this.state.editing[0]}
                                address={this.state.editing[1]}
                                bio={this.state.editing[2]}
                                offsetY={this.state.offsetY}
                                handleExitEdit={this.handleExitEdit}
                                userStorage={this.state.userStorage}
                                interface={this.state.interface}
                              />
                            : ''
                      : ''
                    }
                    <Main
                      account={this.state.account}
                      userStorage={this.state.userStorage}
                      memeStorage={this.state.memeStorage}
                      interface={this.state.interface}
                      ume={this.state.ume}
                      memeCount={this.state.memeCount}
                      userMemeCount={this.state.userMemeCount}
                      umeBalance={this.state.umeBalance}
                      memeIdsByBoost={this.state.memeIdsByBoost}
                      contractLoading={this.state.contractLoading}
                      atBottom={this.state.atBottom}
                      offsetY={this.state.offsetY}
                      handleCreateMeme={this.handleCreateMeme}
                      handleReply={this.handleReply}
                      handleEdit={this.handleEdit}
                      handleProfileChange={this.handleProfileChange}
                      ref={Ref=>this.main=Ref}
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
                      contractLoading={this.state.contractLoading}
                    />
        }
      </div>
    );
  }
}

export default App;
