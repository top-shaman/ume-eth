"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.array.sort.js");

var _react = _interopRequireDefault(require("react"));

var _NavBar = _interopRequireDefault(require("../NavBar/NavBar"));

var _Stats = _interopRequireDefault(require("../Stats/Stats"));

var _Timeline = _interopRequireDefault(require("../Timeline/Timeline"));

var _Profile = _interopRequireDefault(require("../Profile/Profile"));

var _Thread = _interopRequireDefault(require("../Thread/Thread"));

var _UpvotePopup = _interopRequireDefault(require("../Popups/UpvotePopup"));

var _DownvotePopup = _interopRequireDefault(require("../Popups/DownvotePopup"));

var _SortButton = _interopRequireDefault(require("../SortButton/SortButton"));

var _Loader = _interopRequireDefault(require("../Loader/Loader"));

var _Helpers = require("../../resources/Libraries/Helpers");

var _Animation = require("../../resources/Libraries/Animation");

require("./Main.css");

var _arrowLeft = _interopRequireDefault(require("../../resources/arrow-left.svg"));

var _jsxFileName = "/Users/jaiq/Documents/000 BLOCKCHAIN/ETH/uMe/src/components/Main/Main.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Main extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: this.props.account,
      userStorage: this.props.userStorage,
      memeStorage: this.props.memeStorage,
      interface: this.props.interface,
      ume: this.props.ume,
      memeCount: this.props.memeCount,
      userMemeCount: this.props.userMemeCount,
      umeBalance: this.props.umeBalance,
      sort: 'boost',
      timelineLoading: false,
      profileLoading: false,
      threadLoading: false,
      refreshing: false,
      lastPage: [['timeline', '0x0']],
      back: false,
      activePopup: null,
      popupMeme: null,
      popupX: null,
      popupY: null,
      popup: null,
      offsetX: 0,
      offsetY: 0,
      startingWidth: null,
      reload: false,
      focusPage: 'timeline',
      atBottom: this.props.atBottom
    }; // references

    this.main = /*#__PURE__*/_react.default.createRef();
    this.body = /*#__PURE__*/_react.default.createRef();
    this.timeline = /*#__PURE__*/_react.default.createRef();
    this.profile = /*#__PURE__*/_react.default.createRef();
    this.thread = /*#__PURE__*/_react.default.createRef();
    this.stats = /*#__PURE__*/_react.default.createRef(); // page overlay handles

    this.handleCreateMeme = this.handleCreateMeme.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleLoading = this.handleLoading.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleBalance = this.handleBalance.bind(this); // page navigation handles

    this.handleToTimeline = this.handleToTimeline.bind(this);
    this.handleToProfile = this.handleToProfile.bind(this);
    this.handleToThread = this.handleToThread.bind(this);
    this.handleToSettings = this.handleToSettings.bind(this);
    this.handleUpvotePopup = this.handleUpvotePopup.bind(this);
    this.handleDownvotePopup = this.handleDownvotePopup.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleBanner = this.handleBanner.bind(this);
  } // lifecycles


  async componentDidMount() {
    if (this.state.lastPage !== null) console.log('coming from ' + this.state.lastPage); // if previously loaded, no blur entrance

    if (localStorage.getItem('hasLoaded') !== 'true') {
      //blurToFadeIn('.Main #subheader', 2000)
      //blurToFadeIn('.Main #header', 2000)
      //blurToFadeIn('div.Main', 2000)
      localStorage.setItem('hasLoaded', 'true'); //localStorage.setItem('hasLoaded', 'true')
    } // blur entrance for dev purposes


    (0, _Animation.blurToFadeIn)('div.App', 2000); // by default, set User Account's user info for profile navigation

    this.setState({
      profileUsername: await this.state.userStorage.methods.getName(this.props.account).call().then(async e => await (0, _Helpers.fromBytes)(e)),
      profileAddress: await this.state.userStorage.methods.getUserAddr(this.props.account).call().then(async e => await (0, _Helpers.fromBytes)(e)),
      profileAccount: this.state.account
    });

    if (localStorage.getItem('focusPage') === 'timeline') {
      localStorage.setItem('timelineSort', 'time');
    } // if previously on profile page, set to profile page upon reload
    // change profile query with one parameter

    /*
    if(localStorage.getItem('focusPage')==='profile') {
      if(localStorage.getItem('userInfo').split(',').length===3){
        const profile = localStorage.getItem('userInfo').split(',')
        if(profile.length===3) {
          if(is32Bytes(profile[0]) && is32Bytes(profile[1])) {
            this.setState({
              profileUsername: await fromBytes(profile[0]),
              profileAddress: await fromBytes(profile[1]),
              profileAccount: profile[2]
            })
          }
          else {
            this.setState({
              profileUsername: profile[0],
              profileAddress: profile[1],
              profileAccount: profile[2]
            })
          }
          this.setState({ focusPage: 'profile' })
        }
      }
    }
    */
    // if previously on a thread, set to thread upon reload

  }

  componentWillUnmount() {
    window.clearInterval();
  } // handles
  // meme creation


  handleCreateMeme(e) {
    this.props.handleCreateMeme(e); // blur out Main section upon Meme Creation

    (0, _Animation.blur)('div.Main', 500);
  }

  handleReply(e) {
    this.props.handleReply(e); // blur out Main section upon Reply Creation

    (0, _Animation.blur)('div.Main', 500);
  }

  handleEdit(e) {
    this.props.handleEdit(e);
    (0, _Animation.blur)('div.Main', 500);
  }

  handleUpvotePopup(e) {
    const element = e[0].target.getBoundingClientRect(),
          offsetY = this.props.offsetY ? this.props.offsetY : 0; // if already pop'd up, or another upvote button, close

    (0, _Animation.fadeOut)('div#upvote-popup', 300);

    if (this.state.popupMeme === e[1] && this.state.activePopup === 'upvote') {
      this.setState({
        activePopup: null,
        popupMeme: null,
        popup: null,
        popupX: null,
        popupY: null
      });
    } else if (this.state.activePopup !== 'upvote' || this.state.popupMeme !== e[1]) {
      this.setState({
        activePopup: null,
        popupMeme: null,
        popup: null,
        popupX: null,
        popupY: null
      });
      setTimeout(() => {
        this.setState({
          popup: e[0].target,
          popupMeme: e[1],
          popupX: element.x,
          popupY: element.y + offsetY,
          activePopup: 'upvote'
        });
      }, 10);
    }
  }

  handleDownvotePopup(e) {
    const element = e[0].target.getBoundingClientRect(),
          offsetY = this.props.offsetY ? this.props.offsetY : 0;
    (0, _Animation.fadeOut)('div#downvote-popup', 300);

    if (this.state.popupMeme === e[1] && this.state.activePopup === 'downvote') {
      this.setState({
        activePopup: null,
        popupMeme: null,
        popup: null,
        popupX: null,
        popupY: null
      });
    } else if (this.state.activePopup !== 'downvote' || this.state.popupMeme !== e[1]) {
      this.setState({
        activePopup: null,
        popupMeme: null,
        popup: null,
        popupX: null,
        popupY: null
      });
      setTimeout(() => {
        this.setState({
          popup: e[0].target,
          popupMeme: e[1],
          popupX: element.x,
          popupY: element.y + offsetY,
          activePopup: 'downvote'
        });
      }, 10);
    }
  }

  handleClose(activePopup) {
    this.setState({
      activePopup
    });
  } // refresh functionality


  async handleRefresh(handleRefresh) {
    this.setState({
      handleRefresh
    });
    if (handleRefresh) console.log('refreshing: ' + this.state.focusPage);else console.log(this.state.focusPage + ' refreshed');
    if (this.stats) await this.stats.setInfo().catch(e => console.error(e));
  }

  async handleRefreshClick(e) {
    e.preventDefault();

    if (this.state.focusPage === 'timeline' && !this.state.loading && this.timeline) {
      await this.timeline.loadNewMemes();
      await this.timeline.refreshMemes();
    } else if (this.state.focusPage === 'profile' && !this.state.loading && this.profile) {
      await this.profile.loadNewMemes();
      await this.profile.refreshMemes();
    } else if (this.state.focusPage === 'thread' && !this.state.loading && this.thread) {
      await this.thread.refreshMemes();
    }
  }

  handleLoading(loading) {
    this.setState({
      loading
    });
    console.log(this.state.focusPage + ' loading: ' + this.state.loading);
  }

  handleSort(e) {
    this.setState({
      sort: e[1],
      focusPage: null
    });
    this.handleToTimeline(e[0]);
  }

  handleBalance(umeBalance) {
    this.setState({
      umeBalance
    });
  }

  async handleBack(e) {
    console.log(this.state.lastPage);
    const index = this.state.lastPage.length - 2,
          id = this.state.lastPage[index][1];
    console.log(index);
    console.log(id);

    if (this.state.lastPage[index][0] === 'timeline') {
      await this.handleToTimeline(e);
    } else if (this.state.lastPage[index][0] === 'profile') {
      this.setState({
        lastPage: this.state.lastPage.pop()
      });
      this.setState({
        lastPage: this.state.lastPage.pop()
      });
      await this.handleToProfile(id);
    } else if (this.state.lastPage[index][0] === 'thread') {
      this.setState({
        lastPage: this.state.lastPage.pop()
      });
      this.setState({
        lastPage: this.state.lastPage.pop()
      });
      await this.handleToThread(id);
    }
  }

  async handleToTimeline(e) {
    e.preventDefault();
    console.log('coming from: ' + this.state.focusPage);
    console.log('timeline loading: ' + this.state.timelineLoading);
    this.clearPopups();

    if (this.state.focusPage !== 'timeline') {
      this.setState({
        lastPage: [['timeline', '0x0']],
        back: false
      });
    }

    setTimeout(() => {
      this.setState({
        focusPage: 'timeline',
        //sort: localStorage.getItem('timelineSort'),
        memeId: null
      });
    }, 50);
    console.log('timeline loading: ' + this.state.timelineLoading);
  }

  async handleToProfile(e) {
    this.setState({
      lastPage: [...this.state.lastPage, ['profile', e]]
    });

    if (this.state.profileAccount !== e) {
      this.setState({
        focusPage: null
      });
    }

    this.clearPopups();
    this.setState({
      profileUsername: await this.state.userStorage.methods.getName(e).call().then(async e => await (0, _Helpers.fromBytes)(e)),
      profileAddress: await this.state.userStorage.methods.getUserAddr(e).call().then(async e => await (0, _Helpers.fromBytes)(e)),
      profileAccount: e
    }); // add to lastPage

    await this.headerInfo(); // update local storage

    localStorage.setItem('userInfo', e);
    setTimeout(() => {
      if (this.state.focusPage !== 'profile') {
        this.setState({
          focusPage: 'profile',
          memeId: null
        });
      }
    }, 50);
  }

  async handleToThread(e) {
    this.setState({
      lastPage: [...this.state.lastPage, ['thread', e]]
    });
    console.log('leaving page: ' + this.state.focusPage);

    if (this.state.memeId !== e) {
      this.setState({
        focusPage: null
      });
    }

    this.clearPopups();
    this.setState({
      memeId: e
    });
    setTimeout(() => {
      if (this.state.focusPage !== 'thread') {
        this.setState({
          focusPage: 'thread'
        });
      }
    }, 50);
  }

  handleToSettings(e) {}

  handleBanner(e) {
    this.props.handleBanner(e);
  }

  async headerInfo() {
    const memeIds = await this.state.userStorage.methods.getPosts(this.state.profileAccount).call();
    let totalLikes = 0;

    for (let i = 0; i < memeIds.length; i++) {
      totalLikes += await this.state.memeStorage.methods.getLikeCount(memeIds[i]).call().then(likeCount => parseInt(likeCount));
    }

    this.setState({
      totalLikes,
      userMemeCount: memeIds.length
    });
  }

  clearPopups() {
    this.setState({
      activePopup: null
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "Main",
      ref: Ref => this.main = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 367,
        columnNumber: 7
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "side-header",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 371,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement(_NavBar.default, {
      account: this.state.account,
      handleCreateMeme: this.handleCreateMeme,
      handleRefreshClick: this.handleRefreshClick,
      handleToTimeline: this.handleToTimeline,
      handleToProfile: this.handleToProfile,
      handleToSettings: this.handleToSettings,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 372,
        columnNumber: 11
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      id: "body",
      ref: Ref => this.body = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 381,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "subheader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 385,
        columnNumber: 11
      }
    }, /*#__PURE__*/_react.default.createElement("section", {
      id: "title",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 386,
        columnNumber: 13
      }
    }, this.state.focusPage !== 'timeline' && this.state.focusPage !== null ? /*#__PURE__*/_react.default.createElement("img", {
      src: _arrowLeft.default,
      alt: "back-arrow",
      onClick: this.handleBack,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 388,
        columnNumber: 21
      }
    }) : '', this.state.focusPage === 'timeline' || this.state.focusPage === null ? /*#__PURE__*/_react.default.createElement("a", {
      href: "#home",
      id: "ume",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 396,
        columnNumber: 19
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "subheader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 397,
        columnNumber: 21
      }
    }, "uMe")) : this.state.focusPage === 'profile' ? /*#__PURE__*/_react.default.createElement("a", {
      href: "#profile",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 402,
        columnNumber: 23
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "profile-subheader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 403,
        columnNumber: 25
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      id: "username",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 404,
        columnNumber: 27
      }
    }, this.state.profileUsername), /*#__PURE__*/_react.default.createElement("span", {
      id: "memes",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 405,
        columnNumber: 27
      }
    }, this.state.userMemeCount + ' Memes | ', this.state.totalLikes === 1 ? this.state.totalLikes + ' Like' : this.state.totalLikes + ' Likes'))) : this.state.focusPage === 'thread' ? /*#__PURE__*/_react.default.createElement("a", {
      href: "#home",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 415,
        columnNumber: 27
      }
    }, /*#__PURE__*/_react.default.createElement("p", {
      id: "thread-subheader",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 416,
        columnNumber: 29
      }
    }, "Thread")) : ''), /*#__PURE__*/_react.default.createElement("section", {
      id: "sort-button",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 423,
        columnNumber: 13
      }
    }, this.state.focusPage === 'timeline' ? /*#__PURE__*/_react.default.createElement(_SortButton.default, {
      handleSort: this.handleSort,
      sort: this.state.sort,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 425,
        columnNumber: 21
      }
    }) : '')), this.state.activePopup === null ? '' : this.state.activePopup === 'upvote' ? /*#__PURE__*/_react.default.createElement(_UpvotePopup.default, {
      positionX: "".concat(this.state.popupX - this.body.getBoundingClientRect().left),
      positionY: "".concat(this.state.popupY),
      account: this.state.account,
      memeId: this.state.popupMeme,
      umeBalance: this.state.umeBalance,
      handleClose: this.handleClose,
      handleBanner: this.handleBanner,
      interface: this.state.interface,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 433,
        columnNumber: 21
      }
    }) : this.state.activePopup === 'downvote' ? /*#__PURE__*/_react.default.createElement(_DownvotePopup.default, {
      positionX: "".concat(this.state.popupX - this.body.getBoundingClientRect().left),
      positionY: "".concat(this.state.popupY),
      account: this.state.account,
      memeId: this.state.popupMeme,
      umeBalance: this.state.umeBalance,
      handleClose: this.handleClose,
      handleBanner: this.handleBanner,
      interface: this.state.interface,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 444,
        columnNumber: 25
      }
    }) : '', this.state.focusPage === 'timeline' //&& !this.state.reload
    ? /*#__PURE__*/_react.default.createElement(_Timeline.default, {
      account: this.state.account,
      userStorage: this.state.userStorage,
      memeStorage: this.state.memeStorage,
      memeCount: this.state.memeCount,
      interface: this.state.interface,
      memeIdsByBoost: this.props.memeIdsByBoost,
      loading: this.state.loading,
      sort: this.state.sort,
      handleLoading: this.handleLoading,
      handleRefresh: this.handleRefresh,
      contractLoading: this.props.contractLoading,
      handleToProfile: this.handleToProfile,
      handleToThread: this.handleToThread,
      handleReply: this.handleReply,
      handleUpvotePopup: this.handleUpvotePopup,
      handleDownvotePopup: this.handleDownvotePopup,
      handleBanner: this.handleBanner,
      handleHeight: this.handleHeight,
      atBottom: this.props.atBottom,
      ref: Ref => this.timeline = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 457,
        columnNumber: 15
      }
    }) : this.state.focusPage === 'profile' //&& !this.state.reload
    ? /*#__PURE__*/_react.default.createElement(_Profile.default, {
      account: this.state.account,
      userStorage: this.state.userStorage,
      memeStorage: this.state.memeStorage,
      userMemeCount: this.state.userMemeCount,
      interface: this.state.interface,
      loading: this.state.loading,
      handleLoading: this.handleLoading,
      handleRefresh: this.handleRefresh,
      contractLoading: this.props.contractLoading,
      handleToProfile: this.handleToProfile,
      handleToThread: this.handleToThread,
      handleReply: this.handleReply,
      handleEdit: this.handleEdit,
      handleUpvotePopup: this.handleUpvotePopup,
      handleDownvotePopup: this.handleDownvotePopup,
      handleBanner: this.handleBanner,
      handleHeight: this.handleHeight,
      profileUsername: this.state.profileUsername,
      profileAddress: this.state.profileAddress,
      profileAccount: this.state.profileAccount,
      atBottom: this.props.atBottom,
      ref: Ref => this.profile = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 480,
        columnNumber: 17
      }
    }) : this.state.focusPage === 'thread' ? /*#__PURE__*/_react.default.createElement(_Thread.default, {
      account: this.state.account,
      userStorage: this.state.userStorage,
      memeStorage: this.state.memeStorage,
      userMemeCount: this.state.userMemeCount,
      interface: this.state.interface,
      loading: this.state.loading,
      handleLoading: this.handleLoading,
      handleRefresh: this.handleRefresh,
      contractLoading: this.props.contractLoading,
      handleToProfile: this.handleToProfile,
      handleToThread: this.handleToThread,
      handleReply: this.handleReply,
      handleUpvotePopup: this.handleUpvotePopup,
      handleDownvotePopup: this.handleDownvotePopup,
      handleBanner: this.handleBanner,
      handleHeight: this.handleHeight,
      atBottom: this.props.atBottom,
      ref: Ref => this.thread = Ref,
      memeId: this.state.memeId
      /*
        memeUsername={this.state.memeUsername}
        memeAddress={this.state.memeAddress}
        text={this.state.text}
        time={this.state.time}
        likes={this.state.likes}
        likers={this.state.likers}
        responses={this.state.responses}
        rememeCount={this.state.rememeCount}
        rememes={this.state.rememes}
        quoteCount={this.state.quoteCount}
        quoteMemes={this.state.quoteMemes}
        repostId={this.state.repostId}
        parentId={this.state.parentId}
        originId={this.state.originId}
        author={this.state.author}
        isVisible={this.state.isVisible}
        visibleText={this.state.visibleText}
        userHasLiked={this.state.userHasLiked}
        */
      ,
      userAccount: this.state.account,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 505,
        columnNumber: 21
      }
    }) : /*#__PURE__*/_react.default.createElement(_Loader.default, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 547,
        columnNumber: 21
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      id: "side-footer",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 550,
        columnNumber: 9
      }
    }, /*#__PURE__*/_react.default.createElement(_Stats.default, {
      account: this.state.account,
      userStorage: this.state.userStorage,
      memeStorage: this.state.memeStorage,
      ume: this.state.ume,
      handleToProfile: this.handleToProfile,
      handleBalance: this.handleBalance,
      ref: Ref => this.stats = Ref,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 551,
        columnNumber: 11
      }
    })));
  }

}

var _default = Main;
exports.default = _default;