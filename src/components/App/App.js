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

import Banner from '../Popups/Banner'
import NoWallet from '../Enter/NoWallet'
import NoMetaMask from '../Enter/NoMetaMask'
import NoEth from '../Enter/NoEth'
import NotSupported from '../Enter/NotSupported'
import PageLoader from '../Loader/PageLoader'

import UserInterface from '../../abis/UserInterface.json'
import UserStorage from '../../abis/UserStorage.json'
import MemeStorage from '../../abis/MemeStorage.json'
import MemeFactory from '../../abis/MemeFactory.json'
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
      writing: false,
      entered: false,
      creatingMeme: false,
      replying: false,
      editing: false,
      banners: [],
      offsetY: 0,
      help: true,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      metaMask: false,
      hasEth: false,
      validBrowser: false
    }

    this.app = React.createRef()
    this.main = React.createRef()

    this.handleEntered = this.handleEntered.bind(this)
    this.handleRegistered = this.handleRegistered.bind(this)

    this.handleCreateMeme = this.handleCreateMeme.bind(this)
    this.handleExitCreate = this.handleExitCreate.bind(this)

    this.handleReply = this.handleReply.bind(this)
    this.handleExitReply = this.handleExitReply.bind(this)
    this.handleToProfile = this.handleToProfile.bind(this)

    this.handleEdit = this.handleEdit.bind(this)
    this.handleExitEdit = this.handleExitEdit.bind(this)

    this.handleBanner = this.handleBanner.bind(this)
    this.handleImgHash = this.handleImgHash.bind(this)

    this.handleScroll = this.handleScroll.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }

  // lifecycle methods
  async componentDidMount() {
    await this.detectBrowser().catch(e=>console.error(e))
    window.addEventListener('resize', this.handleResize)
    // check if has previously loaded, so page can know to blur
    //if(localStorage.getItem('hasLoaded')!=='true')
    // check if account exists, load defaults if no account
    if(this.state.account===undefined) {
      // load Web3 & UME contracts
      await this.loadWeb3().catch(e => console.error(e))
      await this.loadContracts().catch(e => console.error(e))
    }
    // automatically emit account updates
    const checkEntered = localStorage.getItem('hasEntered'),
          checkHelp = localStorage.getItem('help')
    if(checkEntered) {
      this.setState({ entered: true })
    }
    if(checkHelp==='false') {
      this.setState({ help: false })
    }
    if(window.ethereum) {
      this.chainListen()
    }
  }
  componentDidUpdate() {
    let showBanner = false
    if(this.state.editing || this.state.writing || this.state.replying) {

    }
  }
  async componentWillUnmount() {
    window.clearInterval()
    fadeOut('.App', 1500)
  }

  // handles
  handleEntered(entered) {
    if(entered) {
      localStorage.setItem('hasEntered', 'true')
    }
    this.setState({ entered })
  }
  handleRegistered(e) {
    console.log('registered: ' + e)
    if(e==='writing')
      this.setState({ writing: true })
    else if(e==='registered') {
      expandToFadeOut('div.PageLoader', 1000)
      setTimeout(()=> this.setState({
        registered: true,
        writing: false
      }), 1000)
    }
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
    //const banner = document.querySelector('div.Banner')
    //banner.style.top = 'calc(1% + ' + e.target.scrollTop + 'px)'
  }
  handleResize(ContainerSize, event) {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    })
  }
  handleBanner(e) {
    const regex = /\W/g,
          id = e[2].replace(regex, '_'),
          loadingIndex = this.state.banners.findIndex(elem => elem.props.type === 'Loading'),
          index = this.state.banners.findIndex(elem => elem.props.message===e[1] && elem.props.bannerId===id),
          key = index!==-1 ? index : this.state.banners.length,
          banner = <Banner key={key} type={e[0]} message={e[1]} bannerId={id}/>
    if(e[0]==='Waiting') {
      this.setState({ banners: [...this.state.banners, banner] })
    }
    else if(e[0]==='Loading') {
      if(loadingIndex!==-1) {
        fadeOut('div#Banner-' + id,  200)
        setTimeout(() => {
          this.setState({
            banners: [...this.state.banners.slice(0, loadingIndex),
                      ...this.state.banners.slice(loadingIndex+1)]
          })
          this.setState({ banners: [...this.state.banners, banner] })
        }, 200)
      }
      else this.setState({ banners: [...this.state.banners, banner] })
    }
    else if(e[0]==='Writing' && index!==-1) {
      this.setState({
        banners: [...this.state.banners.slice(0, index), banner,
                  ...this.state.banners.slice(index+1)]
      })
    }
    else if(e[0]==='Success' && index!==-1) {
      this.setState({
        banners: [...this.state.banners.slice(0, index), banner,
                  ...this.state.banners.slice(index+1)]
      })
      fadeOut('div#Banner-' + id, 1000)
      setTimeout(() => {
        setTimeout(() => {
          this.setState({
            banners: [...this.state.banners.slice(0, index),
                      ...this.state.banners.slice(index+1)]
          })
        }, 400)
      }, 600)
    }
    else if(e[0]==='Cancel' && index!==-1) {
      fadeOut('div#Banner-' + id, 200)
      setTimeout(() => {
        console.log('index ' + index)
        this.setState({
          banners: [...this.state.banners.slice(0, index),
                    ...this.state.banners.slice(index+1)]
        })
      }, 200)
    }
  }
  handleImgHash(imgHash) {
    this.setState({ imgHash })
  }

  async detectBrowser() {
    let userAgentString = navigator.userAgent,
        chromeAgent = userAgentString.indexOf('Chrome') > -1,
        firefoxAgent = userAgentString.indexOf('Firefox') > -1,
        safariAgent = userAgentString.indexOf('Safari') > -1
    if (chromeAgent || firefoxAgent || (chromeAgent && safariAgent)) {
      this.setState({ validBrowser: true })
    }
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
          writing: false,
          registered: false,
          contractLoading: true
        })
        localStorage.clear()
        this.loadContracts().catch(e => console.error(e))
        this.request()
      } else if (this.state.account===undefined) { // account works
        console.log('account connected')
        this.setState({
          writing: false,
          registered: false,
          contractLoading: true
        })
        this.loadContracts().catch(e => console.error(e))
      }
    })
    window.ethereum.on('message', message => {
      console.log('chain change detected')
      console.log(message)

      //this.setState({ bannerActive: false })
      //this.setState({ contractLoading: true })
      //this.loadContracts().catch(e => console.error(e))
    })
  }
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      this.setState({
        metaMask: true,
        validBrowser: true
      })
      this.request()
    } else if(window.web3) {
      this.setState({
        metaMask: true,
        validBrowser: true
      })
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      this.setState({ metaMask: false })
      //window.alert('Non-Ethereum browser detected. You should consider trying Metamask!')
    }
  }

  async loadContracts() {
    const web3 = window.web3,
          accounts = await web3.eth.getAccounts(),
          network = parseInt(await window.ethereum.networkVersion),
          balance = parseInt(await web3.eth.getBalance(accounts[0]))
    this.setState({ account: accounts[0] })

    if (await network===3 && await balance>0) {
      this.setState({ hasEth: true })
    }
    // retrieve NetId into constants
    const netId = await web3.eth.net.getId(),
          umeNetData = UME.networks[netId],
          interfaceNetData = UserInterface.networks[netId],
          userStorageNetData = UserStorage.networks[netId],
          memeStorageNetData = MemeStorage.networks[netId],
          memeFactoryNetData = MemeFactory.networks[netId]

    // check if Contract netData is valid
    if(umeNetData && interfaceNetData && userStorageNetData && memeStorageNetData) {
      const ume = new web3.eth.Contract(UME.abi, umeNetData.address),
            memeStorage = new web3.eth.Contract(MemeStorage.abi, memeStorageNetData.address),
            memeFactory = new web3.eth.Contract(MemeFactory.abi, memeFactoryNetData.address),
            userStorage = new web3.eth.Contract(UserStorage.abi, userStorageNetData.address),
            uInterface = new web3.eth.Contract(UserInterface.abi, interfaceNetData.address)
      // app state from BlockChain
      this.setState({
        ume,
        userStorage,
        memeStorage,
        memeFactory,
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
          expandToFadeOut('div.PageLoader', 1000)
          fadeOut('div#Border-Spinner', 150)
          setTimeout(()=> {
            this.setState({ contractLoading: false })
            //blurToFadeIn('div.App', 1000)
          }, 1000)
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
      window.alert('UME not deployed to detected network.\n' +
                    'Please connect to Ropsten Ethereum Test Network.')
      this.setState({ contractLoading: false })
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
      this.setState({
        writing: false,
        registered: true
      })
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
      >
        <div className="Banners">{ this.state.banners }</div>
        { !this.state.validBrowser
            ? <NotSupported/>
            : this.state.contractLoading && this.state.account!==undefined && !this.state.registered
                ? <PageLoader/>
                : this.state.account===undefined
                  ? this.state.metaMask
                      ? <NoWallet />
                      : <NoMetaMask />
                  : this.state.registered && !this.state.writing
                      ? <div
                          id="App-body"
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
                                  handleBanner={this.handleBanner}
                                  imgHash={this.state.imgHash}
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
                                    handleBanner={this.handleBanner}
                                    imgHash={this.state.imgHash}
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
                                      imgHash={this.state.imgHash}
                                      handleExitEdit={this.handleExitEdit}
                                      handleBanner={this.handleBanner}
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
                            handleBanner={this.handleBanner}
                            handleImgHash={this.handleImgHash}
                            handleProfileChange={this.handleProfileChange}
                            ref={Ref=>this.main=Ref}
                          />
                        </div>
                      : this.state.entered
                        ? this.state.writing
                            ? <PageLoader/>
                            : !this.state.hasEth
                                ? <NoEth/>
                                : <CreateUser
                                    account={this.state.account}
                                    handleRegistered={this.handleRegistered}
                                    interface={this.state.interface}
                                    userStorage={this.state.userStorage}
                                    handleBanner={this.handleBanner}
                                  />
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
