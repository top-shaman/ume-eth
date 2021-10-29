"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.parse-int.js");

var _react = _interopRequireDefault(require("react"));

var _web = _interopRequireDefault(require("web3"));

var _Animation = require("../../resources/Libraries/Animation");

require("./App.css");

var _Main = _interopRequireDefault(require("../Main/Main"));

var _Enter = _interopRequireDefault(require("../Enter/Enter"));

var _CreateUser = _interopRequireDefault(require("../CreateUser/CreateUser"));

var _CreateMeme = _interopRequireDefault(require("../CreateMeme/CreateMeme"));

var _Reply = _interopRequireDefault(require("../Reply/Reply"));

var _EditProfile = _interopRequireDefault(require("../EditProfile/EditProfile"));

var _Banner = _interopRequireDefault(require("../Popups/Banner"));

var _NoWallet = _interopRequireDefault(require("../Enter/NoWallet"));

var _NoMetaMask = _interopRequireDefault(require("../Enter/NoMetaMask"));

var _NoEth = _interopRequireDefault(require("../Enter/NoEth"));

var _PageLoader = _interopRequireDefault(require("../Loader/PageLoader"));

var _UserInterface = _interopRequireDefault(require("../../abis/UserInterface.json"));

var _UserStorage = _interopRequireDefault(require("../../abis/UserStorage.json"));

var _MemeStorage = _interopRequireDefault(require("../../abis/MemeStorage.json"));

var _MemeFactory = _interopRequireDefault(require("../../abis/MemeFactory.json"));

var _UME = _interopRequireDefault(require("../../abis/UME.json"));

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/App/App.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class App extends _react.default.Component {
  constructor(props) {
    super(props);
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
      hasEth: false
    };
    this.app = /*#__PURE__*/_react.default.createRef();
    this.main = /*#__PURE__*/_react.default.createRef();
    this.handleEntered = this.handleEntered.bind(this);
    this.handleRegistered = this.handleRegistered.bind(this);
    this.handleCreateMeme = this.handleCreateMeme.bind(this);
    this.handleExitCreate = this.handleExitCreate.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleExitReply = this.handleExitReply.bind(this);
    this.handleToProfile = this.handleToProfile.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleExitEdit = this.handleExitEdit.bind(this);
    this.handleBanner = this.handleBanner.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
  } // lifecycle methods


  async componentDidMount() {
    window.addEventListener('resize', this.handleResize); // check if has previously loaded, so page can know to blur
    //if(localStorage.getItem('hasLoaded')!=='true')
    // check if account exists, load defaults if no account

    if (this.state.account === undefined) {
      // load Web3 & UME contracts
      await this.loadWeb3().catch(e => console.error(e));
      await this.loadContracts().catch(e => console.error(e));
    } // automatically emit account updates


    const checkEntered = localStorage.getItem('hasEntered'),
          checkHelp = localStorage.getItem('help');

    if (checkEntered) {
      this.setState({
        entered: true
      });
    }

    if (checkHelp === 'false') {
      this.setState({
        help: false
      });
    }

    if (window.ethereum) {
      this.chainListen();
    }
  }

  componentDidUpdate() {
    let showBanner = false;

    if (this.state.editing || this.state.writing || this.state.replying) {}
  }

  async componentWillUnmount() {
    window.clearInterval();
    (0, _Animation.fadeOut)('.App', 1500);
  } // handles


  handleEntered(entered) {
    if (entered) {
      localStorage.setItem('hasEntered', 'true');
    }

    this.setState({
      entered
    });
  }

  handleRegistered(e) {
    console.log('registered: ' + e);
    if (e === 'writing') this.setState({
      writing: true
    });else if (e === 'registered') (0, _Animation.expandToFadeOut)('div.PageLoader', 1000);
    setTimeout(() => this.setState({
      registered: true,
      writing: false
    }), 1000);
  }

  handleToProfile(e) {
    this.main.handleToProfile(e);
  }

  handleCreateMeme(creatingMeme) {
    const app = document.querySelectorAll('div.App');
    app.forEach(e => e.style.overflow = 'hidden');
    this.setState({
      creatingMeme
    });
  }

  handleExitCreate(creatingMeme) {
    const app = document.querySelectorAll('div.App');
    app.forEach(e => e.style.overflow = 'auto');
    this.setState({
      creatingMeme
    });
  }

  handleReply(replying) {
    const app = document.querySelectorAll('div.App');
    app.forEach(e => e.style.overflow = 'hidden');
    this.setState({
      replying
    });
  }

  handleExitReply(replying) {
    const app = document.querySelectorAll('div.App');
    app.forEach(e => e.style.overflow = 'auto');
    this.setState({
      replying
    });
  }

  handleEdit(editing) {
    const app = document.querySelectorAll('div.App');
    app.forEach(e => e.style.overflow = 'hidden');
    this.setState({
      editing
    });
  }

  handleExitEdit(editing) {
    const app = document.querySelectorAll('div.App');
    app.forEach(e => e.style.overflow = 'auto');
    this.setState({
      editing
    });
  }

  handleScroll(e) {
    if (e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 150) {
      this.setState({
        atBottom: true
      });
    } else this.setState({
      atBottom: false
    });

    this.setState({
      offsetY: e.target.scrollTop,
      appHeight: e.target.clientHeight
    }); //const banner = document.querySelector('div.Banner')
    //banner.style.top = 'calc(1% + ' + e.target.scrollTop + 'px)'
  }

  handleResize(ContainerSize, event) {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  }

  handleBanner(e) {
    const regex = /\W/g,
          id = e[2].replace(regex, '_'),
          loadingIndex = this.state.banners.findIndex(elem => elem.props.type === 'Loading'),
          index = this.state.banners.findIndex(elem => elem.props.message === e[1] && elem.props.bannerId === id),
          key = index !== -1 ? index : this.state.banners.length,
          banner = /*#__PURE__*/_react.default.createElement(_Banner.default, {
      key: key,
      type: e[0],
      message: e[1],
      bannerId: id,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 187,
        columnNumber: 20
      }
    });

    if (e[0] === 'Waiting') {
      this.setState({
        banners: [...this.state.banners, banner]
      });
    } else if (e[0] === 'Loading') {
      if (loadingIndex !== -1) {
        (0, _Animation.fadeOut)('div#Banner-' + id, 200);
        setTimeout(() => {
          this.setState({
            banners: [...this.state.banners.slice(0, loadingIndex), ...this.state.banners.slice(loadingIndex + 1)]
          });
          this.setState({
            banners: [...this.state.banners, banner]
          });
        }, 200);
      } else this.setState({
        banners: [...this.state.banners, banner]
      });
    } else if (e[0] === 'Writing' && index !== -1) {
      this.setState({
        banners: [...this.state.banners.slice(0, index), banner, ...this.state.banners.slice(index + 1)]
      });
    } else if (e[0] === 'Success' && index !== -1) {
      this.setState({
        banners: [...this.state.banners.slice(0, index), banner, ...this.state.banners.slice(index + 1)]
      });
      (0, _Animation.fadeOut)('div#Banner-' + id, 1000);
      setTimeout(() => {
        setTimeout(() => {
          this.setState({
            banners: [...this.state.banners.slice(0, index), ...this.state.banners.slice(index + 1)]
          });
        }, 400);
      }, 600);
    } else if (e[0] === 'Cancel' && index !== -1) {
      (0, _Animation.fadeOut)('div#Banner-' + id, 200);
      setTimeout(() => {
        console.log('index ' + index);
        this.setState({
          banners: [...this.state.banners.slice(0, index), ...this.state.banners.slice(index + 1)]
        });
      }, 200);
    }

    console.log(this.state.banners);
  }

  async request() {
    window.ethereum.request({
      method: 'eth_requestAccounts'
    }).catch(e => {
      if (e.code === 4001) {
        this.setState({
          connected: false
        });
        console.log('Please connect to MetaMask.');
        this.request();
      } else {
        this.setState({
          connected: false
        });
        console.error(e);
      }
    });
  }

  chainListen() {
    window.ethereum.on('accountsChanged', account => {
      console.log('account change detected ' + account);

      if (this.state.account !== undefined) {
        console.log('account disconnected');
        this.setState({
          registered: false,
          contractLoading: true
        });
        localStorage.clear();
        this.loadContracts().catch(e => console.error(e));
        this.request();
      } else if (this.state.account === undefined) {
        // account works
        console.log('account connected');
        this.setState({
          contractLoading: true
        });
        this.loadContracts().catch(e => console.error(e));
      }
    });
    window.ethereum.on('message', message => {
      console.log('chain change detected');
      console.log(message); //this.setState({ bannerActive: false })
      //this.setState({ contractLoading: true })
      //this.loadContracts().catch(e => console.error(e))
    });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new _web.default(window.ethereum);
      this.setState({
        metaMask: true
      });
      this.request();
    } else if (window.web3) {
      this.setState({
        metaMask: true
      });
      window.web3 = new _web.default(window.web3.currentProvider);
    } else {
      this.setState({
        metaMask: false
      }); //window.alert('Non-Ethereum browser detected. You should consider trying Metamask!')
    }
  }

  async loadContracts() {
    const web3 = window.web3,
          accounts = await web3.eth.getAccounts(),
          network = parseInt(await window.ethereum.networkVersion),
          balance = parseInt(await web3.eth.getBalance(accounts[0]));
    this.setState({
      account: accounts[0]
    });

    if ((await network) === 3 && (await balance) > 0) {
      this.setState({
        hasEth: true
      });
    } // retrieve NetId into constants


    const netId = await web3.eth.net.getId(),
          umeNetData = _UME.default.networks[netId],
          interfaceNetData = _UserInterface.default.networks[netId],
          userStorageNetData = _UserStorage.default.networks[netId],
          memeStorageNetData = _MemeStorage.default.networks[netId],
          memeFactoryNetData = _MemeFactory.default.networks[netId]; // check if Contract netData is valid

    if (umeNetData && interfaceNetData && userStorageNetData && memeStorageNetData) {
      const ume = new web3.eth.Contract(_UME.default.abi, umeNetData.address),
            memeStorage = new web3.eth.Contract(_MemeStorage.default.abi, memeStorageNetData.address),
            memeFactory = new web3.eth.Contract(_MemeFactory.default.abi, memeFactoryNetData.address),
            userStorage = new web3.eth.Contract(_UserStorage.default.abi, userStorageNetData.address),
            uInterface = new web3.eth.Contract(_UserInterface.default.abi, interfaceNetData.address); // app state from BlockChain

      this.setState({
        ume,
        userStorage,
        memeStorage,
        memeFactory,
        interface: uInterface
      }); // retrieve Blockchain data for development purposes, display to console

      const memeCount = await memeStorage.methods.memeCount().call().catch(e => console.error(e)),
            userMemeCount = await userStorage.methods.getPosts(this.state.account).call().then(e => e.length).catch(e => console.error(e)),
            userCount = await userStorage.methods.userCount().call().catch(e => console.error(e)),
            umeBalance = await ume.methods.balanceOf(this.state.account).call().then(elem => parseInt(elem)).catch(e => console.error(e));
      this.setState({
        memeCount,
        userMemeCount,
        umeBalance
      });
      console.log('meme count: ' + memeCount);
      console.log('user meme count: ' + userMemeCount);
      console.log('user count: ' + userCount); // load Account

      await this.loadAccount().catch(e => console.error(e)); // mark contract as loaded

      if (this.state.contractLoading) {
        if (this.state.registered) {
          (0, _Animation.expandToFadeOut)('div.PageLoader', 1000);
          (0, _Animation.fadeOut)('div#Border-Spinner', 150);
          setTimeout(() => {
            this.setState({
              contractLoading: false
            }); //blurToFadeIn('div.App', 1000)
          }, 1000);
        } else {
          (0, _Animation.fadeOut)('div#Border-Spinner', 800);
          (0, _Animation.fadeOut)('div.PageLoader', 1000);
          setTimeout(() => {
            this.setState({
              contractLoading: false
            });
          }, 1000);
        }
      }
    } else {
      window.alert('UME not deployed to detected network.\n' + 'Please connect to Ropsten Ethereum Test Network.');
    }
  }

  async loadAccount() {
    // helper function to return whether or not user exists on blockchain
    const profileExists = async () => {
      if (this.state.account !== undefined) return await this.state.userStorage.methods.userExists(this.state.account).call().catch(e => console.error(e));
    };

    if (await profileExists()) {
      console.log('account exists');
      this.setState({
        registered: true
      });
    } else if (window.ethereum) {
      this.setState({
        registered: false
      });
      console.log('wallet not connected');
    } else if ((await profileExists()) === false) {
      this.setState({
        registered: false
      });
      console.log('account doesn\'t exist');
    }
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "App",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 387,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "Banners",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 390,
        columnNumber: 9
      }
    }, this.state.banners), this.state.contractLoading && this.state.account !== undefined ? /*#__PURE__*/_react.default.createElement(_PageLoader.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 392,
        columnNumber: 15
      }
    }) : this.state.account === undefined ? this.state.metaMask ? /*#__PURE__*/_react.default.createElement(_NoWallet.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 395,
        columnNumber: 21
      }
    }) : /*#__PURE__*/_react.default.createElement(_NoMetaMask.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 396,
        columnNumber: 21
      }
    }) : this.state.registered ? /*#__PURE__*/_react.default.createElement("div", {
      id: "App-body",
      className: "App",
      onScroll: this.handleScroll,
      ref: Ref => this.app = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 398,
        columnNumber: 19
      }
    }, this.state.creatingMeme || this.state.replying || this.state.editing ? this.state.creatingMeme ? /*#__PURE__*/_react.default.createElement(_CreateMeme.default, {
      account: this.state.account,
      offsetY: this.state.offsetY,
      handleExitCreate: this.handleExitCreate,
      handleBanner: this.handleBanner,
      userStorage: this.state.userStorage,
      interface: this.state.interface,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 406,
        columnNumber: 27
      }
    }) : this.state.replying ? /*#__PURE__*/_react.default.createElement(_Reply.default, {
      account: this.state.account,
      username: this.state.replying[0],
      address: this.state.replying[1],
      author: this.state.replying[2],
      text: this.state.replying[3],
      memeId: this.state.replying[4],
      parentId: this.state.replying[5],
      originId: this.state.replying[6],
      offsetY: this.state.offsetY,
      handleExitReply: this.handleExitReply,
      handleToProfile: this.handleToProfile,
      handleBanner: this.handleBanner,
      userStorage: this.state.userStorage,
      memeStorage: this.state.memeStorage,
      interface: this.state.interface,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 415,
        columnNumber: 29
      }
    }) : this.state.editing ? /*#__PURE__*/_react.default.createElement(_EditProfile.default, {
      account: this.state.account,
      username: this.state.editing[0],
      address: this.state.editing[1],
      bio: this.state.editing[2],
      offsetY: this.state.offsetY,
      handleExitEdit: this.handleExitEdit,
      handleBanner: this.handleBanner,
      userStorage: this.state.userStorage,
      interface: this.state.interface,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 433,
        columnNumber: 31
      }
    }) : '' : '', /*#__PURE__*/_react.default.createElement(_Main.default, {
      account: this.state.account,
      userStorage: this.state.userStorage,
      memeStorage: this.state.memeStorage,
      interface: this.state.interface,
      ume: this.state.ume,
      memeCount: this.state.memeCount,
      userMemeCount: this.state.userMemeCount,
      umeBalance: this.state.umeBalance,
      memeIdsByBoost: this.state.memeIdsByBoost,
      contractLoading: this.state.contractLoading,
      atBottom: this.state.atBottom,
      offsetY: this.state.offsetY,
      handleCreateMeme: this.handleCreateMeme,
      handleReply: this.handleReply,
      handleEdit: this.handleEdit,
      handleBanner: this.handleBanner,
      handleProfileChange: this.handleProfileChange,
      ref: Ref => this.main = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 447,
        columnNumber: 21
      }
    })) : this.state.entered ? this.state.writing ? /*#__PURE__*/_react.default.createElement(_PageLoader.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 470,
        columnNumber: 25
      }
    }) : !this.state.hasEth ? /*#__PURE__*/_react.default.createElement(_NoEth.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 472,
        columnNumber: 29
      }
    }) : /*#__PURE__*/_react.default.createElement(_CreateUser.default, {
      account: this.state.account,
      handleRegistered: this.handleRegistered,
      interface: this.state.interface,
      handleBanner: this.handleBanner,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 473,
        columnNumber: 29
      }
    }) : /*#__PURE__*/_react.default.createElement(_Enter.default, {
      account: this.state.account,
      hasEntered: this.handleEntered,
      contractLoading: this.state.contractLoading,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 479,
        columnNumber: 21
      }
    }));
  }

}

var _default = App;
exports.default = _default;